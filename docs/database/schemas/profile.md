# Schema · profile

**Spezifikation:** [services/profile-service.md](../../services/profile-service.md) ·
**Landkarte:** [architecture/modules/profile.md](../../architecture/modules/profile.md)

## profiles (1:1 zu users)

| Spalte | Typ | Constraints | Beschreibung |
|---|---|---|---|
| userId | uuid | PK, FK→users Cascade | |
| bio | String? | | Markdown-Subset, sanitisiert |
| location | String? | | Freitext |
| website | String? | | `https://`-validiert |
| socialLinks | Json | default `[]` | validierte Typen (github, discord, mastodon, linkedin, custom) |
| skills | String[] | max. 20 (App) | Tech-Tags |
| visibility | Json | default alles `public` | `showContributions` / `showReputation` / `showAchievements`: `public`\|`members`\|`private` (P-7) |

## contribution_events (append-only, Idempotenzanker)

| Spalte | Typ | Constraints | Beschreibung |
|---|---|---|---|
| id | uuid | PK | |
| userId | uuid | FK→users Cascade | |
| kind | Enum `ContributionKind` | NOT NULL | `article_published`, `article_updated`, `review_performed`, `translation_published`, `translation_review_performed`, `helpful_received`, `comment_solution`, `project_created`, … |
| sourceType / sourceId | String / String | NOT NULL | Referenz aufs Fachobjekt |
| **dedupeKey** | String | UNIQUE | `<kind>:<sourceType>:<sourceId>[:<qualifier>]` (P-2) |
| occurredAt | DateTime | NOT NULL | |

Index: (`userId`, `occurredAt`).

## reputation_ledger (append-only)

`id` uuid PK · `userId` FK Cascade · `points` Int (±) · `contributionEventId` uuid? FK ·
`reason` String (i18n-Key oder Admin-Begründung) · `actorId` uuid? (manuelle Korrektur, P-1) ·
Index (`userId`, `createdAt`).

## reputation_summaries (materialisiert, per Rebuild reproduzierbar P-6)

`userId` uuid PK FK Cascade · `total` Int · `byCategory` Json · `recalculatedAt` DateTime.

## achievement_definitions (Seed + instanzweit erweiterbar)

`key` String PK · `nameKey` / `descriptionKey` String (i18n) · `icon` String ·
`criteria` Json (Zod-validiert: kind + Schwellwert(e)) · `enabled` Boolean.

## user_achievements

(`userId` FK Cascade, `achievementKey` FK→achievement_definitions Cascade) PK ·
`awardedAt` DateTime — genau einmal je Paar (P-5).
