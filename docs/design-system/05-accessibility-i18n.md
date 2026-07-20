# Accessibility & UI-Internationalisierung

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20 ·
**Ziel:** WCAG 2.1 AA (NFR-030) · UI-Sprachen de/en (NFR-033)

## 1. Accessibility-Grundregeln

| Bereich | Vorgabe |
|---|---|
| **Kontrast** | Text ≥ 4.5:1, große Schrift/UI-Grafik ≥ 3:1 — in **beiden** Themes; Token-Werte mit dokumentiertem Nachweis; Branding-Akzentfarbe wird beim Setzen geprüft (Warnung) |
| **Tastatur** | Alles bedienbar ohne Maus; logische Tab-Reihenfolge; kein Tastatur-Trap; Skip-Link; Shortcuts dokumentiert und ohne Konflikt mit AT |
| **Fokus** | sichtbarer Fokusring (`border-focus`-Token, 2 px offset) — niemals `outline: none` ohne Ersatz |
| **Semantik** | native Elemente zuerst (`button`, `a`, `label`); Landmarks (`main`, `nav`, `header`); Überschriften-Hierarchie ohne Sprünge |
| **ARIA** | nur wo nötig, nach APG-Patterns: Modal (`dialog` + Fokusfalle + `aria-modal`), Tabs, Menü, Combobox, Toast (`aria-live="polite"`, Fehler `assertive`) |
| **Formulare** | jedes Feld mit `label`; Fehler via `aria-describedby` + `aria-invalid`; Gruppen mit `fieldset/legend` |
| **Nicht nur Farbe** | Status immer Farbe + Text/Icon (Badges tragen Text) |
| **Motion** | `prefers-reduced-motion` deaktiviert nicht-essentielle Animationen |
| **Touch** | interaktive Ziele ≥ 44×44 px (US-14-03) |
| **Medien** | Bild-Uploads im Editor fordern Alt-Text ein (leer erlaubt = dekorativ, bewusste Wahl) |

## 2. Komponenten-spezifische Pflichten (Auszug)

- `LirModal`: Fokus rein/zurück, Esc schließt, Hintergrund inert.
- `LirTable`: echte `<table>`-Semantik, `caption`/`aria-label`, Sortier-Buttons mit
  `aria-sort`.
- `LirCommandPalette`: Combobox-Pattern, Ergebnis-Ansage via Live-Region.
- `LirArticleViewer`: TOC als `nav` mit Label; Code-Copy-Buttons beschriftet; Admonitions mit
  Rolle `note`/Text-Präfix.
- `LirDiffViewer`: Änderungen zusätzlich textuell markiert (+/−-Präfixe), nicht nur farbig.

## 3. Test & Enforcement

- Komponenten-Tests: axe-Check je Story-Variante (CI-Gate, testing/03).
- E2E: axe auf Kernseiten in beiden Themes; vollständige Tastatur-Journeys für Login,
  Artikel erstellen, Review (testing/04).
- Manuelle Screenreader-Stichprobe (NVDA + VoiceOver) je Meilenstein auf den Kernflows.

## 4. UI-i18n (getrennt vom Content-Übersetzungssystem E-05)

- Alle UI-Strings über i18n-Keys (`@nuxtjs/i18n` im Frontend; DS-interne Texte über
  DS-Locale-Dateien, per Provider überschreibbar). Hartcodierte Strings → Lint-Fehler.
- Key-Konvention: `<bereich>.<komponente>.<zweck>` (`review.queue.emptyTitle`);
  Platzhalter ICU-Format (Plurale!).
- `de` und `en` sind zum Release vollständig; CI prüft Key-Parität (fehlende Übersetzung =
  Build-Warnung, Release-Gate M-Meilenstein).
- Texte dürfen wachsen: Layouts vertragen +40 % Textlänge (kein Abschneiden; Truncation nur
  mit Tooltip + bewusster Entscheidung).
- Datums-/Zahlenformate über `Intl` mit UI-Locale.

## 5. RTL-Vorbereitung (NFR-062)

Logische CSS-Properties verpflichtend (`ps-*/pe-*`, `text-start/end`, `border-s/e`) — keine
`left/right`-Utilities in neuen Komponenten (Lint-Warnung). Vollständiger RTL-Support
(inkl. `dir`-Umschaltung und Icon-Spiegelung) ist nach 1.0 geplant, scheitert dann aber nicht
an vermeidbaren Altlasten.
