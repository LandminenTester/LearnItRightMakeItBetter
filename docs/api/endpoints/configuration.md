# API · configuration

**Fachregeln:** [services/configuration-service.md](../../services/configuration-service.md) ·
**Stories:** [E-01](../../requirements/epics/e-01-platform-foundation/user-stories.md) ·
**Wizard-Ablauf:** [deployment/05](../../deployment/05-setup-wizard.md)

## Öffentlicher Bootstrap

| Methode | Pfad | Permission | Beschreibung |
|---|---|---|---|
| GET | `/instance/meta` | — | Instanzname, Branding, aktive Module, Login-Provider, Default-Locale/Theme — Frontend-Bootstrap (C-Sicherheitsreview bei Erweiterung) |

## Setup Wizard (nur vor Abschluss — danach 403 + Audit, C-5)

| Methode | Pfad | Permission | Beschreibung |
|---|---|---|---|
| GET | `/setup/status` | — (Setup-Phase) | Aktueller Schritt + Ergebnisse |
| POST | `/setup/system/check` | — | Ressourcen/Dienste prüfen (US-01-01.2) |
| POST | `/setup/database/check` · `/setup/database/migrate` | — | Verbindung testen / Migrationen ausführen |
| POST | `/setup/storage/configure` · `/setup/storage/check` | — | Provider setzen / Schreib-Lese-Löschtest |
| POST | `/setup/oauth/configure` · `/setup/oauth/test` | — | Optional: Provider anlegen/testen (US-01-02) |
| POST | `/setup/security/check` | — | Security-Defaults validieren (C-6) |
| POST | `/setup/admin` | — | Erstes Admin-Konto (Passwort-Policy) |
| POST | `/setup/recovery/confirm` | — | Recovery-Codes-Sicherung bestätigen → Abschluss (`configuration.setup.completed`) |

## Instanzverwaltung

| Methode | Pfad | Permission | Beschreibung |
|---|---|---|---|
| GET | `/admin/settings` | `configuration.settings.read` | Registry-basierte Settings nach Kategorie (ENV-überschriebene readonly + Herkunft, C-2; Secrets nur `isSet`) |
| PUT | `/admin/settings/:key` | `configuration.settings.manage` | Wert setzen (Zod-validiert, C-1; auditiert) |
| GET/PUT | `/admin/modules[/:module]` | `configuration.settings.manage` | Modul-Flags (C-7, auditiert) |
| GET | `/admin/system` | `configuration.settings.read` | Version, Migrationsstatus, Queues, Jobs, Storage/Index-Status (US-13-05) |
| POST | `/admin/system/queues/:queue/jobs/:id/retry` · `/discard` | `configuration.settings.manage` | Dead-Letter-Handling (auditiert) |
