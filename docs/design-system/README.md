# Design System — Übersicht

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20 ·
**Epic:** [E-14](../requirements/epics/e-14-design-system-ui/README.md)

Die zentrale UI-Bibliothek der Plattform lebt in **`packages/design-system`** und ist die
**einzige** erlaubte Quelle für UI-Bausteine (FR-PLAT-007). Struktur gemäß Fachkonzept §7:

```
packages/design-system/
├── tokens/          -- Design Tokens (CSS Variables + Tailwind-Preset)
├── components/      -- Vue-3-Komponenten (Lir* Präfix)
├── layouts/         -- App-Shells und Seitengerüste
├── patterns/        -- zusammengesetzte Muster (Formulare, Zustände, Listen)
└── documentation/   -- Histoire-Stories + Nutzungsrichtlinien
```

## Dokumente

| Dokument | Inhalt |
|---|---|
| [01-design-principles.md](01-design-principles.md) | Gestaltungsprinzipien, Ton, Marken-Neutralität für Instanzen |
| [02-design-tokens.md](02-design-tokens.md) | Token-Architektur: Farben, Typografie, Spacing, Radius, Schatten, Motion; Theming/Dark Mode |
| [03-component-library.md](03-component-library.md) | Komponentenkatalog, Namens-/API-Konventionen, Qualitätskriterien |
| [04-layouts-and-patterns.md](04-layouts-and-patterns.md) | Shells, Navigation, Formular-/Zustands-/Listen-Patterns |
| [05-accessibility-i18n.md](05-accessibility-i18n.md) | WCAG-2.1-AA-Vorgaben, Tastatur/Fokus, i18n/RTL-Grundlagen |
| [06-agentic-ui-rules.md](06-agentic-ui-rules.md) | **Verbindliche Regeln für KI-generierte UI** |
| [components/](components/README.md) | **Themenordner: Einzelspezifikationen** der Kern- und Fachkomponenten |

## Grundgesetze

1. **Nur Tokens, keine Rohwerte** — Farben, Abstände, Radien, Schatten ausschließlich über
   Tokens/Tailwind-Preset; Lint erzwingt das (US-14-01).
2. **Dark Mode ist gleichberechtigt** — jede Komponente definiert beide Themes von Anfang an
   (NFR-032).
3. **Komponenten entstehen im Design System** — nie ad-hoc in `apps/frontend`; view-spezifische
   Komposition ist erlaubt, wiederverwendbare Bausteine nicht (F-4).
4. **Dokumentiert oder nicht existent** — jede Komponente hat Histoire-Story (alle Varianten,
   beide Themes) + Props-Doku + Do/Don't.
5. **Accessibility ist Abnahmekriterium** — axe-clean, tastaturbedienbar, sichtbarer Fokus
   (NFR-030).
