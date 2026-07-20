# Audit Service

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20 ·
**FRs:** FR-AUDT-001…006 · **Epic:** [E-12](../requirements/epics/e-12-audit-compliance/README.md) ·
**Ereigniskatalog:** [security/07](../security/07-audit-logging.md) ·
**Schema:** [database/schemas/audit.md](../database/schemas/audit.md)

## 1. Zweck & Verantwortlichkeiten

Append-only-Protokoll sicherheits- und governance-relevanter Aktionen:

- Aufnahme über den schmalen Port `audit.record(...)` (Regel M-4)
- Strukturiertes Ereignisformat mit Actor-, Ressourcen- und Kontextdaten
- Admin-Viewer mit Filtern, Export (CSV/JSON)
- Retention mit automatischer Bereinigung
- Schutz der Log-Integrität auf Anwendungsebene

## 2. Abgrenzung

| Nicht hier | Sondern |
|---|---|
| Anwendungs-/Debug-Logs | stdout-Logging (NFR-053) — Audit ist fachlich kuratiert |
| Definition, *was* auditiert wird | [security/07](../security/07-audit-logging.md) (verbindlicher Katalog) + Fachmodule |
| Benachrichtigung bei Security-Ereignissen | `notification` (konsumiert dieselben Domain Events) |

## 3. Domänenmodell

`AuditEvent`:

| Feld | Typ | Inhalt |
|---|---|---|
| `id` | UUIDv7 | zeitlich sortierbar |
| `occurredAt` | timestamptz | Ereigniszeit |
| `action` | string | Katalog-Key, z. B. `auth.login.failed`, `authz.role.assigned` |
| `severity` | `info`\|`notice`\|`warning`\|`critical` | Katalog-definiert |
| `actorType` | `user`\|`system`\|`pat`\|`recovery` | wer handelte |
| `actorId?` / `actorLabel` | UUID / string | Referenz + stabile Anzeige (überlebt Löschung pseudonymisiert) |
| `resourceType?` / `resourceId?` / `resourceLabel?` | string | betroffenes Objekt |
| `orgId?` / `spaceId?` | UUID | Scope-Kontext |
| `ip?` / `userAgent?` | inet/string | Requestkontext (Speicherdauer konfigurierbar) |
| `requestId?` | string | Log-Korrelation |
| `metadata` | JSONB | strukturierte Details (z. B. Vorher/Nachher bei Rechteänderung) — **niemals Secrets** |

## 4. Fachliche Regeln

- **AU-1:** Append-only: Die Anwendung besitzt keinerlei Update-/Delete-Pfad; einzige
  Entfernung ist der Retention-Job. (DB-seitige Härtung: eigener DB-User ohne
  UPDATE/DELETE-Grant auf die Tabelle — Deployment-Empfehlung im Runbook.)
- **AU-2:** Aufnahme ist **asynchron-verlustarm**: `record()` schreibt in der auslösenden
  Transaktion (gleiche DB — kein Event-Verlust bei Rollback: Rollback verwirft konsistent
  Aktion *und* Audit; für Fehl-Versuche wie `login.failed` schreibt der Handler außerhalb der
  Fachtransaktion).
- **AU-3:** Pflicht-Ereignisse: Der Katalog in security/07 markiert Pflicht-Events; die
  Testsuite verifiziert deren Erzeugung (Erfolgsmetrik E-12).
- **AU-4:** `metadata` wird beim Schreiben gegen eine Blockliste geprüft (keys wie `password`,
  `secret`, `token` ⇒ Schreibversuch schlägt im Test-/Dev-Modus fehl, in Produktion wird der
  Wert redigiert + `warning`-Event).
- **AU-5:** Pseudonymisierung bei Konto-Löschung: `actorId` wird durch stabilen Pseudonym-Hash
  ersetzt, `actorLabel` = „Gelöschtes Mitglied" (→ [database/06](../database/06-data-lifecycle-gdpr.md)).
- **AU-6:** Zugriff: `audit.event.read` (global oder Org-Scope: Org-Admins sehen nur Events
  ihrer Organisation), Export mit `audit.event.export` — der Export selbst wird auditiert.
- **AU-7:** Retention: Default 365 Tage, konfigurierbar ≥ 30; Bereinigung protokolliert sich
  selbst (`audit.retention.executed` mit Zeitraum + Anzahl).

## 5. Schnittstellen

**API:** `GET /admin/audit-events` (Filter: Zeitraum, action, actor, resource, severity, org;
Cursor-Pagination), `POST /admin/audit-events/export`, `GET /orgs/:slug/audit-events`
(Org-Scope, Phase 3).

**Port:** `AuditPort.record(entry)` — einzige Schreibschnittstelle.
**Konsumierte Events:** keine (Fachmodule rufen den Port direkt in ihrer Transaktion).

## 6. Hintergrundjobs

`audit-retention` (maintenance, täglich): AU-7. `audit-export` (maintenance): asynchrone
Export-Erstellung mit Download-Token.

## 7. Konfiguration

Retention-Tage, IP-Speicherdauer (kürzbar, Default = Retention), erweiterter Ereigniskatalog
an/aus (FR-AUDT-006).

## 8. Sicherheit

Das Audit-Log ist selbst schützenswert (Verhaltensdaten): minimaler Lesekreis (AU-6),
Retention-Pflicht, keine Secrets (AU-4). Manipulationsschutz durch AU-1 + DB-Grant-Härtung.

## 9. Offene Punkte

- Optionaler Hash-Chain-Modus (Tamper-Evidence) für regulierte Umgebungen — nach 1.0.
- Syslog-/SIEM-Forwarder als Adapter — nach 1.0 (stdout-Logs decken Basisbedarf).
