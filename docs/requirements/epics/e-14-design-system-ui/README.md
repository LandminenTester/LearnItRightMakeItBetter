# E-14 · Design System & UI Foundation

**Status:** Verbindlich · **Phase:** 0–1 · **Priorität:** Must ·
**Bereich:** [`packages/design-system`](../../../design-system/README.md), Frontend ·
**FRs:** FR-PLAT-001…003, FR-PLAT-007, FR-AUTZ-009 · **Stories:** [user-stories.md](user-stories.md)

## Ziel

**Alle UIs verwenden ausschließlich das zentrale Design System** (Fachkonzept §7): Tokens,
Komponenten, Layouts, Patterns und Dokumentation in einer eigenen Bibliothek — mit Dark Mode
als Gleichberechtigtem, voller Responsivität, Accessibility (WCAG 2.1 AA) und verbindlichen
Regeln für KI-generierte UI-Erweiterungen (Agentic UI).

## Scope

**Enthalten:**

- Struktur `design-system/`: `tokens` · `components` · `layouts` · `patterns` · `documentation`
- Design Tokens als CSS Variables + Tailwind-4-Mapping ([design-system/02](../../../design-system/02-design-tokens.md))
- Kernkomponenten (Phase 0/1): Button, Input/Form-Controls, Modal, Table, Toast, Tabs, Badge,
  Card, Navigation, Skeleton — Katalog: [design-system/components/](../../../design-system/components/README.md)
- Fachkomponenten: Article Viewer, Markdown-Editor, Diff-Viewer, Permission Editor, Admin-Panels
- Layout-System (App-Shell, öffentliche Shell, Admin-Shell) + Patterns (Formulare, leere
  Zustände, Fehlerseiten)
- Dark/Light-Theming ohne FOUC; UI-i18n-Grundlagen (de/en)
- Komponenten-Dokumentation mit Live-Beispielen (Histoire) als Teil des Pakets
- Agentic-UI-Regeln als lintbare Verbote ([design-system/06](../../../design-system/06-agentic-ui-rules.md))

**Nicht enthalten:** Marketing-Website-Design, native App-Design, per-Instanz-Themes über
Branding-Variablen hinaus (nach 1.0).

## Abhängigkeiten

Blockiert alle UI-tragenden Epics (Roadmap-Regel 4) — Kernkomponenten entstehen in Phase 0.

## Erfolgsmetriken

- 0 Token-Lint-Verstöße (Rohwerte) in `apps/frontend` und `packages/design-system`
- axe: 0 kritische Verstöße in Komponenten-Tests und E2E-Kernflows (NFR-030)
- Jede Komponente: dokumentiert (Props, Beispiele, Do/Don't) + getestet, beide Themes

## Risiken & Gegenmaßnahmen

| Risiko | Gegenmaßnahme |
|---|---|
| „Schnell mal eigene Komponente" erodiert das System | Lint-Regeln (Importpfade, Token-Pflicht), PR-Review-Checkliste, Agentic-Regeln |
| Dark Mode verkümmert | Tokens erzwingen Paarigkeit; visuelle Tests beider Themes |
| Fachkomponenten (Editor/Diff) unterschätzt | eigene Stories + früher Spike in Phase 1 |
