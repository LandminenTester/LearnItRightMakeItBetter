# Schema · knowledge

**Spezifikation:** [services/knowledge-service.md](../../services/knowledge-service.md) ·
**Landkarte:** [architecture/modules/knowledge.md](../../architecture/modules/knowledge.md)

## spaces

| Spalte | Typ | Constraints | Beschreibung |
|---|---|---|---|
| id | uuid | PK | |
| slug | String | UNIQUE | instanzweit eindeutig |
| name | String | NOT NULL | |
| description | String? | | Markdown-Subset |
| visibility | Enum `SpaceVisibility` | NOT NULL | `public` \| `internal` \| `organization` \| `private` (K-1) |
| orgId | uuid? | FK→organizations Restrict | Pflicht bei `organization` |
| reviewRequired | Boolean | default aus Instanz-Policy | K-2 |
| defaultLocale | String | NOT NULL | BCP-47 |
| allowedArticleTypes | Enum[] | default alle | K-2 |
| commentsEnabled | Boolean | default true | |
| iconMediaId | uuid? | FK SetNull | |

Indizes: `visibility`, `orgId`.

## categories

`id` uuid PK · `spaceId` FK Cascade · `parentId` uuid? FK→categories Restrict · `name` String ·
`slug` String · `order` Int · `depth` Int (App-erzwungen ≤ 3, K-3) ·
Unique (`spaceId`, `parentId`, `slug`) · Index (`spaceId`, `order`).

## articles

| Spalte | Typ | Constraints | Beschreibung |
|---|---|---|---|
| id | uuid | PK | |
| spaceId | uuid | FK→spaces Restrict | |
| categoryId | uuid? | FK→categories SetNull | |
| type | Enum `ArticleType` | NOT NULL | `learning_basic` \| `best_practice` \| `how_to` \| `troubleshooting` \| `oss_knowledge` |
| slug | String | | Unique (`spaceId`, `slug`) (K-4) |
| originalLocale | String | NOT NULL | |
| status | Enum `ContentStatus` | NOT NULL | `draft` \| `in_review` \| `published` \| `archived` |
| publishedVersionId | uuid? | FK→article_versions SetNull | K-6, live sichtbare Version |
| createdById | uuid | FK→users Restrict | |
| helpfulCount | Int | default 0 | denormalisiert (K-19) |
| commentCount | Int | default 0 | denormalisiert |
| publishedAt | DateTime? | | Erstpublikation |
| archivedAt / moderationNote | DateTime? / String? | | K-12/K-13 |

Indizes: (`spaceId`, `status`), `type`, `publishedAt`.

```prisma
model ArticleVersion {
  id             String   @id @db.Uuid
  articleId      String   @map("article_id") @db.Uuid
  version        Int
  title          String
  summary        String
  contentMarkdown String  @map("content_markdown")
  contentHtmlCached String? @map("content_html_cached")
  changeNote     String?  @map("change_note")   // Pflicht ab v2 (App, K-5)
  authorId       String   @map("author_id") @db.Uuid
  basedOnVersionId String? @map("based_on_version_id") @db.Uuid
  reviewStatus   ReviewStatus @default(pending) // pending|approved|changes_requested
  createdAt      DateTime @default(now()) @map("created_at")
  article        Article  @relation(fields: [articleId], references: [id], onDelete: Cascade)
  @@unique([articleId, version])
  @@map("article_versions")
}
```

`article_versions` ist **append-only** (K-DB-6); `updatedAt` entfällt; einzige nachträgliche
Änderung: `contentHtmlCached`-Rebuild (K-14) und `reviewStatus`.

## article_reviews

`id` uuid PK · `articleVersionId` FK Cascade · `reviewerId` FK→users Restrict ·
`decision` Enum (`approved`\|`changes_requested`) · `comment` String? (Pflicht bei
`changes_requested`, App K-9) · Unique (`articleVersionId`, `reviewerId`).

## comments

`id` uuid PK · `articleId` FK Cascade · `authorId` FK Restrict · `parentId` uuid? FK→comments
Cascade (1 Ebene, App-erzwungen K-18) · `bodyMarkdown` String · `bodyHtmlCached` String? ·
`editedAt` DateTime? · `resolvedAt` DateTime? · `resolvedById` uuid? · `deletedAt` DateTime?
(Tombstone) · Indizes (`articleId`, `createdAt`), `authorId`.

## article_feedback

`articleId` FK Cascade · `userId` FK Cascade · PK zusammengesetzt · `helpful` Boolean
(1 Stimme je Nutzer+Artikel, K-19).

## tags / article_tags

`tags`: `id` uuid PK · `slug` String UNIQUE · `name` String · `curated` Boolean.
`article_tags`: (`articleId` FK Cascade, `tagId` FK Cascade) PK · max. 10/Artikel (App, K-17).

## slug_redirects

`spaceId` FK Cascade · `oldSlug` String · `articleId` FK Cascade ·
Unique (`spaceId`, `oldSlug`) — unbegrenzt gültig, bereinigt bei Konflikt (K-4).

## article_project_links (FR-KNOW-013)

(`articleId` FK Cascade, `projectId` FK Cascade) PK · `addedById` uuid.
