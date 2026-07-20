# Modul-Landkarte · repository

**Zweck:** Open-Source-Integration — Projekte (Owner: Nutzer/Organisation, auch ohne
Repo-Verknüpfung), GitHub-Metadaten-Sync (Stars, Forks, Sprachen, Releases, Aktivität) mit
ETag-/Rate-Limit-Handling, Provider-Abstraktion für spätere GitLab-/Gitea-Adapter.

## Datenhoheit

`Project`, `RepositoryLink`, `RepositoryMetadata`

## Kanten

| Richtung | Beziehung |
|---|---|
| nutzt | `identity`/`organization` (Owner), `authorization`, `search` (`enqueueIndex`), `media` (Projektbild), `notification` (Sync-Fehler), `audit`, `configuration` (Token/Intervall) |
| extern | GitHub REST API (einziges erlaubtes Ziel ausgehender Requests des Moduls) |
| wird genutzt von | `knowledge` (Projektbox via `getProjectBox`), `profile` (Event), `search` |
| publiziert | `repository.project.created/updated/deleted`, `repository.sync.completed/failed` |

## Themenbereich-Dokumente

| Aspekt | Dokument |
|---|---|
| Spezifikation (Regeln R-1…R-8) | [services/repository-service.md](../../services/repository-service.md) |
| Epic + Stories | [E-09 Open-Source-Integration](../../requirements/epics/e-09-open-source-integration/README.md) |
| Datenbankschema | [database/schemas/repository.md](../../database/schemas/repository.md) |
| API-Endpunkte | [api/endpoints/repository.md](../../api/endpoints/repository.md) |
| Sync-Datenfluss | [architecture/05 §4](../05-data-flows.md) |
