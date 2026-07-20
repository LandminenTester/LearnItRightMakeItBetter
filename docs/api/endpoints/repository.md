# API · repository

**Fachregeln:** [services/repository-service.md](../../services/repository-service.md) ·
**Stories:** [E-09](../../requirements/epics/e-09-open-source-integration/user-stories.md)

Modul-Flag `repository`.

## Projekte

| Methode | Pfad | Permission | Beschreibung |
|---|---|---|---|
| GET | `/projects` | — (visibility-gefiltert) | Liste (Filter: owner, tag, language; Sort: stars, activity) |
| POST | `/projects` | `repository.project.create` | Projekt anlegen (Owner: ich oder Org mit `manage`-Recht) |
| GET | `/projects/:id` · `/users/:handle/p/:slug` · `/orgs/:slug/p/:slug` | sichtbarkeitsabhängig | Projektseite inkl. Metadaten + verknüpfte Artikel |
| PATCH/DELETE | `/projects/:id` | Owner bzw. `repository.project.manage` | Ändern/löschen (`unlisted` möglich) |

## Repository-Verknüpfung & Sync

| Methode | Pfad | Permission | Beschreibung |
|---|---|---|---|
| PUT | `/projects/:id/repository` | Projekt-Owner | Verknüpfen `{ provider: "github", owner, repo }` — validiert + Erst-Sync (R-2) |
| DELETE | `/projects/:id/repository` | Projekt-Owner | Verknüpfung lösen (Metadaten entfallen, US-09-02.3) |
| POST | `/projects/:id/repository/refresh` | Projekt-Owner | Manueller Sync (Cooldown 5 min, R-3) |
| GET | `/projects/:id/repository/status` | Projekt-Owner | syncStatus, lastSyncAt, lastError, deferred-until (R-4/R-5) |

## Administration

| Methode | Pfad | Permission | Beschreibung |
|---|---|---|---|
| GET/PUT | `/admin/repository/settings` | `repository.settings.manage` | Token/App-Konfiguration (write-only), Sync-Intervall |
| POST | `/admin/repository/settings/test` | `repository.settings.manage` | Token-Test + Kontingent-Anzeige (US-09-04) |
| POST | `/admin/projects/:id/moderate` | `repository.project.moderate` | Verknüpfung lösen / Projekt sperren (R-8, Begründung, auditiert) |
