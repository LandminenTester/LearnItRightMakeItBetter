# API-Authentifizierung & Tokens

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20 ·
**ADR:** [ADR-0011](../architecture/decisions/adr-0011-session-auth-server-side.md) ·
**Fachregeln:** [services/identity-service.md](../services/identity-service.md)

## 1. Zwei Authentifizierungswege

| Weg | Für | Mechanik |
|---|---|---|
| **Session-Cookie** | Browser (Web-App) | `__Host-session` HTTP-only-Cookie; CSRF-geschützt |
| **Personal Access Token** | Skripte, CI, Integrationen | `Authorization: Bearer lirp_<token>`; kein CSRF (kein Cookie); Scopes limitieren |

Ein Request wird genau einem Weg zugeordnet: `Authorization`-Header hat Vorrang; Cookie wird
dann ignoriert.

## 2. Session-Flow (Browser)

```
POST /auth/login { email, password }        → 200 { user } + Set-Cookie  (oder 200 { mfaRequired: true, challengeToken })
POST /auth/mfa/verify { challengeToken, code | recoveryCode } → 200 { user } + Set-Cookie (mfaVerified)
GET  /auth/session                          → 200 { user, permissions[], mfaVerified, instanceMeta } | 401
POST /auth/logout                           → 204 + Cookie-Invalidierung
```

- Cookie-Attribute: `__Host-`-Präfix, `Secure`, `HttpOnly`, `SameSite=Lax`, `Path=/`.
- `GET /auth/session` ist der einzige Weg, wie das Frontend den Anmeldezustand erfährt
  (hydratisiert den `auth`-Store; enthält effektive Permission-Keys **nur zur Anzeige**).
- Re-Auth-pflichtige Endpunkte (Regel I-15) verlangen den Header `X-Reauth-Token`, den
  `POST /auth/reauth { password | totp }` für 5 Minuten ausstellt; sonst 403 `reauth_required`.

## 3. CSRF-Schutz (nur Cookie-Weg)

Double-Submit-Muster: `GET /auth/session` liefert zusätzlich ein `csrfToken` (an Session
gebunden); alle mutierenden Requests senden es als `X-CSRF-Token`-Header. Fehlt/falsch →
403 `csrf_failed`. PAT-Requests sind ausgenommen (kein Ambient-Credential).
Details: [security/05](../security/05-application-security.md).

## 4. OAuth-/OIDC-Endpunkte (Browser-Redirect-Flow)

```
GET /auth/providers                          → aktivierte Provider (Anzeige Login-Screen)
GET /auth/oauth/:providerSlug/start?returnTo=/app   → 302 zum IdP (state+PKCE, Regel I-12)
GET /auth/oauth/:providerSlug/callback       → 302 returnTo | /auth/link-confirm | Fehlerseite
POST /users/me/identities/:providerSlug/link → Start Link-Flow (angemeldet, Re-Auth)
DELETE /users/me/identities/:id              → Unlink (Regel I-11, Re-Auth)
```

`returnTo` wird gegen eine Allowlist relativer Pfade validiert (kein Open Redirect).

## 5. Personal Access Tokens

```
POST   /users/me/tokens { label, scopes[], expiresAt } → 201 { token: "lirp_…" }  (einmalig!)
GET    /users/me/tokens                                 → Liste (Präfix, Scopes, lastUsedAt)
DELETE /users/me/tokens/:id                             → 204 (sofortiger Widerruf)
```

- Scopes sind Permission-Keys; effektive Rechte = Schnittmenge(Token-Scopes, aktuelle Rechte
  des Besitzers) — Rollenentzug wirkt sofort auch auf PATs (Regel I-20).
- PAT-Requests werden auditiert (`actorType = pat`) und unterliegen eigenen Rate Limits.
- Nicht per PAT nutzbar: Auth-/MFA-/Setup-Endpunkte, Re-Auth-pflichtige Aktionen.

## 6. Fehler-Semantik

| Situation | Antwort |
|---|---|
| Kein/ungültiges Credential | 401 `unauthenticated` |
| Gültig, aber Recht fehlt | 403 `permission_denied` (bzw. 404 bei Existenz-Schutz) |
| MFA-Policy greift, Session ohne MFA | 403 `mfa_required` (Frontend leitet in Enrollment/Challenge) |
| Frische Re-Auth nötig | 403 `reauth_required` |
| Konto gesperrt/deaktiviert | 401 `account_inactive` (Session zerstört) |
