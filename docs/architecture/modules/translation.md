# Modul-Landkarte · translation

**Zweck:** Community-getriebene Übersetzungen — Sprachfassungen pro Artikel mit eigenem
Lifecycle/Versionierung, Quellversions-Bindung mit Outdated-Kaskade, Rollen (Translator,
Translation Reviewer, Language Maintainer), Sprach-Dashboards. Keine KI-Pflicht.

## Datenhoheit

`ContentLanguage`, `ArticleTranslation`, `TranslationVersion`, `TranslationReview`

## Kanten

| Richtung | Beziehung |
|---|---|
| nutzt | `knowledge` (`getPublishedVersion`), `authorization` (Language-Scope), `organization`, `search` (`enqueueIndex`), `notification`, `audit`, `configuration` |
| konsumiert Events | `knowledge.article.published` (Outdated-Kaskade), `knowledge.article.archived` |
| publiziert | `translation.translation.submitted/published/outdated/archived`, `translation.review.completed` |
| wird genutzt von | `knowledge`-Ausspielung/SSR (`getPublishedTranslation`), `search` |

## Themenbereich-Dokumente

| Aspekt | Dokument |
|---|---|
| Spezifikation (Regeln T-1…T-10) | [services/translation-service.md](../../services/translation-service.md) |
| Epic + Stories | [E-05 Community Translation](../../requirements/epics/e-05-community-translation/README.md) |
| Datenbankschema | [database/schemas/translation.md](../../database/schemas/translation.md) |
| API-Endpunkte | [api/endpoints/translation.md](../../api/endpoints/translation.md) |
| Übersetzungs-Datenfluss | [architecture/05 §3](../05-data-flows.md) |
| E2E-Szenario | [testing/scenarios/translation.md](../../testing/scenarios/translation.md) |
