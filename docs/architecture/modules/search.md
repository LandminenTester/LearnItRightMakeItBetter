# Modul-Landkarte · search

**Zweck:** Kapselt Meilisearch vollständig — Indizes (`articles` je Sprachfassung, `projects`,
`comments`), asynchrone Indexierungspipeline, berechtigungsbewusste Query-API
(Sichtbarkeitsfilter in jeder Query), Reindex mit Index-Swap, Konsistenz-Checks, definierte
Degradation.

## Datenhoheit

Keine eigenen PostgreSQL-Tabellen — Meilisearch-Indizes sind abgeleiteter, jederzeit
rekonstruierbarer Zustand ([ADR-0005](../decisions/adr-0005-meilisearch.md)).

## Kanten

| Richtung | Beziehung |
|---|---|
| nutzt (Read-Ports) | `knowledge.getArticleForIndex`, `translation.getTranslationForIndex`, `repository.getProjectForIndex`, `authorization.getAccessibleScopeIds` |
| konsumiert Events | `knowledge.article.*`, `knowledge.comment.*`, `translation.translation.*`, `repository.sync.completed`, `identity.user.deleted`, `knowledge.space.visibility_changed` |
| wird genutzt von | Frontend über `GET /search`; Fachmodule via `enqueueIndex`-Port |

## Themenbereich-Dokumente

| Aspekt | Dokument |
|---|---|
| Spezifikation (Index-Schemata, Regeln S-1…S-7) | [services/search-service.md](../../services/search-service.md) |
| Epic + Stories | [E-06 Suche & Discovery](../../requirements/epics/e-06-search-discovery/README.md) |
| Technologie-Entscheidung | [ADR-0005 Meilisearch](../decisions/adr-0005-meilisearch.md) |
| API-Endpunkte | [api/endpoints/search.md](../../api/endpoints/search.md) |
| Query-Datenfluss | [architecture/05 §6](../05-data-flows.md) |
