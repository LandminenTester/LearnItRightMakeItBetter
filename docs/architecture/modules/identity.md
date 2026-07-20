# Modul-Landkarte · identity

**Zweck:** Benutzerkonten und Anmeldung — lokale Credentials, OAuth/OIDC-Provider-Abstraktion
(Discord, GitHub, Google, Entra ID, Keycloak, Authentik, generisch), Account-Linking,
serverseitige Sessions, MFA (TOTP/Recovery, WebAuthn vorbereitet), PATs, Einladungen,
Konto-Lifecycle inkl. DSGVO-Löschung.

## Datenhoheit

`User`, `UserCredential`, `AuthProviderConfig`, `AuthIdentity`, `Session`, `MfaCredential`,
`RecoveryCode`, `PersonalAccessToken`, `Invitation`, `EmailToken`, `HandleRedirect`

## Kanten

| Richtung | Beziehung |
|---|---|
| nutzt | `authorization` (Guard-Entscheidungen), `configuration` (Modi/Policies), `audit`, `notification` (Ereignisse), `media` (Avatar) |
| wird genutzt von | allen Modulen via `IdentityPort` (UserRef, NotificationTarget) |
| publiziert | `identity.user.registered/suspended/deleted`, `identity.login.*`, `identity.session.revoked`, `identity.mfa.*`, `identity.provider.changed` |

## Themenbereich-Dokumente

| Aspekt | Dokument |
|---|---|
| Spezifikation | [services/identity-service.md](../../services/identity-service.md) |
| Epic + Stories | [E-02 Identity & Authentication](../../requirements/epics/e-02-identity-authentication/README.md) |
| Datenbankschema | [database/schemas/identity.md](../../database/schemas/identity.md) |
| API-Endpunkte | [api/endpoints/identity.md](../../api/endpoints/identity.md) |
| Security | [security/02 Authentication](../../security/02-authentication-security.md) |
| Login-Datenfluss | [architecture/05 §1](../05-data-flows.md) |
