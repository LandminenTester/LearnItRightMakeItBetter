# Search Service

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20 ·
**FRs:** FR-SRCH-001…008 · **ADR:** [ADR-0005](../architecture/decisions/adr-0005-meilisearch.md) ·
**Epic:** [E-06](../requirements/epics/e-06-search-discovery/README.md)

## 1. Zweck & Verantwortlichkeiten

Kapselt Meilisearch vollständig:

- Index-Definitionen, Settings (searchable/filterable/sortable attributes, Ranking)
- Indexierungspipeline (Events → `search-index`-Jobs → Upsert/Delete)
- Query-API mit **berechtigungsbewussten Filtern**
- Reindex-Werkzeuge und Konsistenz-Checks
- Degradations-Verhalten bei Meilisearch-Ausfall

Meilisearch ist **abgeleiteter Zustand** — jederzeit vollständig aus PostgreSQL rekonstruierbar.

## 2. Abgrenzung

Kein Modul außer `search` spricht Meilisearch an (Regel M-1 sinngemäß). Dokumentinhalte liefern
die Fachmodule über Read-Ports; `search` kennt deren Prisma-Modelle nicht.

## 3. Indizes & Dokumente

### `articles` — ein Dokument **pro Sprachfassung**

| Feld | Typ | Rolle |
|---|---|---|
| `id` | `article:<articleId>:<locale>` | PK |
| `articleId`, `locale`, `isOriginal` | string/bool | Verknüpfung/Filter |
| `title`, `summary`, `content` (Markdown → Plaintext), `tags[]` | text | searchable |
| `type`, `spaceId`, `spaceSlug`, `categoryPath[]`, `authorHandle` | keyword | filterable/facets |
| `visibility` (`public`/`internal`/`org:<id>`/`space:<id>`) | keyword | **Sicherheitsfilter** |
| `status` (`published`/`archived`), `isOutdated` | keyword/bool | Filter |
| `helpfulCount`, `publishedAt` | number | Ranking/sortable |

### `projects`

`id`, `name`, `description`, `tags[]`, `ownerHandle/orgSlug`, `visibility`, `stars`,
`primaryLanguage`, `lastActivityAt`.

### `comments`

`id`, `articleId`+`locale`-Kontext, `body` (Plaintext), `authorHandle`, `visibility` (erbt vom
Artikel/Space), `createdAt`. (Phase 2, FR-SRCH-006.)

## 4. Fachliche Regeln

- **S-1:** **Sichtbarkeitsfilter sind Teil jeder Query** — zusammengesetzt aus:
  `visibility = public` ∪ (`internal` wenn angemeldet) ∪ `org:<ids>` ∪ `space:<ids>` aus
  `AccessDecisionPort.getAccessibleScopeIds`. Es gibt keinen Query-Pfad ohne Filter; auch
  Facetten-Zähler laufen gefiltert (US-06-02).
- **S-2:** Ranking `articles`: Meilisearch-Defaults (words, typo, proximity, attribute,
  exactness) + custom: `helpfulCount:desc`, `publishedAt:desc`. Titel > Summary > Content
  (searchable-Reihenfolge). Archivierte nur mit explizitem Filter.
- **S-3:** Indexierung asynchron; Job-IDs deterministisch (`index:article:<id>:<locale>`);
  Ziel-Latenz ≤ 30 s (NFR-008). Sichtbarkeitsänderungen eines Space/einer Org triggern
  Batch-Reindex der betroffenen Dokumente.
- **S-4:** Reindex (FR-SRCH-007): baut in einen **Swap-Index** (`articles_new` → Alias-Wechsel),
  damit die Suche währenddessen verfügbar bleibt; Fortschritt über Job-Status abfragbar.
- **S-5:** Konsistenz-Check (nächtlich): vergleicht Dokument-IDs+`updatedAt` mit der DB,
  re-indiziert Drift, meldet Abweichungen > 1 % als System-Warnung.
- **S-6:** Degradation: Meilisearch down ⇒ Query-API antwortet `503 search_unavailable`;
  Frontend zeigt Wartungshinweis; Indexierungs-Jobs bleiben in der Queue (Retry).
- **S-7:** Query-Härtung: max. Query-Länge 256, Pagination-Limits, Rate Limit; keine rohen
  Meilisearch-Filter vom Client — nur typisierte Facetten-Parameter.

## 5. Schnittstellen

**API:** `GET /search` (q, Typ, Facetten, Pagination), `GET /search/suggest` (Command Palette),
Admin: `POST /admin/search/reindex/:index`, `GET /admin/search/status`.

**Konsumierte Events:** `knowledge.article.published/archived/deleted`,
`knowledge.comment.created/deleted`, `translation.translation.published/outdated/archived`,
`repository.sync.completed`, `identity.user.deleted`, `knowledge.space.visibility_changed`,
`authorization.assignment.changed` (nur bei Space-/Org-Sichtbarkeitsrelevanz).

**Ports (genutzt):** `KnowledgeReadPort.getArticleForIndex`,
`TranslationReadPort.getTranslationForIndex`, `RepositoryReadPort.getProjectForIndex`.

## 6. Hintergrundjobs

| Job | Queue | Zweck |
|---|---|---|
| `index-article` / `index-project` / `index-comment` | search-index | Upsert einzelner Dokumente |
| `remove-document` | search-index | Delete |
| `reindex-all:<index>` | search-index | Vollaufbau mit Swap (S-4) |
| `search-consistency-check` | maintenance | Drift-Erkennung (S-5) |

## 7. Konfiguration

`MEILI_HOST`, `MEILI_MASTER_KEY` (ENV); Ranking-Feinwerte instanzkonfigurierbar (Phase 2+).

## 8. Sicherheit

S-1 ist die kritischste Regel des Moduls — dedizierte Leak-Tests
([testing/scenarios](../testing/scenarios/wissens-loop.md) + Suite in testing/02). Der
Meilisearch-Master-Key bleibt serverseitig; es werden keine clientseitigen Meilisearch-Zugriffe
oder Tenant-Tokens ausgegeben (bewusste Entscheidung: ein Query-Pfad durchs Backend).

## 9. Offene Punkte

- Sprachspezifische Stoppwörter/Synonyme je Content-Sprache pflegen — iterativ ab Phase 2.
- Suchanalytik (Top-Queries, Null-Treffer) — nach 1.0, datenschutzbewusst.
