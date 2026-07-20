# Agentic-UI-Regeln — Verbindlich für KI-generierte Oberflächen

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20 ·
**Quelle:** Fachkonzept §7 „Agentic UI Regeln" ·
**Kontext:** [development-guidelines/05](../development-guidelines/05-agentic-development.md)

KI-Agenten (und Menschen — die Regeln sind identisch, für Agenten aber explizit formuliert)
erzeugen UI ausschließlich innerhalb dieser Leitplanken. Verstöße scheitern an denselben
Lints/Checks wie menschlicher Code (US-14-07).

## Die sieben Regeln

### R1 · Bestehende Komponenten nutzen — MUSS

Vor jeder UI-Erzeugung den Katalog konsultieren ([03-component-library.md](03-component-library.md)
+ [components/](components/README.md) + Histoire). Existiert ein passender Baustein, wird er
verwendet — auch wenn Neugenerierung „schneller" wäre. Ein Button ist immer `LirButton`,
nie ein gestyltes `<button>`.

### R2 · Keine eigenen Styles erzeugen — MUSS

Keine neuen CSS-Dateien, keine `<style>`-Blöcke, keine Arbitrary Values
(`bg-[#…]`, `p-[13px]`), keine Inline-Styles für Gestaltung. Erlaubt sind ausschließlich
Token-basierte Utilities aus dem Preset und dokumentierte Komponenten-Props.
Braucht die Aufgabe einen neuen Gestaltungswert → zuerst Token-PR ([02 §4](02-design-tokens.md)).

### R3 · Neue Komponenten zuerst im Design System — MUSS

Fehlt ein wiederverwendbarer Baustein: **erst** in `packages/design-system` anlegen
(Props-API nach Konvention, Story, Test, Doku — Qualitätskriterien [03 §3](03-component-library.md)),
**dann** im Feature verwenden. Niemals „vorläufig" in `apps/frontend/components` bauen —
Vorläufig ist für immer.

### R4 · Dark Mode unterstützen — MUSS

Beide Themes von Anfang an: nur semantische Tokens verwenden (dann folgt Dark Mode
automatisch); jede neue Story wird in beiden Themes geprüft; niemals theme-spezifische
Sonderlocken außerhalb der Token-Definitionen.

### R5 · Responsive sein — MUSS

Mobile-first mit den definierten Breakpoints; Verhalten bei 360 px, 768 px und 1280 px
bedacht und in der Story gezeigt; Tabellen/breite Inhalte mit definierter
Degradation ([04 §2](04-layouts-and-patterns.md)); Touch-Ziele ≥ 44 px.

### R6 · Dokumentiert werden — MUSS

Jede neue/geänderte Komponente: Histoire-Story (Varianten × Themes), Props-/Slot-/Event-Doku,
Do/Don't-Hinweise; bei Fachkomponenten zusätzlich Eintrag im
[components/](components/README.md)-Themenordner. Undokumentiert = nicht fertig.

### R7 · Patterns und A11y einhalten — MUSS

Zustands-Patterns (laden/leer/Fehler), Formular-Patterns und Statusfarben aus
[04-layouts-and-patterns.md](04-layouts-and-patterns.md); Accessibility-Pflichten aus
[05-accessibility-i18n.md](05-accessibility-i18n.md) (axe-clean, Tastatur, i18n-Keys statt
Hartcode-Text).

## Arbeitsablauf für Agenten (verbindliche Reihenfolge)

1. **Lesen:** relevante User Story + dieses Dokument + Komponentenkatalog.
2. **Inventur:** benötigte Bausteine gegen Katalog abgleichen; Lücken benennen.
3. **Lücken schließen:** fehlende Komponenten/Tokens als Design-System-Beitrag (R3/R2).
4. **Komposition:** View aus `Lir*`-Komponenten + Patterns bauen; Stores/API gemäß
   [architecture/03](../architecture/03-frontend-architecture.md) (F-Regeln).
5. **Nachweis:** `pnpm verify` (Lint inkl. Token-/Import-Regeln, Typecheck, Tests, Stories
   bauen) — erst grün, dann fertig.

## Automatisierte Durchsetzung

| Regel | Mechanismus |
|---|---|
| R1/R3 | ESLint: rohe HTML-Interaktionselemente (`<button>`, `<input>`, `<select>`, `<dialog>`) in `apps/frontend` verboten (Allowlist: Design-System-Interna) |
| R2 | Tailwind-Preset ohne Rohpalette; Stylelint/ESLint gegen Arbitrary Values, `<style>`-Blöcke in Views, Inline-Styles |
| R4 | Token-Build erzwingt Theme-Paarigkeit; visuelle Story-Snapshots beider Themes |
| R5 | Story-Viewports Pflichtteil des Reviews; E2E-Smoke auf 360 px |
| R6 | CI-Check: Komponente ohne Story/Doku-Datei → Fehler |
| R7 | axe in Komponenten-/E2E-Tests; i18n-Hartcode-Lint |
