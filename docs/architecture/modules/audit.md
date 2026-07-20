# Modul-Landkarte · audit

**Zweck:** Append-only-Protokoll aller sicherheits- und governance-relevanten Aktionen —
strukturierte Ereignisse mit Actor/Ressource/Kontext, Admin-Viewer mit Filtern und Export,
konfigurierbare Retention. Kein Update-/Delete-Pfad in der Anwendung.

## Datenhoheit

`AuditEvent`

## Kanten

| Richtung | Beziehung |
|---|---|
| wird genutzt von | allen Modulen — ausschließlich schreibend über `AuditPort.record()` in der auslösenden Transaktion (Regel M-4/AU-2) |
| nutzt | `configuration` (Retention-Einstellungen) |
| ruft niemals | Fachmodule (reiner Senken-Service) |

## Themenbereich-Dokumente

| Aspekt | Dokument |
|---|---|
| Spezifikation (Format, Regeln AU-1…AU-7) | [services/audit-service.md](../../services/audit-service.md) |
| Verbindlicher Ereigniskatalog | [security/07 Audit Logging](../../security/07-audit-logging.md) |
| Epic + Stories | [E-12 Audit & Compliance](../../requirements/epics/e-12-audit-compliance/README.md) |
| Datenbankschema | [database/schemas/audit.md](../../database/schemas/audit.md) |
| API-Endpunkte | [api/endpoints/audit.md](../../api/endpoints/audit.md) |
| DSGVO-Verhältnis (Pseudonymisierung) | [database/06 Data Lifecycle](../../database/06-data-lifecycle-gdpr.md) |
