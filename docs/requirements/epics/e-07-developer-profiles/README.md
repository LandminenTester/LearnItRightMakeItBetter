# E-07 · Entwicklerprofile & Reputation

**Status:** Verbindlich · **Phase:** 1–2 · **Priorität:** Must ·
**Module:** [profile](../../../services/profile-service.md), [identity](../../../services/identity-service.md) (Handle) ·
**FRs:** FR-PROF-001…006, FR-IDNT-020 · **Stories:** [user-stories.md](user-stories.md)

## Ziel

Beiträge werden **sichtbar und anerkannt**: Jedes Mitglied hat ein Entwicklerprofil mit
Beitragshistorie (Artikel, Reviews, Übersetzungen, Projekte), Reputation und Achievements
(Fachkonzept §11). Reputation entsteht ausschließlich aus nachvollziehbaren Ereignissen — fair,
idempotent, konfigurierbar.

## Scope

**Enthalten:**

- Profil: Bio, Standort, Website, Social Links, Skills; Avatar (via Media)
- Handle-System mit Redirects (FR-IDNT-020, fachlich bei Identity)
- Beitragshistorie (event-getrieben aggregiert, berechtigungsgefiltert)
- Reputations-Ledger + konfigurierbare Punktwerte + Admin-Korrekturen
- Achievements mit Kriterien-Engine + Seed-Katalog
- Sichtbarkeitseinstellungen pro Profilbereich
- Rebuild-Werkzeug (`recalculate-reputation`)

**Nicht enthalten:** Leaderboards (offener Punkt, opt-in nach 1.0), Follower/Soziales Graph
(nach 1.0), Skill-Endorsements (nach 1.0).

## Phasenschnitt

| Phase | Inhalt |
|---|---|
| 1 | Profil-Basis (Anzeige + Bearbeitung), öffentliche Profilseite |
| 2 | Beitragshistorie, Reputation, Achievements, Sichtbarkeitseinstellungen |

## Abhängigkeiten

Benötigt: E-02 (Konto/Handle), E-10 (Avatar). Konsumiert Events aus E-04, E-05, E-09.

## Erfolgsmetriken

- Doppelte Event-Verarbeitung erzeugt 0 Doppelbuchungen (Idempotenz-Tests, P-2)
- Rebuild aus Ereignishistorie reproduziert Summen exakt (deterministisch)
- Profilseite öffentlich SSR < 500 ms TTFB (NFR-004)

## Risiken & Gegenmaßnahmen

| Risiko | Gegenmaßnahme |
|---|---|
| Gamification-Missbrauch (Punkte-Farming) | Punkte nur für geprüfte Ereignisse (publizierte Inhalte, Reviews); Moderations-Rückbuchung (P-4) |
| Datenschutz (Profil = Personendaten) | Sichtbarkeitseinstellungen, DSGVO-Lösch-Kaskade, keine Indexierung privater Profile |
| Zahlenfixierung statt Qualität | Reputation-Anzeige instanzweit deaktivierbar (Konfiguration) |
