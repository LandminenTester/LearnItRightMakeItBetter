# API · knowledge

**Fachregeln:** [services/knowledge-service.md](../../services/knowledge-service.md) ·
**Stories:** [E-04](../../requirements/epics/e-04-knowledge-core/user-stories.md)

Sichtbarkeitsregel überall: Nicht-Berechtigte erhalten 404 (K-1). `read`-Permissions gelten
implizit für `public`-Inhalte auch anonym.

## Spaces & Struktur

| Methode | Pfad | Permission | Beschreibung |
|---|---|---|---|
| GET | `/spaces` | — | Sichtbare Spaces (Filter: org, visibility) |
| POST | `/spaces` | `knowledge.space.create` | Space anlegen (org-Kontext optional) |
| GET | `/spaces/:slug` | sichtbarkeitsabhängig | Space-Detail inkl. Kategoriebaum |
| PATCH | `/spaces/:slug` | `knowledge.space.manage` (Space) | Einstellungen (K-2), Sichtbarkeit (löst Reindex aus) |
| GET/POST | `/spaces/:slug/categories` | lesend sichtbar / `knowledge.category.manage` | Kategoriebaum/anlegen (max. Tiefe 3, K-3) |
| PATCH/DELETE | `/categories/:id` | `knowledge.category.manage` (Space) | Umbenennen/verschieben/sortieren; löschen nur leer oder mit Ziel |

## Artikel

| Methode | Pfad | Permission | Beschreibung |
|---|---|---|---|
| GET | `/articles` | sichtbarkeitsgefiltert | Liste (Filter: space, type, status, tag, author; Cursor) |
| POST | `/articles` | `knowledge.article.create` (Space) | Entwurf anlegen → Version 1 |
| GET | `/articles/:id` | sichtbarkeitsabhängig | Detail (publizierte Fassung; `?version=` für Berechtigte) |
| GET | `/spaces/:slug/a/:articleSlug` | sichtbarkeitsabhängig | Slug-Auflösung inkl. Redirects (K-4) |
| PATCH | `/articles/:id` | Autor (Draft) oder `manage` | neue Version anlegen (`basedOnVersionId` Pflicht, K-5/K-7) |
| POST | `/articles/:id/submit` | Autor + `article.submit` | draft → in_review (K-8) |
| POST | `/articles/:id/publish` | `knowledge.article.publish` (Space) | Publikation (Review-Bedingung K-10) |
| POST | `/articles/:id/archive` · `/unarchive` | `knowledge.article.manage` | K-12 |
| DELETE | `/articles/:id` | Autor/`manage`, nur nie publiziert | K-13 |
| POST | `/articles/:id/propose` | `article.read`+`article.create` | Änderungsvorschlag Dritter (K-11) |
| GET | `/articles/:id/versions` | Autor/Reviewer/`manage` | Versionshistorie |
| GET | `/articles/:id/versions/:a/diff/:b` | wie Versionen | Markdown-Diff (FR-KNOW-009) |

## Reviews

| Methode | Pfad | Permission | Beschreibung |
|---|---|---|---|
| GET | `/reviews/queue` | `knowledge.review.review` | Eigene Review-Queue (Spaces des Reviewers) |
| POST | `/articles/:id/reviews` | `knowledge.review.review` (Space) | `approved`/`changes_requested` + Kommentar (K-9, kein Selbst-Review) |

## Kommentare & Feedback

| Methode | Pfad | Permission | Beschreibung |
|---|---|---|---|
| GET | `/articles/:id/comments` | sichtbarkeitsabhängig | Threads (K-18) |
| POST | `/articles/:id/comments` | `knowledge.comment.create` | Kommentar/Antwort (1 Ebene) |
| PATCH/DELETE | `/comments/:id` | Autor ≤ 15 min / `knowledge.comment.moderate` | Editieren (`edited`-Flag)/löschen (Tombstone) |
| POST | `/comments/:id/resolve` | Artikel-Autor oder `manage` | Thread auflösen |
| PUT | `/articles/:id/feedback` | auth (verifiziert) | Hilfreich-Stimme setzen/entfernen (K-19) |

## Tags & Rendering

| Methode | Pfad | Permission | Beschreibung |
|---|---|---|---|
| GET | `/tags` | — | Tag-Liste (Filter: kuratiert, Präfix) |
| POST/PATCH/DELETE | `/admin/tags[/:id]` | `knowledge.tag.manage` | Kuratieren/Zusammenführen |
| POST | `/markdown/preview` | auth | Serverseitige Vorschau mit identischer Pipeline (US-04-01; Rate-limitiert) |
