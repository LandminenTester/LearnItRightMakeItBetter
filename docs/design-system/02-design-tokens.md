# Design Tokens

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20

## 1. Architektur — drei Ebenen

```
Primitive Tokens  (Rohpalette: --lir-gray-50…950, --lir-blue-500, Skalen)
      ↓ referenziert
Semantische Tokens (Bedeutung: --lir-color-bg-surface, --lir-color-text-primary, …)
      ↓ konsumiert
Komponenten & Tailwind-Utilities (bg-surface, text-primary, …)
```

- **Komponenten und Feature-Code verwenden ausschließlich semantische Tokens** (via
  Tailwind-Preset). Primitive Tokens sind Implementierungsdetail der Themes.
- Auslieferung: `tokens/` als CSS-Dateien (`:root` + `[data-theme="dark"]`) und
  Tailwind-4-`@theme`-Preset — eine Quelle, generiert aus `tokens/src/*.json`
  (Style-Dictionary-artiger Build im Paket).

## 2. Theming & Dark Mode

- Theme-Umschaltung über `data-theme="light|dark"` auf `<html>`; Default folgt
  `prefers-color-scheme`; Nutzerwahl persistiert (Cookie + Konto) — FOUC-Schutz per
  Inline-Head-Snippet (US-14-02).
- **Jedes semantische Token existiert in beiden Themes** — der Token-Build schlägt fehl, wenn
  ein Theme einen Wert nicht definiert (erzwungene Paarigkeit, NFR-032).
- Instanz-Branding: genau die Slots `--lir-color-accent` (+ `-hover`, `-subtle`, `-on-accent`)
  sind zur Laufzeit per Instanzkonfiguration überschreibbar (C-8); Kontrastprüfung im
  Admin-UI beim Setzen (WCAG-Warnung).

## 3. Token-Katalog (semantische Ebene, Auszug mit Pflichtumfang)

### Farbe

| Gruppe | Tokens |
|---|---|
| Hintergrund | `bg-page`, `bg-surface`, `bg-surface-raised`, `bg-subtle`, `bg-inverse` |
| Text | `text-primary`, `text-secondary`, `text-muted`, `text-inverse`, `text-on-accent` |
| Rahmen | `border-default`, `border-strong`, `border-focus` |
| Akzent | `accent`, `accent-hover`, `accent-subtle`, `on-accent` (Branding-Slots) |
| Semantik | je `success|warning|danger|info`: `-base`, `-subtle` (Fläche), `-text`, `-border` |
| Interaktion | `state-hover`, `state-active`, `state-selected`, `state-disabled-bg`, `state-disabled-text` |
| Code | `code-bg`, `code-text` + Syntax-Slots (`syntax-keyword`, `-string`, `-comment`, `-function`, `-number`) für Shiki-Theme-Mapping |

### Typografie

| Token | Wert (Basis) |
|---|---|
| `font-sans` / `font-mono` | Inter-kompatibel / JetBrains-Mono-kompatibel, self-hosted |
| Größen `text-xs…text-4xl` | 12 · 14 · 16 · 18 · 20 · 24 · 30 · 36 px (rem-basiert) |
| Zeilenhöhen | `leading-tight 1.25`, `leading-normal 1.5`, `leading-relaxed 1.7` (Artikel) |
| Gewichte | 400 / 500 / 600 / 700 |
| Lesebreite | `measure-article: 72ch` |

### Raum, Form, Tiefe, Bewegung

| Gruppe | Skala |
|---|---|
| Spacing (8-px-Raster) | `space-0…space-24`: 0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 96 px |
| Radius | `radius-sm 4`, `radius-md 6`, `radius-lg 10`, `radius-full` |
| Schatten | `shadow-raised`, `shadow-overlay`, `shadow-popover` (theme-spezifisch abgestimmt) |
| Z-Index | `z-nav 100`, `z-overlay 200`, `z-modal 300`, `z-popover 400`, `z-toast 500` |
| Motion | `duration-fast 100ms`, `duration-base 150ms`, `duration-slow 200ms`; `ease-standard` |
| Breakpoints | `sm 640`, `md 768`, `lg 1024`, `xl 1280` (Mobile-first, NFR-031) |

Konkrete Farbwerte der Neutral-/Akzentpalette definiert das Token-Paket in Phase 0
(mit dokumentierten Kontrastnachweisen ≥ 4.5:1 für Text, ≥ 3:1 für UI-Elemente in beiden
Themes) — dieser Katalog fixiert Struktur und Pflichtumfang.

## 4. Nutzung & Enforcement

- Tailwind-Klassen aus dem Preset (`bg-surface`, `text-muted`, `p-4` = `space-4`, …);
  Arbitrary Values (`bg-[#123456]`, `p-[13px]`) sind **verboten** — ESLint/Stylelint-Regel +
  Tailwind-Preset ohne Rohfarben (US-14-01).
- `style`-Attribute nur für echt dynamische Werte (z. B. berechnete Positionen), nie für
  Design-Entscheidungen.
- Neue Tokens: PR ans Design System mit Begründung, beiden Theme-Werten, Doku-Update —
  Feature-PRs erfinden keine Tokens nebenbei ([06-agentic-ui-rules.md](06-agentic-ui-rules.md)).
