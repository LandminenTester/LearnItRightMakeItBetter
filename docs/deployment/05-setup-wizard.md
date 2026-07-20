# Setup Wizard

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20 ·
**Fachlogik:** [services/configuration-service.md](../services/configuration-service.md) (C-4…C-6) ·
**Stories:** [E-01](../requirements/epics/e-01-platform-foundation/user-stories.md) ·
**API:** [api/endpoints/configuration.md](../api/endpoints/configuration.md)

## 1. Rahmen

- Erststart ohne abgeschlossenes Setup ⇒ globaler Redirect auf `/setup` (`SetupGuard`);
  API-seitig nur `/api/v1/setup/*` + Health erreichbar (US-01-01.1).
- Zustandsmaschine serverseitig (`setup_state`), jeder Schritt einzeln wiederholbar; Abbruch/
  Browserwechsel verliert nichts.
- UI: `LirSetupShell` + `LirStepper`; jede Prüfung mit Status, Messwert und konkreter
  Fehlerhilfe.
- Nach Abschluss: `/setup` ⇒ 403 + Audit `setup.access_denied` (US-01-05); Re-Setup nur via
  CLI (E-13).

## 2. Schritte im Detail

### Schritt 1 · System

| Prüfung | Kriterium |
|---|---|
| Laufzeitumgebung | Container-Betrieb erkannt, Node-Version, Zeit-Synchronisation (TOTP!) |
| Ressourcen | ≥ 2 vCPU / 4 GB erkannt (Warnung unter Referenz 4/8), Disk-Freiplatz |
| Dienste | PostgreSQL, Redis, Meilisearch erreichbar (Ports/Credentials aus ENV) |
| `APP_URL` | auflösbar, erreichbar, HTTPS (Warnung bei http außer localhost — C-6) |

### Schritt 2 · Datenbank

Verbindungstest mit Rechteprüfung (CREATE/ALTER) → Migrationen ausführen
(`migrate deploy`, Ausgabe sichtbar) → base-Seed (Systemrollen, Permissions,
Sprachen). Fehlerfälle nennen DSN-Probleme konkret (Host/Auth/SSL).

### Schritt 3 · Storage

Treiber-Auswahl gemäß ENV bzw. Eingabe (S3-Formular mit verschlüsselter Ablage) → echter
**Schreib-/Lese-/Löschtest** eines Prüfobjekts (US-01-01.4) → Anzeige der effektiven
Konfiguration (Bucket, Region, Pfad).

### Schritt 4 · OAuth (optional, überspringbar)

Provider anlegen (Discord/GitHub/Google/OIDC) → **Verbindungstest**: Credential-Check +
Discovery (bei OIDC) + Anzeige der exakt einzutragenden Callback-URL (US-01-02). Später in
der Admin-UI vollwertig nachholbar.

### Schritt 5 · Security-Defaults (C-6)

Entropie-Check der Secrets (`APP_ENCRYPTION_KEY`, `SESSION_SECRET`, `AUTH_PEPPER`),
HTTPS-Bestätigung, bewusste Wahl: Registrierungsmodus (`open`/`invite_only`/`closed`),
Standard-Sichtbarkeit neuer Spaces, Review-Pflicht-Default. Alle Vorauswahlen sind die
sicherere Option.

### Schritt 6 · Admin-Konto

E-Mail, Handle, Anzeigename, Passwort (Policy live geprüft, I-6); Konto entsteht mit
`platform.admin` + verifizierter E-Mail; MFA-Einrichtung wird direkt angeboten
(instanzweite Empfehlung).

### Schritt 7 · Recovery

10 Recovery Codes generieren → einmalige Anzeige + Download als Textdatei → **aktive
Bestätigung** „sicher verwahrt" (US-01-01.5) → Hinweis auf CLI-Recovery-Pfade
([security/08 §5](../security/08-incident-response-recovery.md)).

### Abschluss

`configuration.setup.completed` (Event + Audit) → Weiterleitung zum Admin-Dashboard mit
„Nächste Schritte"-Karte (SMTP testen, Module wählen, ersten Space anlegen, Branding).

## 3. Wiederholbarkeit & Diagnose

Jeder Check ist idempotent und einzeln auslösbar; `stepResults` speichert letzte Ergebnisse
(Anzeige beim Rückkehren). CLI-Äquivalent `platform setup:check` führt die Schritte 1–3
headless aus (CI-/Vorab-Diagnose).
