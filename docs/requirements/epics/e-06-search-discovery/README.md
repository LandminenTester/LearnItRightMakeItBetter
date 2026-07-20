# E-06 · Suche & Discovery

**Status:** Verbindlich · **Phase:** 1–2 · **Priorität:** Must ·
**Module:** [search](../../../services/search-service.md) ·
**FRs:** FR-SRCH-001…008, FR-PLAT-004 · **ADR:** [ADR-0005](../../../architecture/decisions/adr-0005-meilisearch.md) ·
**Stories:** [user-stories.md](user-stories.md)

## Ziel

Wissen wird **gefunden, nicht gesucht**: Volltextsuche mit Typo-Toleranz, Facetten und
sinnvollem Ranking über Artikel (alle Sprachfassungen), Projekte und Kommentare — strikt
berechtigungsbewusst. Dazu Discovery-Bausteine: Command Palette, SEO für öffentliche Inhalte.

## Scope

**Enthalten:**

- Meilisearch-Indizes `articles` (ein Dokument je Sprachfassung), `projects`, `comments`
- Facetten: Typ, Space, Kategorie, Tags, Sprache, Aktualität; Ranking-Regeln
- Berechtigungsfilter als Teil jeder Query (nie nachträglich)
- Indexierungspipeline (Events → Jobs, ≤ 30 s), Admin-Reindex mit Fortschritt
- Such-UI: Ergebnisseite mit Facetten, globale Command Palette (Cmd/Ctrl+K)
- SEO: SSR, Meta/OpenGraph, Sitemap, kanonische URLs, `hreflang`

**Nicht enthalten:** Personalisierte Empfehlungen, „ähnliche Artikel" (nach 1.0);
Analytics/Suchstatistiken (nach 1.0).

## Phasenschnitt

| Phase | Inhalt |
|---|---|
| 1 | Artikel-Index, Facetten, Berechtigungsfilter, Reindex, Ergebnisseite, SEO |
| 2 | Projekt-/Kommentar-Indizes, Command Palette, Ranking-Feintuning (Hilfreich-Boost) |

## Abhängigkeiten

Benötigt: E-04 (Inhalte + Events), E-03 (`getAccessibleScopeIds`), E-05/E-09 (weitere
Dokumentquellen). Meilisearch als Infrastruktur.

## Erfolgsmetriken

- Suche p95 < 200 ms (NFR-003); Indexierungslatenz ≤ 30 s (NFR-008)
- Leak-Test: 0 Treffer aus unberechtigten Spaces in automatisierten Tests
- Reindex von 50.000 Versionen < 15 min auf Referenzumgebung

## Risiken & Gegenmaßnahmen

| Risiko | Gegenmaßnahme |
|---|---|
| Berechtigungs-Leak über Suche/Facetten | Filter in der Query + dedizierte Leak-Tests (testing/scenarios) |
| Index-Drift (DB ≠ Suche) | idempotente Jobs, nächtlicher Konsistenz-Check, Reindex-Werkzeug |
| Meilisearch-Ausfall legt Instanz lahm | Degradation: Inhalte bleiben navigierbar, Suche zeigt Wartungshinweis (NFR-014) |
