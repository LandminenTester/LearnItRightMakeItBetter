# LirDiffViewer

**Phase:** 1 · **Kategorie:** Fachkomponenten · **Stories:** US-04-02 (Review), US-05-03 (Quell-Diff) ·
**FR:** FR-KNOW-009

## Zweck

Zeilenbasierter **Markdown-Quelltext-Diff** zwischen zwei Versionen — für Artikel-Reviews,
Versionshistorie, Änderungsvorschläge und den Übersetzungs-Quell-Diff („was änderte sich im
Original zwischen meiner übersetzten und der aktuellen Version?").

## API

```ts
interface LirDiffViewerProps {
  before: { content: string; label: string }   // z. B. "Version 3 · 12.07.2026"
  after: { content: string; label: string }
  layout?: 'unified' | 'split'    // default: unified < lg, split ≥ lg; Nutzer-Toggle persistiert
  wordLevel?: boolean             // Intra-Zeilen-Hervorhebung (default true)
  collapseUnchanged?: boolean     // default true: unveränderte Blöcke > 8 Zeilen einklappen („… 42 unveränderte Zeilen anzeigen")
}
```

Diff-Berechnung client-seitig (bewährte Diff-Lib, Myers-Algorithmus) auf dem
Markdown-**Quelltext** — nicht auf gerendertem HTML (stabil, erklärbar, entspricht dem, was
Autoren geschrieben haben).

## Darstellung

- Farbcodierung über semantische Tokens (`success-subtle`/`danger-subtle`-Flächen) **plus**
  textuelle Marker `+`/`−` in eigener Spalte (nicht nur Farbe — A11y, [../05 §2](../05-accessibility-i18n.md)).
- Zeilennummern beider Seiten; Word-Level-Hervorhebung als stärkere Fläche innerhalb der
  Zeile.
- Metadaten-Kopf: beide Labels + Autor/Änderungsnotiz der `after`-Version; bei Reviews
  direkt daneben die Aktionen (Review-Panel-Slot).
- Große Diffs: virtuelles Scrolling ab 2.000 Zeilen; Performance-Ziel: 10.000-Zeilen-Diff
  < 1 s Erstdarstellung.

## Einsatzkontexte

| Kontext | Besonderheit |
|---|---|
| Review (`/articles/:id/versions/:a/diff/:b`) | Erstversion = alles „neu"; Review-Aktionen angedockt |
| Historie | Versions-Picker (zwei `LirSelect`) über dem Diff |
| Änderungsvorschlag (K-11) | `before` = publizierte Version, Konfliktwarnung wenn Basis veraltet (K-7) |
| Übersetzungs-Quell-Diff (T-Story) | `before` = übersetzte Originalversion, `after` = aktuelle — Sprache des Originals |

## A11y

Umschalt-Toggle (unified/split) als beschriftete Buttons; eingeklappte Bereiche als
`button` mit Zeilenangabe; Navigations-Shortcuts „nächste/vorherige Änderung" (n/p) mit
sichtbarem Fokus-Sprung; Screenreader: Zeilen als „hinzugefügt/entfernt" angesagt
(`aria-label` je Zeilenpräfix).
