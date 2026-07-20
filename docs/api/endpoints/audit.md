# API · audit

**Fachregeln:** [services/audit-service.md](../../services/audit-service.md) ·
**Ereigniskatalog:** [security/07](../../security/07-audit-logging.md) ·
**Stories:** [E-12](../../requirements/epics/e-12-audit-compliance/user-stories.md)

| Methode | Pfad | Permission | Beschreibung |
|---|---|---|---|
| GET | `/admin/audit-events` | `audit.event.read` | Filter: `from`/`to`, `action` (Präfix-Match `authz.*`), `actorId`, `resourceType`+`resourceId`, `severity`, `orgId`; Cursor-Pagination (UUIDv7-sortiert) |
| GET | `/admin/audit-events/:id` | `audit.event.read` | Einzelereignis inkl. Metadata |
| POST | `/admin/audit-events/export` | `audit.event.export` | Asynchroner Export (CSV/JSON) des aktuellen Filters → 202 + Statusressource; Export selbst auditiert (AU-6) |
| GET | `/admin/audit-events/export/:jobId` | `audit.event.export` | Status + zeitlich begrenzter Download-Link |
| GET | `/orgs/:slug/audit-events` | `audit.event.read` (Org-Scope) | Org-gescopte Sicht (nur Events mit passender `orgId`, Phase 3) |
| GET/PUT | `/admin/audit-settings` | `configuration.settings.manage` | Retention, IP-Speicherdauer, erweiterter Katalog an/aus (FR-AUDT-005/006) |

**Keine** Schreib-/Änderungs-/Lösch-Endpunkte — append-only by design (AU-1).
