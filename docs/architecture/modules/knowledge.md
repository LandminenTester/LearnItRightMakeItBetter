# Modul-Landkarte · knowledge

**Zweck:** Inhaltliches Kernmodul — Spaces, Kategorien, Tags, Artikel (5 Typen) mit
unveränderlicher Versionierung, Lifecycle + Review-Workflow, Änderungsvorschläge, Kommentare,
Hilfreich-Feedback, Slugs/Redirects und die zentrale Markdown-Render-Pipeline.

## Datenhoheit

`Space`, `Category`, `Article`, `ArticleVersion`, `ArticleReview`, `Comment`,
`ArticleFeedback`, `Tag`, `ArticleTag`, `SlugRedirect`, `ArticleProjectLink`

## Kanten

| Richtung | Beziehung |
|---|---|
| nutzt | `authorization` (Space-Scopes), `organization` (Org-Spaces), `media` (`resolveVariants`), `search` (`enqueueIndex`), `notification`, `audit`, `configuration` |
| wird genutzt von | `translation` (`getPublishedVersion`), `search` (`getArticleForIndex`) |
| publiziert | `knowledge.article.submitted/published/archived/deleted`, `knowledge.review.completed`, `knowledge.comment.*`, `knowledge.feedback.given`, `knowledge.space.visibility_changed` |

## Themenbereich-Dokumente

| Aspekt | Dokument |
|---|---|
| Spezifikation (Zustandsautomat, Regeln K-1…K-19) | [services/knowledge-service.md](../../services/knowledge-service.md) |
| Epic + Stories | [E-04 Knowledge Core](../../requirements/epics/e-04-knowledge-core/README.md) |
| Content-Format-Entscheidung | [ADR-0012 Markdown](../decisions/adr-0012-markdown-content-format.md) |
| Datenbankschema | [database/schemas/knowledge.md](../../database/schemas/knowledge.md) |
| API-Endpunkte | [api/endpoints/knowledge.md](../../api/endpoints/knowledge.md) |
| Publikations-Datenfluss | [architecture/05 §2](../05-data-flows.md) |
| XSS-/Sanitizing-Pflichten | [security/05 Application Security](../../security/05-application-security.md) |
