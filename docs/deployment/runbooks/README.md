# Betriebs-Runbooks

**Status:** Verbindlich · **Stand:** 2026-07-20

Schritt-für-Schritt-Prozeduren für den Betrieb einer Instanz. Jede Prozedur wird einmal pro
Release-Phase real verifiziert (M1: Backup/Restore, M2: Aussperrung, M3: Secret-Rotation —
[security/08 §6](../../security/08-incident-response-recovery.md)).

| Runbook | Inhalt |
|---|---|
| [backup-restore.md](backup-restore.md) | Was sichern, wie, wie zurückspielen — inkl. DSGVO-Replay |
| [upgrade.md](upgrade.md) | Versions-Upgrades Compose + K8s, Rollback |
| [monitoring-alerting.md](monitoring-alerting.md) | Metriken, empfohlene Alerts, Log-Auswertung, Mail-Zustellbarkeit |
| [scaling.md](scaling.md) | Engpass-Diagnose und Skalierungsschritte je Symptom |
| [incident-recovery.md](incident-recovery.md) | Störungs- und Kompromittierungs-Prozeduren, Recovery-CLI, Secret-Rotation |

Härtung bei Installation/Upgrade: [security/checklists/deployment-hardening.md](../../security/checklists/deployment-hardening.md).
