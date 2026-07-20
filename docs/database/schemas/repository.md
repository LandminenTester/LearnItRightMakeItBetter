# Schema · repository

**Spezifikation:** [services/repository-service.md](../../services/repository-service.md) ·
**Landkarte:** [architecture/modules/repository.md](../../architecture/modules/repository.md)

## projects

| Spalte | Typ | Constraints | Beschreibung |
|---|---|---|---|
| id | uuid | PK | |
| slug | String | | Unique (`ownerType`, `ownerId`, `slug`) |
| name | String | NOT NULL | |
| description | String? | | Markdown, sanitisiert |
| tags | String[] | | |
| ownerType | Enum | NOT NULL | `user` \| `organization` |
| ownerId | uuid | NOT NULL | polymorph (App-validiert) |
| imageMediaId | uuid? | FK SetNull | |
| visibility | Enum | NOT NULL | `public` \| `unlisted` |
| status | Enum | default `active` | `active` \| `archived` |

Indizes: (`ownerType`, `ownerId`), `visibility`.

## repository_links (1:1 zu projects in 1.0)

| Spalte | Typ | Constraints | Beschreibung |
|---|---|---|---|
| id | uuid | PK | |
| projectId | uuid | UNIQUE, FK→projects Cascade | |
| provider | Enum | NOT NULL | `github` (Adapter-Interface für weitere, R-7) |
| owner / repo | String | NOT NULL | Unique (`provider`, `owner`, `repo`) |
| syncEnabled | Boolean | default true | |
| syncStatus | Enum | NOT NULL | `ok` \| `deferred` \| `broken` (R-4/R-5) |
| lastSyncAt / lastErrorAt | DateTime? | | |
| lastError | String? | | letzte Fehlermeldung (gekürzt) |
| etag | String? | | Conditional Requests (R-3) |

## repository_metadata (1:1 zu repository_links)

| Spalte | Typ | Beschreibung |
|---|---|---|
| linkId | uuid PK FK Cascade | |
| description | String? | vom Repo |
| stars / forks / openIssues | Int | |
| primaryLanguage | String? | |
| languages | Json | `{ "TypeScript": 62.1, ... }` (Prozent) |
| license | String? | SPDX-ID |
| defaultBranch | String? | |
| pushedAt | DateTime? | letzte Aktivität |
| latestRelease | Json? | `{ tag, name, publishedAt, url }` |
| topics | String[] | |
| syncedAt | DateTime | Anzeige „Zuletzt synchronisiert" |
