# Endpunkt-Referenz pro Modul

**Status:** Verbindlich · **Stand:** 2026-07-20 ·
Konventionen: [../01-api-conventions.md](../01-api-conventions.md) ·
Auth: [../02-authentication-and-tokens.md](../02-authentication-and-tokens.md)

Ein Dokument pro Modul-Themenbereich. Notation je Endpunkt: Methode, Pfad (relativ zu
`/api/v1`), erforderliche Permission (`—` = öffentlich/`@Public()`, `auth` = nur angemeldet,
sonst Permission-Key mit Scope), Kurzbeschreibung. Detail-Schemas liefert die generierte
OpenAPI-Spec (→ [../05-openapi-workflow.md](../05-openapi-workflow.md)).

| Modul | Referenz |
|---|---|
| Identity (Auth, Konten, Provider, Einladungen) | [identity.md](identity.md) |
| Authorization (Rollen, Gruppen, Policies) | [authorization.md](authorization.md) |
| Profile & Reputation | [profile.md](profile.md) |
| Knowledge (Spaces, Artikel, Reviews, Kommentare) | [knowledge.md](knowledge.md) |
| Translation | [translation.md](translation.md) |
| Organization | [organization.md](organization.md) |
| Search | [search.md](search.md) |
| Repository (Projekte, Sync) | [repository.md](repository.md) |
| Media | [media.md](media.md) |
| Notification | [notification.md](notification.md) |
| Audit | [audit.md](audit.md) |
| Configuration (Setup, Instanz, Module) | [configuration.md](configuration.md) |

**Gemeinsame Regeln:** 404-statt-403 bei Existenz-Schutz; Cursor-Pagination auf allen Listen;
Rate-Limit-Staffeln nach [../01-api-conventions.md §6](../01-api-conventions.md);
Modul-Flags → 404 `module_disabled`.
