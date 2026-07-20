# E-14 · User Stories

**Epic:** [README.md](README.md) · Regeln: [design-system/](../../../design-system/README.md)

## US-14-01 · Konsistente UI bauen (Entwicklungsteam) — FR-PLAT-007 · Must · Phase 0

1. **Gegeben** eine neue View, **wenn** sie gebaut wird, **dann** verwendet sie ausschließlich
   Design-System-Komponenten und Tokens; der Token-Lint schlägt bei Rohwerten (Hex-Farben,
   px-Abstände außerhalb der Skala, Ad-hoc-Schatten) fehl.
2. **Gegeben** ein neuer UI-Baustein wird zweimal gebraucht, **dann** entsteht er im Design
   System (mit Doku + Tests), nie in `apps/frontend/components` dupliziert.
3. **Gegeben** die Komponenten-Doku (Histoire), **dann** zeigt sie jede Komponente mit Props,
   Varianten, Do/Don't und in beiden Themes.

## US-14-02 · Dark Mode (alle) — FR-PLAT-001 · Must · Phase 0

1. **Gegeben** Systemeinstellung „dunkel" ohne Nutzerwahl, **wenn** ich die Plattform öffne,
   **dann** rendert sie dunkel ohne Flash of Wrong Theme (Inline-Head-Snippet).
2. **Gegeben** meine explizite Theme-Wahl, **dann** übersteuert sie das System dauerhaft
   (Cookie + Konto-Einstellung) und synchronisiert über Geräte nach Login.
3. **Gegeben** eine beliebige Komponente, **dann** existieren alle Zustände (hover, focus,
   disabled, error) in beiden Themes mit ausreichendem Kontrast (WCAG AA).

## US-14-03 · Responsive überall (alle) — FR-PLAT-002 · Must · Phase 0–1

1. **Gegeben** ein Viewport ab 360 px, **dann** sind Kernflows (lesen, suchen, schreiben,
   reviewen) ohne horizontales Scrollen bedienbar; Tabellen degradieren definiert
   (Stack/Scroll-Container).
2. **Gegeben** Touch-Bedienung, **dann** haben interaktive Ziele ≥ 44×44 px.

## US-14-04 · UI in meiner Sprache (alle) — FR-PLAT-003 · Must · Phase 1

1. **Gegeben** UI-Sprache `de` oder `en`, **dann** sind alle Oberflächentexte übersetzt
   (i18n-Keys, keine hartcodierten Strings — Lint prüft).
2. **Gegeben** eine fehlende Übersetzung, **dann** fällt sie im CI auf (Key-Vollständigkeits-Check),
   nicht beim Nutzer.

## US-14-05 · Article Viewer (P8 Gast) — Must · Phase 1

1. **Gegeben** ein publizierter Artikel, **dann** rendert der Article Viewer: Typografie-Skala,
   Codeblöcke mit Highlighting + Copy-Button, Admonitions, Inhaltsverzeichnis (ab 3
   Überschriften), Meta-Leiste (Autor, Version, Datum, Sprache, Outdated-Banner).
2. **Gegeben** Tastaturnavigation, **dann** sind TOC-Sprünge und Copy-Buttons erreichbar und
   screenreader-tauglich beschriftet.

## US-14-06 · Permission Editor (P6 Claire) — FR-AUTZ-009 · Should · Phase 2

1. **Gegeben** der Permission Editor, **dann** zeigt er Permissions gruppiert nach Modul mit
   Suchfeld, Beschreibungstexten und Änderungsvorschau („+2 Permissions, −1") vor dem Speichern.
2. **Gegeben** eine Systemrollen-Kern-Permission, **dann** ist sie sichtbar, aber gesperrt mit
   Erklärung (A-3).

## US-14-07 · KI baut regelkonform (Entwicklungsteam) — Agentic UI · Must · Phase 0

1. **Gegeben** eine KI-generierte UI-Erweiterung, **dann** nutzt sie bestehende Komponenten,
   erzeugt keine eigenen Styles, unterstützt Dark Mode, ist responsive und dokumentiert —
   Verstöße scheitern an denselben Lints wie menschlicher Code
   ([design-system/06](../../../design-system/06-agentic-ui-rules.md)).
2. **Gegeben** eine benötigte, aber fehlende Komponente, **dann** wird sie zuerst im Design
   System angelegt (Doku + Tests), bevor die Feature-UI sie verwendet.
