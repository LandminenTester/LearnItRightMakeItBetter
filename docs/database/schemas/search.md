# Schema · search

**Spezifikation:** [services/search-service.md](../../services/search-service.md) ·
**Landkarte:** [architecture/modules/search.md](../../architecture/modules/search.md)

Das Search-Modul besitzt **keine eigenen PostgreSQL-Tabellen** — Meilisearch-Indizes sind
abgeleiteter, jederzeit per Reindex rekonstruierbarer Zustand
([ADR-0005](../../architecture/decisions/adr-0005-meilisearch.md)). Dieses Dokument definiert
die Index-Settings als Referenz für die Implementierung in
`modules/search/infrastructure/index-settings.ts`.

## Index `articles` (ein Dokument je Sprachfassung)

| Setting | Wert |
|---|---|
| `searchableAttributes` | `title`, `summary`, `content`, `tags` (Reihenfolge = Gewicht, S-2) |
| `filterableAttributes` | `articleId`, `locale`, `isOriginal`, `type`, `spaceId`, `spaceSlug`, `categoryPath`, `tags`, `visibility`, `status`, `isOutdated`, `authorHandle` |
| `sortableAttributes` | `publishedAt`, `helpfulCount` |
| `rankingRules` | words, typo, proximity, attribute, exactness, `helpfulCount:desc`, `publishedAt:desc` |
| `distinctAttribute` | — (Sprachfassungen sind gewollt getrennte Treffer; UI gruppiert nach `articleId` bei Bedarf) |
| `faceting.maxValuesPerFacet` | 50 |
| `typoTolerance` | aktiviert; `minWordSizeForTypos: { oneTypo: 4, twoTypos: 8 }` |

**Sicherheitsregel S-1:** Jede Query enthält den Filter
`visibility IN [public(, internal)(, org:<ids>)(, space:<ids>)] AND status = published`
(Facetten-Zähler eingeschlossen). Archivierte nur bei explizitem `status`-Filter.

## Index `projects`

`searchableAttributes`: `name`, `description`, `tags`, `topics` ·
`filterableAttributes`: `ownerType`, `ownerHandle`, `orgSlug`, `visibility`,
`primaryLanguage`, `tags` · `sortableAttributes`: `stars`, `lastActivityAt`.

## Index `comments` (Phase 2)

`searchableAttributes`: `body` · `filterableAttributes`: `articleId`, `locale`, `visibility`,
`authorHandle` · Sichtbarkeit erbt vom Artikel/Space (Reindex bei Sichtbarkeitswechsel).

## Dokument-Aufbau & Synchronisation

- Dokument-IDs: `article:<articleId>:<locale>`, `project:<id>`, `comment:<id>`.
- Aufbau ausschließlich über Read-Ports der Fachmodule; Markdown → Plaintext (gestrippt) für
  `content`.
- Jobs idempotent (deterministische IDs, Regel M-6); Reindex via Swap-Index (S-4);
  Konsistenz-Check nächtlich (S-5).
