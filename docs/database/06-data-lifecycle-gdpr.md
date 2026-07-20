# Datenlebenszyklus & DSGVO

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20 ·
**Bezug:** NFR-023, FR-IDNT-018, [security/04](../security/04-data-protection-privacy.md)

## 1. PII-Inventar (personenbezogene Daten)

| Datenkategorie | Ort | Rechtsgrundlage (typisch) | Lebensdauer |
|---|---|---|---|
| Konto (E-Mail, Handle, Anzeigename) | `users` | Vertrag (Nutzung) | bis Löschung |
| Credentials/MFA/Recovery (Hashes, verschlüsselte Secrets) | `user_credentials`, `mfa_credentials`, `recovery_codes` | Vertrag | bis Löschung/Deaktivierung |
| Provider-Identitäten | `auth_identities` | Vertrag | bis Unlink/Löschung |
| Sessions (IP, User-Agent) | `sessions` + Redis | berechtigtes Interesse (Sicherheit) | Ablauf + GC ≤ 90 Tage |
| Profil (Bio, Links, Skills, Avatar) | `profiles`, `media_objects` | Vertrag/Einwilligung (öffentlich) | bis Löschung |
| Beiträge (Artikel, Kommentare, Übersetzungen) | knowledge/translation | Vertrag; Inhalte CC BY-SA | Inhalte bleiben, Autor wird anonymisiert |
| Benachrichtigungen | `notifications` | Vertrag | 90 Tage TTL |
| E-Mail-Zustellprotokoll | `email_logs` (Empfänger gehasht) | berechtigtes Interesse | 30 Tage |
| Audit-Events (Actor, IP) | `audit_events` | berechtigtes Interesse/rechtl. Pflicht | Retention (Default 365 Tage), IP kürzer konfigurierbar |
| Reputation/Beitragshistorie | profile-Tabellen | Vertrag | bis Löschung (dann entfernt) |

Instanzbetreiber sind Verantwortliche i. S. d. DSGVO; die Plattform liefert die technischen
Mittel (Privacy by Design). Ein Muster-AVV/Datenschutzhinweis ist **nicht** Teil dieses Repos.

## 2. Betroffenenrechte — technische Umsetzung

| Recht | Umsetzung |
|---|---|
| Auskunft/Portabilität | Self-Service-Export (US-12-04): asynchron erstelltes JSON-Archiv aller Daten aus §1 + eigene Inhalte als Markdown; Re-Auth erforderlich; Download zeitlich begrenzt |
| Berichtigung | Self-Service (Konto/Profil-Bearbeitung) |
| Löschung | Lösch-Kaskade (§3) — Self-Service mit Re-Auth oder Admin-initiiert (Vier-Augen, US-12-05) |
| Einschränkung | Konto-Deaktivierung (`deactivated`): Anmeldung gesperrt, Inhalte bleiben, reversibel |
| Widerspruch gg. Anzeige | Profil-Sichtbarkeitseinstellungen (P-7) |

## 3. Lösch-/Anonymisierungskaskade (`identity.user.deleted`)

**Sofort (synchron in der Löschtransaktion):**

1. `users`: E-Mail → `deleted+<hash>@invalid`, Handle → `deleted-<shortid>`, Anzeigename →
   „Gelöschtes Mitglied", Avatar-Referenz entfernt, `status = deleted`.
2. Löschen: `user_credentials`, `auth_identities`, `mfa_credentials`, `recovery_codes`,
   `email_tokens`, `personal_access_tokens`, offene `invitations`; alle `sessions` (DB+Redis)
   revoked.
3. `profiles`: Zeile gelöscht.

**Asynchron (Job `anonymize-user-content`, idempotent):**

4. Beiträge (Artikel-Versionen, Übersetzungen, Kommentare, Reviews): Autor-Referenzen bleiben
   als FK auf die anonymisierte User-Zeile — Anzeige „Gelöschtes Mitglied"; Kommentar-Inhalte
   bleiben (Diskussionskontext), auf Antrag zusätzlich einzeln löschbar (Moderation).
5. `contribution_events`, `reputation_ledger`, `reputation_summaries`, `user_achievements`,
   `notifications`, `notification_preferences`, `watches`: gelöscht.
6. `media_objects` des Nutzers: `kind = avatar` gelöscht; `content`-Medien in publizierten
   Inhalten bleiben (Bestandteil CC-BY-SA-Werk), verwaiste werden gelöscht.
7. Suche: Profil-Dokument entfernt; Inhalts-Dokumente re-indexiert (neuer Autorname).
8. `audit_events`: `actorId` → Pseudonym-Hash, `actorLabel` → „Gelöschtes Mitglied" (AU-5);
   Events bleiben (berechtigtes Interesse: Sicherheit/Nachvollziehbarkeit — dokumentierte
   Abwägung).
9. Organisationen: Mitgliedschaften entfernt; war der Nutzer letzter Owner, wurde die Löschung
   zuvor blockiert (O-2 — erst Org übertragen/löschen).

**Hinweis Urheberrecht/CC BY-SA:** Publizierte Inhalte bleiben unter der Lizenz erhalten; die
Namensnennung endet auf Wunsch der betroffenen Person (Anonymisierung) — das ist die
dokumentierte Auslegung für Löschanträge (Konzept §20 + DSGVO-Vorrang).

## 4. Automatische Bereinigung (Retention-Jobs)

| Job | Intervall | Regel |
|---|---|---|
| `session-gc` | stündlich | abgelaufene Sessions/Tokens/Einladungen löschen |
| `notification-gc` | täglich | Notifications > 90 Tage; EmailLogs > 30 Tage |
| `audit-retention` | täglich | Events älter als Retention (Default 365 Tage; IP-Feld optional früher nullen) |
| `cleanup-orphan-media` | wöchentlich | verwaiste Medien (MD-4) |
| `export-gc` | täglich | abgelaufene DSGVO-Export-Archive löschen |

## 5. Backups & Löschungen

Backups (→ [Runbook backup-restore](../deployment/runbooks/backup-restore.md)) enthalten
gelöschte Daten bis zur Backup-Rotation (Empfehlung ≤ 35 Tage). Das ist DSGVO-konform, wenn
dokumentiert und Restore-Prozesse die erneute Löschung wiederholen: Der Lösch-Job schreibt
dafür einen `deletion_marker` (userId-Hash + Zeitpunkt) in eine langlebige Tabelle; nach einem
Restore wird die Kaskade für alle Marker seit Backup-Zeitpunkt erneut ausgeführt
(`platform recovery replay-deletions`).
