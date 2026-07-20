# E-06 · User Stories

**Epic:** [README.md](README.md) · Fachregeln: [search-service.md](../../../services/search-service.md)

## US-06-01 · Finden statt suchen (P1 Alex, P8 Gast) — FR-SRCH-001, 002, 004 · Must · Phase 1

1. **Gegeben** der Suchbegriff „NUI Fokus Problem" (mit Tippfehler „Fokuss"), **wenn** ich suche,
   **dann** liefern die Ergebnisse relevante Troubleshooting-Artikel zuerst; Titel-Treffer
   ranken vor reinen Body-Treffern.
2. **Gegeben** die Ergebnisseite, **wenn** ich Facetten (Typ, Space, Tag, Sprache) kombiniere,
   **dann** aktualisieren sich Trefferliste und Facetten-Zähler konsistent.
3. **Gegeben** ein Suchergebnis, **dann** zeigt es Titel, Highlight-Snippet, Typ-Badge, Space,
   Sprache und Aktualität.

## US-06-02 · Nur sehen, was ich darf (alle) — FR-SRCH-003 · Must · Phase 1

1. **Gegeben** ein privater Org-Space, **wenn** ein Nicht-Mitglied sucht, **dann** erscheinen
   dessen Inhalte weder in Treffern noch in Facetten-Zählern noch in Suggest-Vorschlägen.
2. **Gegeben** derselbe Nutzer wird Org-Mitglied, **dann** erscheinen die Inhalte ohne Reindex
   (Filter wertet aktuelle Scope-Liste des Nutzers aus).
3. **Gegeben** ein anonymer Besucher, **dann** durchsucht er ausschließlich `public`-Inhalte.

## US-06-03 · Mehrsprachige Treffer (P8 Gast) — FR-SRCH-001, FR-TRAN-008 · Must · Phase 1

1. **Gegeben** ein Artikel mit `de`-Übersetzung, **wenn** ich auf Deutsch suche, **dann** finde
   ich die deutsche Fassung als eigenes Dokument; der Treffer verlinkt direkt die Sprachfassung.
2. **Gegeben** mein Sprachfilter `de`, **dann** erscheinen nur `de`-Fassungen (inkl. Originale
   in `de`).

## US-06-04 · Command Palette (alle) — FR-SRCH-008 · Should · Phase 2

1. **Gegeben** Cmd/Ctrl+K an beliebiger Stelle, **wenn** ich tippe, **dann** sehe ich gruppierte
   Schnellergebnisse (Artikel, Projekte, Personen, Navigation/Aktionen) mit vollständiger
   Tastatursteuerung (↑↓, Enter, Esc).
2. **Gegeben** ein Admin, **dann** enthalten die Aktionen auch Admin-Ziele (nur bei Berechtigung).

## US-06-05 · Über Suchmaschinen gefunden werden (P8 Gast) — FR-PLAT-004 · Should · Phase 1

1. **Gegeben** ein öffentlicher Artikel, **wenn** ein Crawler ihn abruft, **dann** liefert SSR
   vollständiges HTML mit Title/Description/OpenGraph, kanonischer URL und `hreflang` für alle
   Sprachfassungen.
2. **Gegeben** die Sitemap, **dann** enthält sie ausschließlich `public`-Inhalte und
   aktualisiert sich bei Publikationen.

## US-06-06 · Reindex im Griff (P7 Sam) — FR-SRCH-005, 007 · Must · Phase 1

1. **Gegeben** die Admin-Suche-Seite, **wenn** ich „Reindex articles" starte, **dann** läuft der
   Job im Hintergrund mit Fortschrittsanzeige (n/total) und die bestehende Suche bleibt während
   des Laufs verfügbar (Index-Swap).
2. **Gegeben** der nächtliche Konsistenz-Check findet Drift, **dann** wird eine System-Warnung
   (E-11) mit Details erzeugt.
