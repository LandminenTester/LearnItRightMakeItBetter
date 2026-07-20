# Security — Übersicht

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20 · **Pflichtlektüre für alle**

Sicherheitskonzept der Plattform (Fachkonzept §14/§15/§17): Datenschutz, verschlüsselte
Secrets, sichere Passwörter, Transportpflichten, Secure Development Pipeline, Audit und
Recovery.

## Dokumente

| Dokument | Inhalt |
|---|---|
| [01-security-architecture-threat-model.md](01-security-architecture-threat-model.md) | Prinzipien, Trust Boundaries, STRIDE-Threat-Model, Top-Risiken |
| [02-authentication-security.md](02-authentication-security.md) | Passwort-/Hashing-Politik, Session-Härtung, OAuth-/MFA-Sicherheit, Anti-Enumeration, Rate Limits |
| [03-authorization-enforcement.md](03-authorization-enforcement.md) | Deny-by-default-Durchsetzung, Guard-Pipeline, IDOR-Prävention, Suche/Listen |
| [04-data-protection-privacy.md](04-data-protection-privacy.md) | Verschlüsselung at rest, Key-Management, Secret-Handling, Datenschutz-Umsetzung |
| [05-application-security.md](05-application-security.md) | Input-Validierung, XSS/Markdown, CSRF, SSRF, Upload-Security, Security-Header |
| [06-secure-development-pipeline.md](06-secure-development-pipeline.md) | SCA, SAST, Secret-/Container-Scanning: CodeQL, Semgrep, Trivy, Renovate/Dependabot |
| [07-audit-logging.md](07-audit-logging.md) | Verbindlicher Audit-Ereigniskatalog |
| [08-incident-response-recovery.md](08-incident-response-recovery.md) | Incident-Prozess, Responsible Disclosure, Recovery-Verfahren |
| [checklists/](checklists/README.md) | **Themenordner: Checklisten** — Secure Coding, Security-Review im PR, Deployment-Härtung |

## Nicht verhandelbare Grundsätze

1. **Der Client ist niemals vertrauenswürdig** — jede sicherheitsrelevante Prüfung läuft
   serverseitig; Frontend-Checks sind reine UX.
2. **Deny by default** — kein Endpunkt ohne explizite Permission-Deklaration oder `@Public()`
   (FR-AUTZ-008).
3. **Keine Klartext-Geheimnisse** — Passwörter nur als Argon2id-Hash, Tokens nur als Hash,
   Secrets nur feldverschlüsselt (NFR-021/022).
4. **HTTPS/TLS überall**, sichere Cookies, vollständige Security-Header (NFR-020).
5. **Alles Sicherheitsrelevante ist auditiert** (NFR-026) und **rate-limitiert** (NFR-025).
6. Sicherheit ist Teil der [Definition of Done](../development-guidelines/06-definition-of-done.md) —
   nicht verschiebbar.
