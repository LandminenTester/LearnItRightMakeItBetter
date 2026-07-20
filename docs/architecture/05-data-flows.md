# Zentrale Datenflüsse

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20

Sequenzdiagramme der architekturprägenden Abläufe. Fachliche Detailregeln stehen in den
jeweiligen [Service-Dokus](../services/README.md).

## 1. OAuth/OIDC-Login (Authorization Code + PKCE)

```mermaid
sequenceDiagram
    participant B as Browser
    participant FE as Frontend (Nuxt)
    participant API as Backend /api/v1
    participant IdP as Provider (Discord/GitHub/OIDC)

    B->>API: GET /auth/providers (aktivierte Provider)
    B->>API: GET /auth/oauth/:provider/start
    API->>API: state + PKCE-Verifier erzeugen, in Redis binden
    API-->>B: 302 → IdP-Authorize-URL
    B->>IdP: Anmeldung & Consent
    IdP-->>B: 302 → /auth/oauth/:provider/callback?code&state
    B->>API: GET /auth/oauth/:provider/callback
    API->>API: state prüfen (Redis, einmalig)
    API->>IdP: Token-Exchange (code + PKCE-Verifier)
    IdP-->>API: id_token/userinfo
    API->>API: Identität auflösen: AuthIdentity vorhanden?<br/>sonst JIT-Provisionierung/Registrierungsmodus prüfen
    API->>API: Session anlegen (Redis+DB), MFA-Pflicht evaluieren
    API-->>B: Set-Cookie (HttpOnly) · 302 → returnTo bzw. MFA-Challenge
    Note over API: Events: identity.user.registered (bei Neuanlage),<br/>Audit: auth.login.succeeded
```

## 2. Artikel-Publikation (Review-Workflow)

```mermaid
sequenceDiagram
    participant A as Autor
    participant API as Backend
    participant R as Reviewer
    participant Q as BullMQ
    participant MS as Meilisearch

    A->>API: POST /articles (draft) → Version 1
    A->>API: POST /articles/:id/submit
    API->>API: Status draft→in_review · Event knowledge.article.submitted
    API->>Q: mail: „Review benötigt" an Space-Reviewer
    R->>API: GET /articles/:id/versions/:v/diff
    R->>API: POST /articles/:id/reviews {approve}
    API->>API: Review gespeichert · Publikationsbedingung erfüllt?
    R->>API: POST /articles/:id/publish
    API->>API: Status in_review→published · publishedVersion fixiert<br/>Event knowledge.article.published (nach Commit)
    API->>Q: index-article · mail an Watcher · reputation-event
    Q->>MS: Dokument(e) upsert (alle Sprachfassungen)
    Note over Q,MS: ≤ 30 s bis auffindbar (NFR-008)
```

## 3. Übersetzung inkl. Outdated-Kaskade

```mermaid
sequenceDiagram
    participant T as Translator
    participant API as Backend
    participant TR as Translation Reviewer
    participant Q as BullMQ

    T->>API: POST /articles/:id/translations {locale: de}
    API->>API: TranslationVersion 1 (sourceVersion = aktuelle Originalversion)
    T->>API: POST /translations/:tid/submit
    TR->>API: POST /translations/:tid/reviews {approve} → publish
    API->>API: translation.published · Leser mit locale=de sehen Übersetzung

    Note over API: später: Original erhält neue publizierte Version
    API->>API: Vergleich sourceVersion ≠ aktuelle Version<br/>→ Status published→outdated
    API->>Q: notify translator + language maintainer (translation.translation.outdated)
    Note over API: Leser sehen Outdated-Banner mit Link zum Original (FR-TRAN-008)
```

## 4. GitHub-Repository-Sync

```mermaid
sequenceDiagram
    participant O as Projekt-Owner
    participant API as Backend
    participant Q as BullMQ (repo-sync)
    participant GH as GitHub API

    O->>API: POST /projects/:id/repository {owner, repo}
    API->>Q: sync-repository (sofort)
    loop Repeatable Job (Intervall konfigurierbar, Default 6 h)
        Q->>GH: GET repo, languages, releases (ETag/If-None-Match)
        alt 200 OK
            GH-->>Q: Metadaten
            Q->>API: RepositoryMetadata upsert · Event repository.sync.completed
            Q->>Q: index-project enqueue
        else 304 Not Modified
            Q->>API: syncedAt aktualisieren
        else 403/429 Rate Limit
            Q->>Q: Backoff bis X-RateLimit-Reset · Status „deferred"
        else 404/410
            Q->>API: Link als broken markieren · Owner benachrichtigen
        end
    end
```

## 5. Media-Upload-Pipeline

```mermaid
sequenceDiagram
    participant U as Nutzer (Editor)
    participant API as Backend
    participant Q as BullMQ (media)
    participant ST as Storage-Adapter

    U->>API: POST /media (multipart)
    API->>API: Validation: Größe, MIME-Allowlist, Magic Bytes, Quota
    API->>ST: Original in Quarantäne-Präfix schreiben
    API-->>U: 202 {mediaId, status: processing}
    API->>Q: process-image
    Q->>Q: Security Check (Re-Decode via Sharp — defekte/böswillige Dateien scheitern hier)
    Q->>Q: EXIF/Metadaten entfernen · Kompression · Varianten (thumb/content/original als WebP+AVIF)
    Q->>ST: Varianten unter finalem Key schreiben · Quarantäne-Objekt löschen
    Q->>API: status=ready · Event media.object.ready
    U->>API: GET /media/:id → URLs/srcset der Varianten
    Note over API,ST: Fehlerfall: status=failed/quarantined · Event media.object.rejected · Audit
```

## 6. Suche (Query-Pfad mit Berechtigungen)

```mermaid
sequenceDiagram
    participant B as Browser
    participant API as Backend (search)
    participant MS as Meilisearch

    B->>API: GET /search?q=…&filters=…
    API->>API: Sichtbarkeitskontext bestimmen:<br/>public | + interne | + Space-/Org-IDs des Nutzers
    API->>MS: Query mit Filter visibility IN (…) AND spaceId IN (…)
    MS-->>API: Treffer + Facetten
    API-->>B: Ergebnisse (ohne nachträgliches Filtern — Filter sind Teil der Query)
    Note over API,MS: Dokumente tragen denormalisierte Sichtbarkeitsfelder;<br/>Änderungen an Space-Sichtbarkeit → Reindex des Space (Job)
```

## 7. Konto-Löschung (DSGVO)

```mermaid
sequenceDiagram
    participant U as Nutzer
    participant API as Backend (identity)
    participant Q as BullMQ

    U->>API: DELETE /users/me (Re-Auth erforderlich)
    API->>API: Konto → status=deleted · PII sofort entfernt/ersetzt<br/>Sessions+Tokens revoked · AuthIdentities gelöscht
    API->>Q: anonymize-user-content
    Q->>Q: Beiträge → Autor „Gelöschtes Mitglied" (CC-BY-SA-konforme Attribution endet auf Wunsch des Urhebers)
    Q->>Q: search: Profil-Dokument entfernen · Media: Avatar löschen
    Note over API: Audit-Event mit pseudonymisierter Referenz bleibt erhalten<br/>Details → database/06-data-lifecycle-gdpr.md
```
