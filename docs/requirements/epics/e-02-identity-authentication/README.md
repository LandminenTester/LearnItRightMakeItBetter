# E-02 · Identity & Authentication

**Status:** Verbindlich · **Phase:** 1–3 · **Priorität:** Must ·
**Module:** [identity](../../../services/identity-service.md) ·
**FRs:** FR-IDNT-001…020 · **Stories:** [user-stories.md](user-stories.md)

## Ziel

Jede Zielgruppe meldet sich auf ihrem Weg an — Community per Discord/GitHub/E-Mail, Unternehmen
per SSO (Entra ID, Keycloak, Authentik, generisches OIDC) — auf **einer** gemeinsamen, sicheren
Identity-Basis mit MFA, Account-Linking und vollständiger Sitzungs-Kontrolle.

## Scope

**Enthalten:**

- Lokale Registrierung (E-Mail/Passwort), Verifizierung, Passwort-Reset
- Provider-Abstraktion: Discord, GitHub, Google, generischer OIDC-Adapter; Admin-Provider-UI
- Account-Linking mehrerer Identitäten, JIT-Provisionierung
- Serverseitige Sessions ([ADR-0011](../../../architecture/decisions/adr-0011-session-auth-server-side.md)),
  Sitzungsverwaltung, Admin-Benutzerverwaltung
- MFA: TOTP + Recovery Codes; Policies (optional → verpflichtend); WebAuthn vorbereitet
- Registrierungsmodi (offen / Einladung / geschlossen), Einladungssystem
- PATs für API-Zugriff; DSGVO-Konto-Lifecycle

**Nicht enthalten:** Rechteverwaltung (→ [E-03](../e-03-authorization/README.md)),
Profilinhalte (→ [E-07](../e-07-developer-profiles/README.md)).

## Phasenschnitt

| Phase | Inhalt |
|---|---|
| 1 | Lokal + Discord + GitHub, Verifizierung/Reset, Sessions, Registrierungsmodi, Admin-Verwaltung |
| 2 | Google, Account-Linking, Provider-Admin-UI, TOTP + Recovery Codes, Sitzungsliste, DSGVO-Löschung |
| 3 | Generisches OIDC (Entra/Keycloak/Authentik), MFA-Policies, PATs, WebAuthn-Vorbereitung |

## Abhängigkeiten

Benötigt: E-01 (Provider-Konfiguration), E-11 (Mails), E-12 (Audit).
Blockiert: alle personalisierten Funktionen.

## Erfolgsmetriken

- OIDC-Anbindung eines Keycloak rein über Admin-UI in < 15 min (Erfolgskriterium §6 Vision)
- 100 % der Auth-Ereignisse auditiert; Enumeration-Tests grün
- MFA-Enrollment-Zwang greift bei Policy-Erfassung vor jeder anderen Aktion

## Risiken & Gegenmaßnahmen

| Risiko | Gegenmaßnahme |
|---|---|
| Account-Takeover über schwache Flows | Rate Limits, Re-Auth für sensible Aktionen (Regel I-15), Security-Mails |
| Fehlkonfigurierte OIDC-Provider sperren Nutzer aus | Provider-Verbindungstest, lokaler Admin-Login bleibt als Break-Glass aktivierbar |
| Auto-Linking-Fehler verbinden fremde Konten | strenge Regel I-10 (nur verifizierte E-Mail + Instanz-Opt-in) |
