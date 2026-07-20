# Runbook · Incident & Recovery

**Bezug:** [security/08](../../security/08-incident-response-recovery.md) (Prozess) ·
[E-13-Stories](../../requirements/epics/e-13-operations-recovery/user-stories.md) ·
alle Aktionen auditiert (FR-PLAT-006)

## 1. Recovery-CLI-Referenz (`platform recovery …`, im Backend-Container)

```bash
docker compose exec backend node dist/cli.js recovery <kommando>
```

| Kommando | Wirkung | Absicherung |
|---|---|---|
| `reset-password --user <handle>` | Einmal-Reset-Link auf stdout | Audit `critical`, Nutzer-Mail |
| `disable-mfa --user <handle> --reason "…"` | entfernt MFA-Credentials | `--reason` Pflicht, Audit, Nutzer-Mail |
| `create-emergency-admin --reason "…"` | Break-Glass-Konto (24 h) | einmalige Credentials auf stdout, Mail an alle Admins, Warnbanner, Auto-Expire (US-13-01) |
| `disable-provider <slug>` | Auth-Provider deaktivieren (kaputtes OIDC) | Audit; lokaler Login verfügbar |
| `disable-module <module>` | Modul-Not-Aus | Audit |
| `replay-deletions --since <ts>` | DSGVO-Löschungen nach Restore erneut ausführen | Audit ([backup-restore §3](backup-restore.md)) |
| `sessions:revoke-all [--user <handle>]` | globale/gezielte Abmeldung | Audit |
| `setup:reset-step <step>` | Setup-Schritt zurücksetzen (nur wenn Setup nie abgeschlossen bzw. explizit re-geöffnet) | Audit `critical` |

## 2. Szenario-Prozeduren

### A · Alle Admin-Zugänge verloren (US-13-01)

1. `create-emergency-admin --reason "…"` → Anmeldung mit Break-Glass-Konto.
2. Reguläres Admin-Konto reparieren (`reset-password` / `disable-mfa`) oder neues erstellen +
   Rolle zuweisen.
3. Emergency-Konto deaktivieren (läuft sonst automatisch ab); Audit-Einträge prüfen.

### B · Verdacht auf Kontokompromittierung (einzelner Nutzer)

`/admin/users` → sperren → Sessions/PATs sind damit tot (I-4) → Audit-Historie des Actors
prüfen → mit Nutzer verifizieren → entsperren + `reset-password` + MFA empfehlen.

### C · Verdacht auf Instanz-Kompromittierung

[security/08 §4](../../security/08-incident-response-recovery.md) folgen: Eindämmen
(`MAINTENANCE_MODE=true`, `sessions:revoke-all`) → Beweise (Audit-Export, Logs, DB-Snapshot) →
**Secret-Rotation (§3)** → Analyse → Restore falls nötig → Post-Mortem.

### D · Dienst-Degradation

| Ausfall | Sofortmaßnahme | Wirkung |
|---|---|---|
| Meilisearch | Container/RAM prüfen, neu starten; danach Konsistenz-Check | Suche 503, Rest läuft (S-6) |
| SMTP | Relay prüfen; Queue staut verlustfrei (N-5) | Mails verzögert |
| Redis | **kritisch** — sofort wiederherstellen (AOF) | Logins/Queues down (NFR-014) |
| PostgreSQL | **kritisch** — HA/Restore | Instanz down |
| Storage | Provider-Status; Media-Fehlerbanner | Uploads/Bilder betroffen |

## 3. Secret-Rotation

| Secret | Verfahren | Nebenwirkung |
|---|---|---|
| `SESSION_SECRET` | neu setzen, Neustart | alle Nutzer abgemeldet |
| `APP_ENCRYPTION_KEY` | neuen Key setzen, alten in `APP_ENCRYPTION_KEYS_OLD`, `platform crypto rotate`, alten entfernen | keine, wenn Reihenfolge stimmt ([security/04 §2](../../security/04-data-protection-privacy.md)) |
| OAuth-Client-Secrets | beim Provider rotieren → Admin-UI aktualisieren → Verbindungstest | kurze Login-Störung des Providers |
| `MEILI_MASTER_KEY` / DB-/Redis-/S3-Credentials | beim Dienst rotieren → ENV → Neustart | kurze Unterbrechung |
| SMTP-Passwort | Relay → Admin-UI → Testmail | keine |
| GitHub-Token | rotieren → Admin-UI → Test | keine |

## 4. Meldepflichten (DSGVO)

Bei personenbezogenem Datenabfluss: Betreiber prüft Art.-33-Meldung (72 h) / Art.-34-
Benachrichtigung. Faktenbasis liefern Audit-Export + Zeitleiste; Bewertung ist
Betreiber-/Rechtsverantwortung.
