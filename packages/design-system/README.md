# @lir/design-system

Zentrale UI-Bibliothek der Plattform — **einzige** erlaubte Quelle für UI-Bausteine
(FR-PLAT-007). Spezifikation: [docs/design-system/](../../docs/design-system/README.md),
verbindliche Regeln für alle (auch KI-generierten) Beiträge:
[Agentic-UI-Regeln](../../docs/design-system/06-agentic-ui-rules.md).

## Struktur

```
src/
├── tokens/        tokens.css (CSS-Variablen beider Themes) · theme.css (Tailwind-4-Mapping)
├── components/    Lir*-Komponenten (Referenz: LirButton)
├── layouts/       App-Shells (folgen mit E-14)
├── patterns/      zusammengesetzte Muster (folgen mit E-14)
└── documentation/ Histoire-Stories (Setup folgt in Phase 0 — TODO, siehe unten)
```

## Nutzung (Frontend)

```ts
import { LirButton } from '@lir/design-system';
```

```css
/* main.css der App */
@import 'tailwindcss';
@import '@lir/design-system/tokens.css';
@import '@lir/design-system/theme.css';
```

## Offene Phase-0-Punkte

- **Histoire** (`pnpm story`) einrichten: Stories je Komponente in beiden Themes —
  Pflicht laut [Komponenten-DoD](../../docs/design-system/03-component-library.md).
- Token-Lint (Verbot von Arbitrary Values) als ESLint-/Stylelint-Regel scharf schalten.
- Kernkomponenten gemäß [Katalog](../../docs/design-system/components/README.md) ausbauen.
