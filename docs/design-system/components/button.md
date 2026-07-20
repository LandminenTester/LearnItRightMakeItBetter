# LirButton / LirIconButton

**Phase:** 0 · **Kategorie:** Aktionen

## Zweck

Einheitliche Auslösung von Aktionen — die meistgenutzte Komponente; setzt den Standard für
Varianten-API und Zustandsverhalten aller interaktiven Bausteine.

## API

```ts
interface LirButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'   // default 'secondary'
  size?: 'sm' | 'md' | 'lg'                                 // default 'md'
  type?: 'button' | 'submit'                                // default 'button' (!)
  disabled?: boolean
  loading?: boolean          // zeigt Spinner, sperrt Klicks, behält Breite
  block?: boolean            // volle Breite
  iconLeft?: Component; iconRight?: Component
}
// Slots: default (Label) · Emits: click (unterdrückt bei disabled/loading)
```

`LirIconButton`: nur Icon, `label`-Prop **pflicht** (wird `aria-label`), Form quadratisch,
optional `variant`/`size` wie oben.

## Verhalten & Zustände

- Zustände: default, hover (`state-hover`), active, focus (sichtbarer Ring `border-focus`),
  disabled (`state-disabled-*`, `aria-disabled`), loading (Spinner ersetzt `iconLeft`,
  Label bleibt — keine Breitensprünge).
- `loading` verhindert Doppel-Submit (Formular-Pattern); `type` default `button` verhindert
  versehentliche Submits.
- `danger` ist destruktiven Aktionen vorbehalten und kombiniert sich mit
  `LirConfirmDialog`-Pattern.

## Semantik-Regeln

- Navigation ist ein Link (`NuxtLink`/`LirButton as="a"` mit `href`) — nie Button mit
  Router-Push für echte Ziele (Middle-Click!).
- Genau **ein** `primary` je Ansicht/Abschnitt (visuelle Hierarchie).

## A11y

Natives `<button>`; Fokusring; Touch ≥ 44 px (`sm` erfüllt das über Padding);
`loading` mit `aria-busy`.

## Do / Don't

✅ „Version publizieren" (Wirkung benennen) · ✅ IconButton immer mit `label` ·
❌ Ghost-Button für die Hauptaktion · ❌ eigene Buttons aus `<div onclick>` (Lint-Fehler).
