# Feedback- & Status-Komponenten

**Phase:** 0–1 · **Kategorie:** Feedback ·
**Zustands-Patterns:** [../04-layouts-and-patterns.md §4](../04-layouts-and-patterns.md)

## LirToast (+ `useToast()`)

- API: `useToast().show({ variant: 'success'|'error'|'info'|'warning', title, description?,
  action?: { label, onClick } })`.
- Verhalten: Stapel unten rechts (mobil unten volle Breite), auto-dismiss 5 s —
  **Fehler bleiben stehen** bis zur Interaktion; max. 3 sichtbar (Queue); Hover pausiert Timer.
- A11y: Live-Region (`polite`, Fehler `assertive`); Aktionen tastaturerreichbar; kein
  kritischer Inhalt ausschließlich im Toast (verschwindet!).
- Einsatz: Bestätigung von Aktionen („Version publiziert"), asynchrone Ergebnisse. Nicht für
  Formular-Validierung (die gehört an die Felder).

## LirAlert

Eingebetteter Hinweis im Inhalt: `variant: info|success|warning|danger`, `title`,
Default-Slot, optional `dismissible` (persistiert Schließung via `storageKey`) und
Aktions-Slot. Nutzt semantische Farb-Token-Paare (`-subtle`-Fläche, `-text`, `-border`);
Icon je Variante fest. Einsatz: Statusbanner (Outdated T-4, Archiviert), degradierte Dienste
(Suche offline), Formular-Globalfehler.

## LirBadge

Kompakte Status-/Kategorie-Kennzeichnung: `variant: neutral|info|success|warning|danger|accent`,
`size: sm|md`. **Verbindliche Zuordnung** der Lifecycle-Status (plattformweit identisch,
Pattern §5): draft→neutral · in_review→info · published→success · outdated→warning ·
archived→neutral-muted · broken/failed→danger. Badges tragen immer Text (nie nur Farbe/Punkt).
Artikeltypen als `accent`-Badges mit Typlabel.

## LirEmptyState

`{ icon?, title, description?, action?: slot }` — zentriert in der Fläche der ausgebliebenen
Daten. Pflicht in jeder Liste/Tabelle/Queue (statt „nichts"). Textmuster: Was ist leer →
warum ggf. → nächster Schritt als Aktion („Ersten Artikel erstellen", „Beobachtung
hinzufügen"). Bei gefilterten Null-Ergebnissen: „Filter zurücksetzen"-Aktion.

## LirSkeleton

Bausteine `text` (Zeilen mit Breitenvariation), `block` (Fläche), `circle` (Avatare) +
vorgefertigte Formen `article`, `table-rows`, `card-list`. Dezente Puls-Animation
(`prefers-reduced-motion`: statisch); `aria-hidden` + Umgebungs-`aria-busy`. Regel: Skeleton
spiegelt das Ziel-Layout (kein generischer Balkenstapel) und erscheint nur bei erwartbarer
Wartezeit > 200 ms (Flacker-Schwelle).

## Do / Don't

✅ Ein Fehler-Toast bei fehlgeschlagener Hintergrund-Aktion mit Retry-Action ·
✅ Alert-Banner für Outdated-Übersetzung mit Link zum Original ·
❌ Toast-Kaskaden (mehrere je Aktion) · ❌ Badge-Farben ad hoc umdeuten ·
❌ Spinner-Vollbild, wo Skeleton das Layout halten könnte.
