# Schema · identity

**Spezifikation:** [services/identity-service.md](../../services/identity-service.md) ·
**Landkarte:** [architecture/modules/identity.md](../../architecture/modules/identity.md)

## users

| Spalte | Typ | Constraints | Beschreibung |
|---|---|---|---|
| id | uuid | PK | |
| handle | String | UNIQUE, 3–39 `[a-z0-9-]` | lowercase-normalisiert (K-DB-14) |
| displayName | String | NOT NULL | |
| email | String | UNIQUE | lowercase-normalisiert |
| emailVerifiedAt | DateTime? | | null = unverifiziert (Regel I-7) |
| status | Enum `UserStatus` | NOT NULL, default `active` | `active` \| `suspended` \| `deactivated` \| `deleted` |
| locale | String | default Instanz-Default | BCP-47, UI-Sprache |
| avatarMediaId | uuid? | FK→media_objects, SetNull | |
| suspendedReason | String? | | nur Admin-lesbar |
| lastLoginAt | DateTime? | | |

Indizes: `status`, `email`, `handle`.

```prisma
model User {
  id              String     @id @db.Uuid
  handle          String     @unique
  displayName     String     @map("display_name")
  email           String     @unique
  emailVerifiedAt DateTime?  @map("email_verified_at")
  status          UserStatus @default(active)
  locale          String     @default("en")
  avatarMediaId   String?    @map("avatar_media_id") @db.Uuid
  // Relationen: credential, identities, sessions, mfaCredentials, ...
  createdAt       DateTime   @default(now()) @map("created_at")
  updatedAt       DateTime   @updatedAt @map("updated_at")
  @@index([status])
  @@map("users")
}
```

## user_credentials (lokales Passwort, 1:1 optional)

| Spalte | Typ | Constraints | Beschreibung |
|---|---|---|---|
| userId | uuid | PK, FK→users Cascade | |
| passwordHash | String | NOT NULL | Argon2id (Parameter → security/02) |
| passwordChangedAt | DateTime | NOT NULL | für Session-Invalidierung |

## auth_provider_configs (instanzweit konfigurierte Provider)

| Spalte | Typ | Constraints | Beschreibung |
|---|---|---|---|
| id | uuid | PK | |
| type | Enum `AuthProviderType` | NOT NULL | `discord` \| `github` \| `google` \| `oidc` |
| slug | String | UNIQUE | URL-Bestandteil (`/auth/oauth/:slug/...`) |
| displayName | String | NOT NULL | Login-Button-Text |
| clientId | String | NOT NULL | |
| clientSecretEnc | Bytes | NOT NULL | verschlüsselt (K-DB-16) |
| issuerUrl | String? | | nur `oidc` (Discovery) |
| scopes | String[] | | Default je Typ |
| enabled | Boolean | default false | |
| allowRegistration | Boolean | default true | Neuanlage über diesen Provider erlaubt |
| jitProvisioning | Boolean | default false | Regel I-5 (`closed`-Modus) |
| trustEmailVerified | Boolean | default false | Auto-Linking-Regel I-10 |

## auth_identities (Account-Linking)

| Spalte | Typ | Constraints | Beschreibung |
|---|---|---|---|
| id | uuid | PK | |
| userId | uuid | FK→users Cascade | |
| providerId | uuid | FK→auth_provider_configs Cascade | |
| providerUserId | String | NOT NULL | Subjekt-ID beim Provider |
| providerEmail | String? | | Stand letzter Login |
| providerUsername | String? | | Anzeige („Verknüpft als …") |
| refreshTokenEnc | Bytes? | | nur falls benötigt (Regel I-12) |
| lastUsedAt | DateTime? | | |

Unique: (`providerId`, `providerUserId`) · Index: `userId`.

## sessions (DB-Spiegel; Redis ist Laufzeit-Quelle)

| Spalte | Typ | Constraints | Beschreibung |
|---|---|---|---|
| id | uuid | PK | |
| userId | uuid | FK→users Cascade | |
| tokenHash | String | UNIQUE | SHA-256 (K-DB-17) |
| mfaVerified | Boolean | default false | Regel I-15 |
| ip | String? | | gekürzt speicherbar (Datenschutz) |
| userAgent | String? | | |
| lastActiveAt | DateTime | NOT NULL | rolling idle timeout |
| expiresAt | DateTime | NOT NULL | absolute Lebensdauer |
| revokedAt | DateTime? | | + `revokedBy` uuid? |

Indizes: (`userId`, `revokedAt`), `expiresAt` (GC).

## mfa_credentials

| Spalte | Typ | Constraints | Beschreibung |
|---|---|---|---|
| id | uuid | PK | |
| userId | uuid | FK→users Cascade | |
| type | Enum `MfaType` | NOT NULL | `totp` \| `webauthn` (I-19) |
| secretEnc | Bytes? | | TOTP-Secret verschlüsselt |
| publicKey / credentialId / counter | Bytes? / String? / BigInt? | | WebAuthn-Felder (Phase 3) |
| label | String? | | „Mein Handy" |
| verifiedAt | DateTime? | | aktiv erst nach Verifizierung (I-16) |
| lastUsedStep | BigInt? | | TOTP-Replay-Schutz (I-16) |

Unique: (`userId`, `type`) für `totp` (max. 1 TOTP je Konto).

## recovery_codes

`id` uuid PK · `userId` FK Cascade · `codeHash` String (Argon2id) · `usedAt` DateTime? ·
Index (`userId`, `usedAt`). 10 Stück je Generierung; Regenerierung löscht alte (I-17).

## personal_access_tokens

`id` uuid PK · `userId` FK Cascade · `label` String · `tokenHash` String UNIQUE ·
`tokenPrefix` String (Anzeige `lirp_xxxx…`) · `scopes` String[] (Permission-Keys) ·
`expiresAt` DateTime NOT NULL · `lastUsedAt` DateTime? · `revokedAt` DateTime?.

## invitations

`id` uuid PK · `email` String? · `invitedUserId` uuid? (bestehender Nutzer) · `tokenHash`
String UNIQUE · `invitedById` uuid FK→users · `roleAssignments` Json? (vordefinierte Rollen,
I-21) · `orgId` uuid? (Org-Einladung, O-3) · `status` Enum (`pending`\|`accepted`\|`declined`\|
`expired`\|`revoked`) · `expiresAt` DateTime.

## email_tokens (Verifizierung / Passwort-Reset)

`id` uuid PK · `userId` FK Cascade · `purpose` Enum (`verify_email`\|`reset_password`\|
`change_email`) · `tokenHash` String UNIQUE · `payload` Json? (z. B. neue E-Mail) ·
`expiresAt` DateTime · `usedAt` DateTime?. Einmalgebrauch erzwungen (`usedAt`-Check).

## handle_redirects

`oldHandle` String PK · `userId` uuid FK Cascade · `expiresAt` DateTime (90 Tage, I-2).
