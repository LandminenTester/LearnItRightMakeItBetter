# Schema · authorization

**Spezifikation:** [services/authorization-service.md](../../services/authorization-service.md) ·
**Landkarte:** [architecture/modules/authorization.md](../../architecture/modules/authorization.md)

## permissions (DB-Sync des Code-Katalogs, Regel A-2)

| Spalte | Typ | Constraints | Beschreibung |
|---|---|---|---|
| key | String | PK | `<modul>.<ressource>.<aktion>` |
| module | String | NOT NULL | Gruppierung für Admin-UI |
| description | String | NOT NULL | deutschsprachig, aus Katalog |
| deprecated | Boolean | default false | verwaist im Code → markiert, nie gelöscht |

## roles

| Spalte | Typ | Constraints | Beschreibung |
|---|---|---|---|
| id | uuid | PK | |
| key | String | UNIQUE | `space.maintainer`, custom: `custom.<slug>` |
| name | String | NOT NULL | Anzeigename |
| description | String? | | |
| scopeType | Enum `ScopeType` | NOT NULL | `global` \| `organization` \| `space` \| `language` |
| isSystem | Boolean | default false | Regel A-3 (geschützt) |
| orgId | uuid? | FK→organizations Cascade | org-eigene Custom-Rollen |

## role_permissions

`roleId` FK→roles Cascade · `permissionKey` FK→permissions · zusammengesetzter PK ·
`isCore` Boolean (Systemrollen-Kern, nicht entfernbar, A-3).

## role_assignments

| Spalte | Typ | Constraints | Beschreibung |
|---|---|---|---|
| id | uuid | PK | |
| principalType | Enum | NOT NULL | `user` \| `group` |
| principalId | uuid | NOT NULL | User- oder Group-ID (polymorph, App-validiert) |
| roleId | uuid | FK→roles Cascade | |
| scopeType | Enum `ScopeType` | NOT NULL | muss `role.scopeType` entsprechen |
| scopeId | uuid/String? | | Org-/Space-ID bzw. Locale bei `language`; NULL bei `global` |
| assignedById | uuid? | FK→users SetNull | |
| expiresAt | DateTime? | | zeitgebunden (Schema vorbereitet, UI Phase 3) |

Unique: (`principalType`, `principalId`, `roleId`, `scopeType`, `scopeId`) ·
Indizes: (`principalType`, `principalId`), (`scopeType`, `scopeId`).

## groups

`id` uuid PK · `key` String UNIQUE · `name` String · `description` String? ·
`orgId` uuid? FK Cascade (org-gebundene Gruppen) · `teamId` uuid? UNIQUE FK→teams Cascade
(Team-Spiegelgruppe, O-Team-Regel) · Index `orgId`.

## group_members

`groupId` FK Cascade · `userId` FK Cascade · PK zusammengesetzt · `addedById` uuid? ·
Index `userId`.

## policies (ABAC, Regel A-5/A-6)

| Spalte | Typ | Constraints | Beschreibung |
|---|---|---|---|
| id | uuid | PK | |
| name | String | UNIQUE | |
| description | String? | | |
| effect | Enum | NOT NULL | `allow` \| `deny` |
| actions | String[] | NOT NULL | Permission-Keys, Wildcard `modul.ressource.*` |
| subjectCondition | Json? | | Bedingungssprache v1 (Zod-validiert, K-DB-8) |
| resourceCondition | Json? | | |
| contextCondition | Json? | | |
| priority | Int | default 0 | höher = früher evaluiert |
| enabled | Boolean | default true | |
| conditionVersion | String | default `v1` | Sprachversion (A-Erweiterbarkeit) |

Index: (`enabled`, `priority`).
