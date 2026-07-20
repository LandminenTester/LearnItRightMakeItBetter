# Authentication Security

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20 ·
**Fachregeln:** [services/identity-service.md](../services/identity-service.md) ·
**ADR:** [ADR-0011](../architecture/decisions/adr-0011-session-auth-server-side.md)

## 1. Passwörter (NFR-021)

- **Hashing: Argon2id** — Startparameter: `memory = 64 MiB`, `iterations = 3`,
  `parallelism = 2` (jährlich gegen OWASP-Empfehlung kalibrieren; Parameter im Hash kodiert →
  transparentes Rehash beim nächsten Login nach Parameter-Erhöhung).
- Individueller Salt pro Hash (Argon2-inhärent); zusätzlich serverseitiger **Pepper**
  (`AUTH_PEPPER`, ENV) via HMAC-SHA-256 vor dem Hashing — kompromittierte DB allein reicht
  nicht für Offline-Angriffe.
- Policy (I-6): min. 12 Zeichen, max. 128; Prüfung gegen lokale Top-100k-Liste; optional
  HIBP-k-Anonymity (Instanzeinstellung); keine Zwangsrotation, keine Zeichenklassen-Theater.
- Passwortänderung/-reset: alle anderen Sessions invalidieren (I-4-analog), Security-Mail,
  Audit.

## 2. Sessions

- Token: 256 bit CSPRNG, Speicherung nur als SHA-256 (K-DB-17); Cookie `__Host-session`
  (`Secure`, `HttpOnly`, `SameSite=Lax`, `Path=/`).
- Rotation bei Login und Privilegienwechsel (MFA-Verify) — Fixation-Schutz (I-14).
- Idle 14 d rolling / absolut 90 d (konfigurierbar); Re-Auth-Fenster 5 min für sensible
  Aktionen (I-15); `mfaVerified` pro Session.
- Revozierbarkeit: Redis-Delete wirkt sofort; DB-Spiegel für Sitzungsliste; Kontosperrung
  killt alles (I-4).

## 3. OAuth/OIDC-Härtung

- Authorization Code + **PKCE (S256)** für alle Provider; `state` einmalig (Redis, 10 min);
  OIDC zusätzlich `nonce`-Validierung im ID-Token; `iss`/`aud`/`exp`-Prüfung strikt;
  JWKS-Cache mit Rotation.
- Redirect-URIs: exakte Registrierung, keine Wildcards; `returnTo` nur relative
  Allowlist-Pfade (kein Open Redirect).
- Provider-Antworten (Profile) sind **untrusted input**: Zod-validiert, Längen begrenzt,
  niemals roh gerendert.
- Account-Linking-Regeln I-10/I-11 verhindern Übernahme via unverifizierter Provider-E-Mail.
- Provider-Secrets feldverschlüsselt (NFR-022); Konfigurationsänderungen auditiert.

## 4. MFA

- TOTP RFC 6238: 30-s-Step, ±1 Drift, Replay-Sperre (letzter akzeptierter Step, I-16);
  Secret verschlüsselt; Aktivierung erst nach Verifizierung.
- Recovery Codes: 10 × 10 Zeichen (CSPRNG, crockford-base32), Argon2id-gehasht, Einmalgebrauch,
  Nutzung ⇒ Security-Mail + Audit (I-17).
- MFA-Challenge-Token (Login-Zwischenschritt): kurzlebig (5 min), einmalig, an IP/UA-Hash
  gebunden; max. 5 Code-Versuche pro Challenge.
- Policies (I-18): Evaluation bei Login **und** Request (Session-Flag); Enrollment-Zwang
  kapselt alle anderen Endpunkte.
- WebAuthn (Phase 3): Vorbereitung gemäß I-19; bei Aktivierung eigener Security-Review.

## 5. Anti-Enumeration & Feedback-Disziplin (I-8)

- Registrierung/Passwort-vergessen/Einladungen: identische Antworten für existierende und
  unbekannte Konten; konstante Antwortzeit (künstliche Angleichung).
- Login-Fehler: generisch „Anmeldung fehlgeschlagen" — nie „Passwort falsch" vs. „Konto
  unbekannt".
- Timing-sichere Vergleiche (`crypto.timingSafeEqual`) für alle Token-/Hash-Vergleiche.

## 6. Rate Limits (Auth-spezifisch, NFR-025)

| Endpunkt | Limit | Zusatz |
|---|---|---|
| `POST /auth/login` | 10/min/IP + 20/h/Konto | nach 10 Fehlversuchen/Konto: 15-min-Sperrfenster + Security-Mail |
| `POST /auth/register` | 5/h/IP | |
| `POST /auth/password/forgot` | 3/h/Konto, 10/h/IP | |
| `POST /auth/mfa/verify` | 5/Challenge | Challenge verfällt danach |
| `POST /auth/reauth` | 5/5 min | |
| OAuth-Callbacks | 20/min/IP | state-Bindung begrenzt ohnehin |

Limiter: Redis Sliding Window; Antworten mit `Retry-After`; Limit-Ereignisse ab Schwelle als
`warning`-Audit.

## 7. Security-Benachrichtigungen (nicht abbestellbar, N-2)

Login von neuem Gerät (UA/IP-Heuristik), Passwortänderung, E-Mail-Wechsel, MFA an/aus,
Recovery-Code-Nutzung, PAT erstellt, Kontosperrung — jeweils mit Zeitpunkt, Gerät/IP-Region
und Handlungsanweisung („Das warst nicht du? → Sitzungen widerrufen + Passwort ändern").
