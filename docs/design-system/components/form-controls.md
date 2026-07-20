# Formular-Komponenten

**Phase:** 0–1 · **Kategorie:** Formulare ·
**Pattern-Kontext:** [../04-layouts-and-patterns.md §3](../04-layouts-and-patterns.md)

## LirFormField — der Rahmen für alles

```ts
interface LirFormFieldProps {
  label: string
  hint?: string            // Hilfetext unter dem Label
  error?: string           // Fehlertext (ersetzt hint), setzt aria-invalid im Kind
  required?: boolean       // Markierung + aria-required
  labelFor?: string        // id-Verdrahtung (auto-generiert, wenn leer)
}
// Slot: default (genau ein Control) — verdrahtet id/aria-describedby automatisch (provide/inject)
```

Jedes Formularfeld der Plattform steckt in einem `LirFormField` — nackte Controls in Views
sind ein Review-Fehler.

## Controls (gemeinsame Basis)

Gemeinsame Props: `modelValue` (v-model), `disabled`, `readonly`, `size?: 'sm'|'md'`,
`invalid` (von FormField injiziert). Alle Controls: voller Tastatur-Support, Fokusring,
beide Themes, Touch-Ziele.

| Komponente | Besonderheiten |
|---|---|
| `LirInput` | `type: text/email/password/url/number`; Passwort mit Show-Toggle (beschriftet); optional `prefix`/`suffix`-Slots (Einheiten, Icons); `maxlength` mit Zähler ab 80 % |
| `LirTextarea` | Auto-Resize bis `maxRows`; Zeichenzähler-Option |
| `LirSelect` | natives `<select>`-Verhalten (Mobile!), Custom-Optik; Optionen als `{ value, label, disabled? }` |
| `LirCombobox` | Suche + Auswahl (APG-Combobox-Pattern); async Optionen (Lade-/Leerzustand eingebaut); Mehrfachauswahl-Variante mit Chips |
| `LirCheckbox` | Einzeln oder Gruppe; `indeterminate`-Support (Tabellen-Auswahl) |
| `LirRadioGroup` | `fieldset/legend`-Semantik; Optionen mit optionaler Beschreibung |
| `LirSwitch` | sofort wirkende Ein/Aus-Einstellungen (nicht in Submit-Formularen mischen); `aria-checked`, Label pflicht |
| `LirTagInput` | Chips mit Entfernen, Vorschläge via Combobox; genutzt für Tags/Skills (Limits als Props) |

## Validierungs-Verhalten (verbindlich)

- Anzeige: on-blur für Feldfehler, on-submit vollständig; Fehler verschwinden bei Korrektur.
- Serverfehler (422, Problem-Details `errors[].path`) werden per Pfad auf Felder gemappt
  (Formular-Composable `useFormErrors` im Frontend).
- Fehlertexte kommen aus i18n über `code`-Mapping — Controls zeigen an, übersetzen nicht.

## Don't

❌ Platzhalter als Label-Ersatz · ❌ disabled Submit als einzige Validierungsanzeige ·
❌ Switch für Aktionen mit Submit-Charakter · ❌ eigene Fehlertext-Positionen.
