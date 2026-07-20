# Schema · organization

**Spezifikation:** [services/organization-service.md](../../services/organization-service.md) ·
**Landkarte:** [architecture/modules/organization.md](../../architecture/modules/organization.md)

## organizations

| Spalte | Typ | Constraints | Beschreibung |
|---|---|---|---|
| id | uuid | PK | |
| slug | String | UNIQUE | Regeln wie Handles + reservierte Namen (O-7) |
| name | String | NOT NULL | |
| description | String? | | Markdown-Subset |
| logoMediaId | uuid? | FK→media_objects SetNull | |
| visibility | Enum `OrgVisibility` | NOT NULL | `public` \| `private` (O-5) |
| settings | Json | default `{}` | `membersListVisibility`, Space-Defaults |
| deletedAt | DateTime? | | Soft-Delete-Fenster 14 Tage (O-6, K-DB-5) |

## organization_members

| Spalte | Typ | Constraints | Beschreibung |
|---|---|---|---|
| orgId | uuid | FK→organizations Cascade | |
| userId | uuid | FK→users Cascade | |
| status | Enum | NOT NULL | `invited` \| `active` (O-3) |
| joinedAt | DateTime? | | |

PK: (`orgId`, `userId`) · Index: `userId` (Mitgliedschaften eines Nutzers, ABAC-Attribut).
Rechte (Owner/Admin/Member) laufen über `role_assignments` im Org-Scope — nicht hier.

## teams

`id` uuid PK · `orgId` FK Cascade · `slug` String · `name` String · `description` String? ·
Unique (`orgId`, `slug`). Jedes Team besitzt eine Spiegelgruppe in `groups`
(`Group.teamId`) als Rechteträger (US-08-03).

## team_members

(`teamId` FK Cascade, `userId` FK Cascade) PK — App hält Spiegelgruppe synchron.

## organization_invites

`id` uuid PK · `orgId` FK Cascade · `email` String? **oder** `invitedUserId` uuid? ·
`tokenHash` String UNIQUE · `invitedById` FK→users · `roleKey` String default `org.member` ·
`status` Enum (`pending`\|`accepted`\|`declined`\|`expired`\|`revoked`) · `expiresAt` DateTime ·
Index (`orgId`, `status`).
