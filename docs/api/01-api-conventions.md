# API-Konventionen

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20

## 1. Grundsätze

- Basis-URL: `/api/v1` — alle Pfade in dieser Doku sind relativ dazu.
- **Ressourcenorientiert:** Substantive im Plural (`/articles`), Aktionen als Sub-Ressourcen
  nur für echte Zustandsübergänge (`POST /articles/:id/publish`).
- Pfade `kebab-case`; JSON-Felder `camelCase`; IDs sind UUIDs; menschenlesbare Adressierung
  über Slugs/Handles, wo definiert (`/spaces/:slug`, `/users/:handle`).
- Alle Zeiten ISO 8601 UTC (`2026-07-20T12:00:00Z`); Sprachen als BCP-47.
- Antworten sind `application/json; charset=utf-8`; Requests mit Body ebenso
  (Ausnahme: Media-Upload multipart).

## 2. HTTP-Methoden & Statuscodes

| Fall | Konvention |
|---|---|
| Lesen | `GET` → 200; nie Seiteneffekte |
| Erstellen | `POST` → 201 + `Location`-Header + erstellte Ressource |
| Vollersatz | `PUT` (selten) → 200 |
| Teiländerung | `PATCH` → 200 + aktualisierte Ressource |
| Löschen | `DELETE` → 204 |
| Zustandsübergang | `POST /…/:id/<aktion>` → 200 (Ergebnis) |
| Asynchron angenommen | 202 + Statusressource (z. B. Media-Upload, Reindex, Export) |
| Validierungsfehler | 422 (Feldfehler), 400 (malformed) |
| AuthN/AuthZ | 401 (keine/ungültige Session), 403 (verboten), **404 statt 403** wenn Existenz nicht preisgegeben werden darf (K-1, O-5) |
| Konflikt | 409 (z. B. Slug vergeben, Versionskonflikt K-7) |
| Rate Limit | 429 + `Retry-After` |
| Modul deaktiviert | 404, Code `module_disabled` |

## 3. Fehlerformat — RFC 9457 Problem Details

Alle Fehler (auch 401/403/404) liefern:

```json
{
  "type": "https://docs.learnitright.dev/errors/validation-failed",
  "title": "Validation failed",
  "status": 422,
  "code": "validation_failed",
  "detail": "2 Felder sind ungültig.",
  "requestId": "req_01J…",
  "errors": [
    { "path": "title", "code": "too_long", "message": "Maximal 160 Zeichen." }
  ]
}
```

- `code` ist der **stabile**, maschinenlesbare Schlüssel (Katalog in `shared-types`,
  z. B. `permission_denied`, `module_disabled`, `version_conflict`, `search_unavailable`,
  `quota_exceeded`, `mfa_required`, `reauth_required`).
- `errors[]` nur bei 422; `path` ist der JSON-Pfad des Feldes.
- Fehlermeldungstexte sind englisch-technisch; die UI übersetzt anhand `code`
  (→ [architecture/03 §5](../architecture/03-frontend-architecture.md)).
- Keine Stacktraces oder internen Details in Antworten (security/05).

## 4. Pagination, Filter, Sortierung

- **Cursor-Pagination** (K-DB-15): `?limit=25&cursor=<opaque>`; Antwort-Envelope:

```json
{ "items": [ … ], "pageInfo": { "nextCursor": "…", "hasMore": true } }
```

- `limit` Default 25, Max 100. Listen ohne `cursor` beginnen bei den neuesten Einträgen.
- Filter als benannte Query-Parameter (`?status=published&type=how_to&tag=nui`);
  Mehrfachwerte durch Wiederholung (`?tag=a&tag=b`).
- Sortierung `?sort=publishedAt:desc` — nur dokumentierte Felder je Endpunkt.
- Suche (`/search`) hat eigene Parameter (→ [endpoints/search.md](endpoints/search.md)).

## 5. Idempotenz & Nebenläufigkeit

- `PUT`/`PATCH`/`DELETE` sind idempotent; kritische `POST`s (Publish, Übersetzungs-Submit)
  akzeptieren optional `Idempotency-Key`-Header (Redis, 24 h Fenster) — gleiche Antwort bei
  Wiederholung.
- Optimistische Sperren, wo spezifiziert (Artikel-Versionierung K-7): Schreib-Requests tragen
  `basedOnVersionId`; Konflikt → 409 `version_conflict`.

## 6. Rate Limiting (NFR-025)

Antwort-Header auf allen limitierten Endpunkten: `RateLimit-Limit`, `RateLimit-Remaining`,
`RateLimit-Reset`. Staffeln (Defaults, instanzkonfigurierbar):

| Kategorie | Limit |
|---|---|
| Auth-Endpunkte (Login, Register, Reset, MFA) | 10/min pro IP + 20/h pro Konto |
| Schreibend (POST/PATCH/DELETE) | 60/min pro Nutzer |
| Suche | 60/min pro Nutzer/IP |
| Media-Upload | 20/h pro Nutzer |
| Lesend öffentlich | 600/min pro IP |

## 7. Caching & Header

- Nutzerspezifische Antworten: `Cache-Control: private, no-store`.
- Öffentliche Leseendpunkte: `Cache-Control: public, max-age=30, stale-while-revalidate=300`
  + `ETag`; Clients senden `If-None-Match` → 304.
- Media-Varianten: `immutable` (MD-2). Alle Antworten tragen `X-Request-Id`.

## 8. Versionierung & Deprecation

- Pfad-Versionierung (`/api/v1`). **Nicht-brechend** (erlaubt in v1): neue Endpunkte, neue
  optionale Felder in Antworten, neue optionale Parameter. **Brechend** (verboten in v1):
  Feld entfernen/umbenennen/Typwechsel, Pflichtparameter ergänzen, Statuscode-Semantik ändern.
- Deprecation einzelner Endpunkte: `Deprecation`- + `Sunset`-Header ≥ 2 Minor-Releases vor
  Entfernung in v2; OpenAPI markiert `deprecated: true`.

## 9. CORS & Einbettung

Standard-Deployment ist same-origin (Reverse Proxy) — CORS aus. Für externe API-Nutzung (PATs)
gilt: keine Cookies, `Authorization`-Header, CORS je Instanz konfigurierbar
(`API_CORS_ORIGINS`). `X-Frame-Options: DENY` global (security/05).
