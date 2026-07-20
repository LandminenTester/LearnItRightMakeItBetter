# API · identity

**Fachregeln:** [services/identity-service.md](../../services/identity-service.md) ·
**Stories:** [E-02](../../requirements/epics/e-02-identity-authentication/user-stories.md)

## Auth (Session-Flows)

| Methode | Pfad | Permission | Beschreibung |
|---|---|---|---|
| POST | `/auth/register` | — | Lokale Registrierung (Modus-abhängig; Einladungstoken optional) |
| POST | `/auth/verify-email` | — | E-Mail-Token einlösen |
| POST | `/auth/resend-verification` | auth | Verifizierungsmail erneut senden (Rate-limitiert) |
| POST | `/auth/login` | — | E-Mail+Passwort; ggf. `mfaRequired` + challengeToken |
| POST | `/auth/mfa/verify` | — | TOTP/Recovery-Code gegen challengeToken |
| POST | `/auth/logout` | auth | Session beenden |
| GET | `/auth/session` | — | Anmeldezustand + effektive Permissions + csrfToken (401 wenn keine) |
| POST | `/auth/reauth` | auth | Frische Re-Auth (5-min-Token, Regel I-15) |
| POST | `/auth/password/forgot` | — | Reset-Mail (enumeration-sicher) |
| POST | `/auth/password/reset` | — | Token + neues Passwort; invalidiert Sessions |
| GET | `/auth/providers` | — | Aktivierte Login-Provider (Login-Screen) |
| GET | `/auth/oauth/:providerSlug/start` | — | OAuth-Redirect (state+PKCE) |
| GET | `/auth/oauth/:providerSlug/callback` | — | OAuth-Callback |

## Eigenes Konto

| Methode | Pfad | Permission | Beschreibung |
|---|---|---|---|
| GET/PATCH | `/users/me` | auth | Konto lesen/ändern (displayName, locale; E-Mail-Wechsel via Token-Flow) |
| POST | `/users/me/handle` | auth + Re-Auth | Handle ändern (Redirect-Regel I-2) |
| PUT | `/users/me/password` | auth + Re-Auth | Passwort setzen/ändern |
| GET | `/users/me/identities` | auth | Verknüpfte Provider |
| POST | `/users/me/identities/:providerSlug/link` | auth + Re-Auth | Link-Flow starten |
| DELETE | `/users/me/identities/:id` | auth + Re-Auth | Unlink (I-11) |
| GET | `/users/me/sessions` | auth | Sitzungsliste |
| DELETE | `/users/me/sessions/:id` \| `/users/me/sessions` | auth | Einzelne/alle anderen widerrufen |
| GET/POST | `/users/me/mfa/totp` | auth + Re-Auth | Setup starten (Secret/QR) / verifizieren+aktivieren |
| DELETE | `/users/me/mfa/totp` | auth + Re-Auth | MFA deaktivieren |
| POST | `/users/me/mfa/recovery-codes` | auth + Re-Auth | Codes (re)generieren |
| GET/POST | `/users/me/tokens` · DELETE `/users/me/tokens/:id` | auth (+ Re-Auth bei POST) | PATs (Regel I-20) |
| POST | `/users/me/export` | auth + Re-Auth | DSGVO-Export anstoßen (202) |
| DELETE | `/users/me` | auth + Re-Auth | Konto-Löschung (Kaskade database/06) |

## Öffentlich

| Methode | Pfad | Permission | Beschreibung |
|---|---|---|---|
| GET | `/users/:handle` | — | Öffentliche Kontoreferenz (Handle, Name, Avatar; 404 bei privat/gelöscht) |

## Administration

| Methode | Pfad | Permission | Beschreibung |
|---|---|---|---|
| GET | `/admin/users` | `identity.user.read` | Suche/Liste (Filter: status, Provider) |
| PATCH | `/admin/users/:id` | `identity.user.manage` | Sperren/Entsperren (Begründung Pflicht), E-Mail-Verifikation setzen |
| DELETE | `/admin/users/:id/sessions` | `identity.user.manage` | Alle Sessions beenden |
| POST | `/admin/users/:id/delete` | `identity.user.manage` + Vier-Augen | DSGVO-Löschung (US-12-05) |
| GET/POST/PATCH/DELETE | `/admin/auth-providers[/:id]` | `identity.provider.manage` | Provider-CRUD (Secrets write-only) |
| POST | `/admin/auth-providers/:id/test` | `identity.provider.manage` | Verbindungstest (US-02-04) |
| GET/POST/DELETE | `/admin/invitations[/:id]` | `identity.invitation.manage` | Einladungen |
