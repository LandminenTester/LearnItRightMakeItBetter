# Repository Service

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20 ·
**FRs:** FR-REPO-001…007 · **Epic:** [E-09](../requirements/epics/e-09-open-source-integration/README.md) ·
**Schema:** [database/schemas/repository.md](../database/schemas/repository.md)

## 1. Zweck & Verantwortlichkeiten

Open-Source-Integration (Fachkonzept §10):

- **Projekte** als präsentierbare Entität (Owner: Nutzer oder Organisation)
- Optionale **Repository-Verknüpfung** (GitHub in 1.0) pro Projekt
- Automatischer **Metadaten-Sync**: Name, Beschreibung, Primärsprache + Sprachverteilung,
  Stars, Forks, offene Issues, letzte Aktivität, Releases, Lizenz
- Sync-Steuerung: Intervall, manueller Refresh, Rate-Limit-Handling, Statussichtbarkeit
- Provider-Abstraktion (`RepositoryProvider`-Interface) für spätere GitLab-/Gitea-Adapter

## 2. Abgrenzung

Kein Code-/Issue-Hosting, kein Webhook-Empfang (1.0 ist Poll-basiert), keine
Repo-Zugriffsrechte-Spiegelung. Artikel-Verknüpfung: Beziehung gehört `knowledge`
(FR-KNOW-013); `repository` liefert die Projektbox-Daten.

## 3. Domänenmodell

- `Project` — `slug` (unique je Owner), `name`, `description` (Markdown), `tags[]`,
  `ownerType` (`user`|`organization`), `ownerId`, `visibility` (`public`|`unlisted`),
  `status` (`active`|`archived`).
- `RepositoryLink` — 1:1 zu Project (1.0): `provider` (`github`), `owner`, `repo`,
  `syncEnabled`, `syncStatus` (`ok`|`deferred`|`broken`), `lastSyncAt`, `lastErrorAt?`,
  `etag?`.
- `RepositoryMetadata` — 1:1 zu Link: `description`, `stars`, `forks`, `openIssues`,
  `primaryLanguage`, `languages` (JSON, Prozentanteile), `license`, `defaultBranch`,
  `pushedAt`, `latestRelease` (JSON: tag, name, publishedAt, url), `topics[]`, `syncedAt`.

## 4. Fachliche Regeln

- **R-1:** Projekte funktionieren vollständig ohne Repo-Verknüpfung (FR-REPO-001) — die
  Verknüpfung ist Zusatz, nie Voraussetzung.
- **R-2:** Verknüpfen validiert das Repo sofort (Erst-Sync synchron angestoßen als Job mit
  UI-Statuspolling); nicht erreichbare/private Repos werden abgelehnt (US-09-02).
- **R-3:** Sync-Zyklus: Repeatable Job je Intervall (Default 6 h, konfigurierbar 1–24 h)
  verteilt Einzeljobs zeitversetzt (Jitter) über alle aktiven Links; ETags minimieren
  Rate-Limit-Verbrauch; manueller Refresh mit Cooldown 5 min.
- **R-4:** Rate-Limit-Handling: bei 403/429 mit `X-RateLimit-Remaining: 0` wird die Queue bis
  `X-RateLimit-Reset` pausiert (`syncStatus = deferred`); kein Fehler an Endnutzer.
- **R-5:** 404/410/451 ⇒ `syncStatus = broken`, Metadaten bleiben mit letztem Stand + Warnhinweis
  sichtbar, Owner wird einmalig benachrichtigt; erneuter manueller Sync kann reaktivieren.
- **R-6:** Instanz-Token (klassisch oder GitHub-App-Installation) verschlüsselt gespeichert;
  ohne Token gilt das anonyme Limit (60 req/h) mit UI-Hinweis (FR-REPO-005).
- **R-7:** Provider-Interface: `getRepository`, `getLanguages`, `getLatestRelease`,
  `parseRateLimit` — GitHub-Adapter ist Referenzimplementierung; neue Provider ausschließlich
  als Adapter (NFR-044).
- **R-8:** Verknüpfung behauptet **keine** Ownership des Repos; Moderation
  (`repository.project.moderate`) kann irreführende Verknüpfungen lösen.

## 5. Schnittstellen

**API (Auszug):** `/projects` (CRUD), `/projects/:id/repository` (link/unlink/refresh/status),
`/users/:handle/projects`, `/orgs/:slug/projects`, Admin: `/admin/repository/settings` (Token,
Intervall, Test).

**Publizierte Events:** `repository.project.created` / `updated` / `deleted`,
`repository.sync.completed` / `failed`.

**Ports:** `RepositoryReadPort.getProjectForIndex(projectId)`,
`RepositoryReadPort.getProjectBox(projectId)` (Artikel-Projektbox).

## 6. Hintergrundjobs

| Job | Queue | Zweck |
|---|---|---|
| `sync-repository` | repo-sync | Einzel-Sync eines Links (idempotent, ETag) |
| `schedule-repo-syncs` | repo-sync | Repeatable: verteilt fällige Einzeljobs mit Jitter |

## 7. Konfiguration

Modul-Flag `repository`; GitHub-Token/App (verschlüsselt); Sync-Intervall; Projekt-Erstellung
offen/beschränkt.

## 8. Sicherheit

Ausgehende Requests nur an die konfigurierte GitHub-API-Basis (kein nutzergesteuertes URL-Ziel
→ SSRF-sicher by design); Antworten werden validiert (Zod) und niemals roh gerendert;
Beschreibungstexte aus GitHub durchlaufen die Sanitizing-Pipeline. Token-Scopes minimal
(`public_repo`-Lesen genügt).

## 9. Offene Punkte

- GitHub-App statt PAT als empfohlener Weg (höhere Limits) — Doku-Empfehlung in Phase 2 schärfen.
- Webhook-Empfang (Push-basierter Sync) — nach 1.0.
- Contributor-Anzeige (Top-Contributors) — nach 1.0, datenschutzbewusst.
