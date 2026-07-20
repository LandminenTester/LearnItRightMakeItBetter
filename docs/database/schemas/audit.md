# Schema · audit

**Spezifikation:** [services/audit-service.md](../../services/audit-service.md) ·
**Ereigniskatalog:** [security/07](../../security/07-audit-logging.md)

## audit_events (append-only, AU-1)

| Spalte | Typ | Constraints | Beschreibung |
|---|---|---|---|
| id | uuid | PK (UUIDv7) | zeitlich sortierbar |
| occurredAt | DateTime | NOT NULL | Ereigniszeit |
| action | String | NOT NULL | Katalog-Key (`auth.login.failed`, `authz.role.assigned`, …) |
| severity | Enum | NOT NULL | `info` \| `notice` \| `warning` \| `critical` |
| actorType | Enum | NOT NULL | `user` \| `system` \| `pat` \| `recovery` |
| actorId | uuid? | | bei Löschung → Pseudonym-Hash (AU-5) |
| actorLabel | String | NOT NULL | stabile Anzeige („@handle", „System", „Gelöschtes Mitglied") |
| resourceType / resourceId / resourceLabel | String? | | betroffenes Objekt |
| orgId / spaceId | uuid? | | Scope-Kontext (Org-Scoped-Viewer AU-6) |
| ip | String? | | Speicherdauer konfigurierbar |
| userAgent | String? | | |
| requestId | String? | | Log-Korrelation (NFR-053) |
| metadata | Json | default `{}` | strukturierte Details, Secret-Blockliste (AU-4) |

Kein `updatedAt` (append-only). Kein FK auf `users` (überlebt Löschungen; referentielle
Integrität bewusst entkoppelt).

**Indizes:** BRIN auf `occurredAt` (große Tabelle, Zeitbereichs-Queries), B-Tree auf
(`action`, `occurredAt`), (`actorId`, `occurredAt`), (`orgId`, `occurredAt`), `severity`.

**DB-Härtung (Deployment-Empfehlung):** App-DB-User erhält kein UPDATE/DELETE auf
`audit_events`; der Retention-Job läuft mit separatem Grant
(→ [deployment/runbooks/backup-restore.md](../../deployment/runbooks/backup-restore.md)).
