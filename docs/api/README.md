# API — Übersicht

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20

Die Plattform bietet eine **REST-API** unter `/api/v1` mit OpenAPI-3.1-Dokumentation,
klaren Contracts und Versionierung (Fachkonzept §7). WebSockets/Event-Streams sind
vorbereitet, aber in 1.0 nicht der primäre Kanal.

## Dokumente

| Dokument | Inhalt |
|---|---|
| [01-api-conventions.md](01-api-conventions.md) | URL-/Naming-Konventionen, Fehlerformat (Problem Details), Pagination, Filter, Idempotenz, Rate-Limit-Header, Deprecation |
| [02-authentication-and-tokens.md](02-authentication-and-tokens.md) | Session-Cookies, CSRF, PAT-Nutzung, OAuth-Flow-Endpunkte |
| [endpoints/](endpoints/README.md) | **Themenordner: Endpunkt-Referenz pro Modul** (12 Dokumente — Methode, Pfad, Permission, Beschreibung) |
| [04-realtime-and-events.md](04-realtime-and-events.md) | Polling-Standard 1.0, SSE/WebSocket-Vorbereitung, Ereignis-Namensraum |
| [05-openapi-workflow.md](05-openapi-workflow.md) | Wie die OpenAPI-Spec entsteht (Code-first + Zod), Client-Generierung, Contract-Prüfung in CI |

## Verbindlichkeit

Die Endpunkt-Referenz beschreibt den fachlichen Contract; die maschinelle Wahrheit ist die
generierte OpenAPI-Spec (`/api/v1/openapi.json`). CI prüft beide gegeneinander auf
Endpunkt-Vollständigkeit (→ [05-openapi-workflow.md](05-openapi-workflow.md)). Breaking
Changes an v1-Endpunkten sind nach Release 1.0 verboten — sie erfordern `/api/v2`
(→ [01-api-conventions.md §8](01-api-conventions.md)).
