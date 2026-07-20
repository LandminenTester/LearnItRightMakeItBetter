# Data Protection & Privacy

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20 ·
**Bezug:** NFR-020…023, [database/06](../database/06-data-lifecycle-gdpr.md)

## 1. Transportverschlüsselung (NFR-020)

- **HTTPS/TLS ≥ 1.2 verpflichtend** für alle externen Verbindungen; TLS-Terminierung am
  Reverse Proxy (→ [deployment/01](../deployment/01-environments-topologies.md)).
- HSTS (`max-age=31536000; includeSubDomains`) nach verifizierter HTTPS-Konfiguration
  (Setup-Check C-6 warnt bei http).
- Interne Verbindungen (Backend↔PG/Redis/Meilisearch): im Compose-Netz isoliert; bei externem
  Managed-Betrieb TLS-Pflicht (`DATABASE_URL` mit `sslmode=require` dokumentiert).
- SMTP: STARTTLS/TLS gemäß Konfiguration; Klartext-Auth ohne TLS wird vom Testversand mit
  Warnung markiert.

## 2. Verschlüsselung at rest — Feldebene (NFR-022)

**Verfahren:** AES-256-GCM. Format je Wert: `keyId (1B) ‖ nonce (12B) ‖ ciphertext ‖ tag (16B)`,
Base64 in `Bytes`-/JSON-Spalten (K-DB-16).

| Geschützt | Ort |
|---|---|
| OAuth-Client-Secrets, Provider-Refresh-Tokens | `auth_provider_configs`, `auth_identities` |
| TOTP-Secrets | `mfa_credentials` |
| SMTP-Passwort, GitHub-Token, MT-Provider-Keys, weitere `encrypted`-Settings | `instance_settings` |
| Webhook-Secrets | `webhook_endpoints` |

**Key-Management:**

- Master-Key `APP_ENCRYPTION_KEY` (32 B, Base64) aus ENV/Secret-Store — nie in DB oder Repo.
- Ableitung per HKDF auf Verwendungszweck (`settings`, `identity`, …) — begrenzt Blast-Radius.
- **Rotation:** neuer Key erhält neue `keyId`; Lesen unterstützt alte Keys
  (`APP_ENCRYPTION_KEYS_OLD`), CLI `platform crypto rotate` re-verschlüsselt Bestände;
  Verfahren im [Runbook](../deployment/runbooks/incident-recovery.md).
- Verlust des Master-Keys = Verlust der verschlüsselten Werte (Neu-Eingabe nötig) — Setup
  weist auf Sicherung hin; DB-Backups + Key getrennt aufbewahren.

**Nicht feldverschlüsselt** (bewusst): Artikelinhalte, Profile — Schutz erfolgt über AuthZ;
Betreiber können zusätzlich Disk-Encryption einsetzen (Runbook-Empfehlung).

## 3. Hashing-Übersicht (Abgrenzung)

| Wert | Verfahren | Warum |
|---|---|---|
| Passwörter | Argon2id + Pepper | Offline-Angriffsschutz ([02](02-authentication-security.md)) |
| Recovery Codes | Argon2id | wie Passwörter (kurz, erratbar) |
| Session-/PAT-/Einladungs-/E-Mail-Tokens | SHA-256 | hochentropisch → schnelles Hashing genügt, Vergleich timing-safe |
| E-Mail in `email_logs` | SHA-256 + Pepper | Diagnose ohne Klartext-PII |

## 4. Secret-Hygiene im Betrieb & Code

- Keine Secrets in: Logs (Logger-Redaction-Liste), Audit-Metadata (AU-4-Blockliste),
  Fehlerantworten, URLs/Query-Strings, Frontend-Bundles.
- Admin-UI zeigt Secrets nie wieder an (write-only, `isSet`-Anzeige, C-3).
- Repo: `.env`-Dateien in `.gitignore`; `*.example`-Dateien ohne echte Werte; Secret Scanning
  in CI ([06](06-secure-development-pipeline.md)); Push-Protection aktiv.
- Prozess-Umgebung: Secrets nur über ENV/Docker-/K8s-Secrets; `docker inspect`-Bewusstsein im
  Runbook (K8s: Secrets statt env im Manifest empfohlen).

## 5. Datenschutz-Funktionen (DSGVO, NFR-023)

Technische Umsetzung vollständig in [database/06](../database/06-data-lifecycle-gdpr.md):
PII-Inventar, Betroffenenrechte (Export, Löschung, Einschränkung), Lösch-Kaskade,
Retention-Jobs, Backup-Zusammenspiel (`deletion_marker`-Replay). Ergänzende Regeln:

- **Datenminimierung:** Neue Felder mit Personenbezug brauchen im PR eine Zweck-Begründung
  (Checklisten-Frage); IP-Speicherung überall kürzbar konfiguriert.
- **Keine Tracking-Dienste** im Kern: keine Third-Party-Analytics/Fonts/CDNs by default;
  öffentliche Seiten laden ausschließlich Instanz-Ressourcen (auch Performance-Vorteil).
- Avatare/Uploads: EXIF-/GPS-Entfernung ist Pipeline-Pflicht (Media-Schritt 4).
- Betreiber-Werkzeuge: Audit-Export, DSGVO-Export, dokumentierte Speicherfristen — die
  rechtliche Bewertung (AVV, Datenschutzerklärung) liegt beim Betreiber.
