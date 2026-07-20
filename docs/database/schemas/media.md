# Schema · media

**Spezifikation:** [services/media-service.md](../../services/media-service.md) ·
**Landkarte:** [architecture/modules/media.md](../../architecture/modules/media.md)

## media_objects

| Spalte | Typ | Constraints | Beschreibung |
|---|---|---|---|
| id | uuid | PK | |
| ownerId | uuid | FK→users Restrict | Uploader |
| orgId | uuid? | FK→organizations SetNull | Quota-Kontext bei Org-Assets |
| kind | Enum `MediaKind` | NOT NULL | `content` \| `avatar` \| `logo` \| `branding` |
| originalFilename | String | NOT NULL | nur Anzeige — nie Teil des Storage-Keys |
| mimeType | String | NOT NULL | validierte Allowlist |
| sizeBytes | Int | NOT NULL | Original |
| checksumSha256 | String | | Dedupe (MD-5), Index |
| status | Enum `MediaStatus` | NOT NULL | `processing` \| `ready` \| `failed` \| `quarantined` |
| storageDriver | String | NOT NULL | `filesystem` \| `s3` \| `azure-blob` \| `gcs` |
| storageKeyBase | String | NOT NULL | `media/<shard>/<id>/` |
| width / height | Int? | | Originalmaße |
| variants | Json | default `[]` | je Variante: name, format, width, sizeBytes, key |
| visibility | Enum | NOT NULL | `public` \| `restricted` (erbt vom Verwendungsort, MD-2) |
| errorReason | String? | | bei failed/quarantined |
| deletedAt | DateTime? | | Soft-Delete (MD-4) |

Indizes: (`ownerId`, `status`), `checksumSha256`, (`status`, `deletedAt`) für Cleanup.

## media_usages (Referenzzähler für Orphan-Cleanup MD-4)

| Spalte | Typ | Constraints | Beschreibung |
|---|---|---|---|
| mediaId | uuid | FK→media_objects Cascade | |
| resourceType | String | NOT NULL | `article` \| `draft` \| `avatar` \| `org_logo` \| `project` \| `branding` … |
| resourceId | String | NOT NULL | |

PK: (`mediaId`, `resourceType`, `resourceId`) · Index: (`resourceType`, `resourceId`).
