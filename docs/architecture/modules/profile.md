# Modul-Landkarte · profile

**Zweck:** Entwicklerprofile (Bio, Links, Skills), event-getriebene Beitragshistorie,
Reputation (Ledger + konfigurierbare Punktwerte) und Achievements — Konzept-Kapitel 11 als
eigenes Modul (bewusste Ergänzung zur 11-Modul-Liste des Fachkonzepts).

## Datenhoheit

`Profile`, `ContributionEvent`, `ReputationLedger`, `ReputationSummary`,
`AchievementDefinition`, `UserAchievement`

## Kanten

| Richtung | Beziehung |
|---|---|
| nutzt | `identity` (Konto/Handle), `authorization`, `media` (Avatar-Referenz), `audit` |
| konsumiert Events | `knowledge.article.published`, `knowledge.review.completed`, `knowledge.feedback.given`, `translation.translation.published`, `translation.review.completed`, `repository.project.created`, `identity.user.registered/deleted` |
| publiziert | `profile.achievement.awarded`, `profile.reputation.changed` |
| liefert | ABAC-Attribut `user.reputation` |

## Themenbereich-Dokumente

| Aspekt | Dokument |
|---|---|
| Spezifikation (inkl. Punktwerte/Achievements-Seed) | [services/profile-service.md](../../services/profile-service.md) |
| Epic + Stories | [E-07 Entwicklerprofile & Reputation](../../requirements/epics/e-07-developer-profiles/README.md) |
| Datenbankschema | [database/schemas/profile.md](../../database/schemas/profile.md) |
| API-Endpunkte | [api/endpoints/profile.md](../../api/endpoints/profile.md) |
| DSGVO-Aspekte | [database/06 Data Lifecycle](../../database/06-data-lifecycle-gdpr.md) |
