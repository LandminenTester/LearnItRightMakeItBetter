# API · translation

**Fachregeln:** [services/translation-service.md](../../services/translation-service.md) ·
**Stories:** [E-05](../../requirements/epics/e-05-community-translation/user-stories.md)

Modul-Flag `translation` — deaktiviert ⇒ 404 `module_disabled` auf allen Endpunkten.

## Übersetzungen

| Methode | Pfad | Permission | Beschreibung |
|---|---|---|---|
| GET | `/articles/:id/translations` | Artikel-sichtbarkeitsabhängig | Sprachfassungen + Status |
| POST | `/articles/:id/translations` | `translation.translation.create` | Übersetzung beginnen (locale aktiviert, ≠ Original, T-1; 409 wenn vorhanden) |
| GET | `/translations/:id` | sichtbarkeitsabhängig | Detail (publizierte bzw. Arbeitsfassung für Beteiligte) |
| PATCH | `/translations/:id` | Translator (Draft) oder `translation.translation.manage` (Sprache) | neue TranslationVersion (T-2) |
| POST | `/translations/:id/submit` | Translator | draft → in_review |
| POST | `/translations/:id/publish` | `translation.translation.manage` (Sprache) | Publikation (Review-Bedingung T-5) |
| GET | `/translations/:id/versions` | Beteiligte/Reviewer | Historie |
| GET | `/translations/:id/source-diff` | Beteiligte/Reviewer | Diff übersetzte ↔ aktuelle Originalversion (US-05-03.3) |
| POST | `/translations/:id/reviews` | `translation.review.review` (Sprache) | approve / changes_requested (kein Selbst-Review T-5) |
| GET | `/translations/review-queue` | `translation.review.review` | Review-Queue der eigenen Sprachen |

## Sprachen & Dashboards

| Methode | Pfad | Permission | Beschreibung |
|---|---|---|---|
| GET | `/languages` | — | Aktivierte Content-Sprachen |
| POST/PATCH | `/admin/languages[/:locale]` | `translation.language.manage` | Sprache aktivieren/deaktivieren (FR-TRAN-007) |
| GET | `/languages/:locale/dashboard` | `translation.review.review` oder `language.maintainer` (Sprache) | Abdeckung, Outdated-Quote, offene Reviews je Space (T-9) |
| POST | `/languages/:locale/assignments` | `authorization.assignment.assign` (Sprache) | Reviewer/Maintainer ernennen (US-05-04) |

## Leser-Auflösung

Artikel-Leseendpunkte (`/spaces/:slug/a/:articleSlug`) akzeptieren `?locale=` und lösen gemäß
T-7 auf (Übersetzung, sonst Original) — kein separater Endpunkt nötig; `hreflang`-Daten sind
Teil der Artikel-Antwort.
