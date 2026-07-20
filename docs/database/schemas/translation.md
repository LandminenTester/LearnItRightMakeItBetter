# Schema · translation

**Spezifikation:** [services/translation-service.md](../../services/translation-service.md) ·
**Landkarte:** [architecture/modules/translation.md](../../architecture/modules/translation.md)

## content_languages

| Spalte | Typ | Constraints | Beschreibung |
|---|---|---|---|
| locale | String | PK | BCP-47 (`de`, `en`, `pt-BR`) |
| name | String | NOT NULL | Eigenname („Deutsch") |
| enabled | Boolean | default false | FR-TRAN-007; Deaktivierung versteckt, löscht nicht |

## article_translations

| Spalte | Typ | Constraints | Beschreibung |
|---|---|---|---|
| id | uuid | PK | |
| articleId | uuid | FK→articles Cascade | |
| locale | String | FK→content_languages Restrict | ≠ `article.originalLocale` (App, T-1) |
| status | Enum `TranslationStatus` | NOT NULL | `draft` \| `in_review` \| `published` \| `outdated` \| `archived` (T-3) |
| publishedVersionId | uuid? | FK→translation_versions SetNull | |
| publishedAt | DateTime? | | |

Unique: (`articleId`, `locale`) · Indizes: (`locale`, `status`), `status`.

## translation_versions (append-only, K-DB-6)

| Spalte | Typ | Constraints | Beschreibung |
|---|---|---|---|
| id | uuid | PK | |
| translationId | uuid | FK→article_translations Cascade | |
| version | Int | | Unique (`translationId`, `version`) |
| title / summary / contentMarkdown | String | NOT NULL | übersetzte Felder (T-8) |
| contentHtmlCached | String? | | Render-Cache |
| translatorId | uuid | FK→users Restrict | Attribution (CC BY-SA) |
| **sourceVersionId** | uuid | FK→article_versions Restrict | übersetzte Originalversion (T-2 — Kern der Outdated-Logik) |
| changeNote | String? | | |
| reviewStatus | Enum `ReviewStatus` | default `pending` | |

## translation_reviews

`id` uuid PK · `translationVersionId` FK Cascade · `reviewerId` FK→users Restrict ·
`decision` Enum (`approved`\|`changes_requested`) · `comment` String? ·
Unique (`translationVersionId`, `reviewerId`) · Selbst-Review App-seitig ausgeschlossen (T-5).
