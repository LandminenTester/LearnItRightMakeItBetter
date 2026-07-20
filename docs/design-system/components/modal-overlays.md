# Overlay-Komponenten

**Phase:** 0–1 · **Kategorie:** Overlays · **Z-Index-Tokens:** `z-overlay/modal/popover/toast`

## LirModal

```ts
interface LirModalProps {
  open: boolean                 // v-model:open
  title: string                 // Pflicht — wird aria-labelledby
  size?: 'sm' | 'md' | 'lg' | 'full'   // default 'md'
  closeOnBackdrop?: boolean     // default true; false bei Formularen mit Eingaben
  preventClose?: boolean        // sperrt Schließen (z. B. laufender Vorgang)
}
// Slots: default (Inhalt) · footer (Aktionen, rechtsbündig, primäre rechts)
// Emits: update:open, close
```

- APG-Dialog: Fokus beim Öffnen auf ersten sinnvollen Punkt, Fokusfalle, Esc schließt
  (außer `preventClose`), Fokus-Rückgabe an Auslöser, Hintergrund `inert` + Scroll-Lock.
- Unter `sm`-Breakpoint: Vollbild-Darstellung (Mobile).
- Verschachtelte Modals verboten — Flüsse als Schritte im selben Modal oder Drawer.

## LirConfirmDialog

Spezialisierung für destruktive/kritische Aktionen:
`{ title, description, confirmLabel, confirmVariant: 'danger'|'primary', requireText? }` —
`requireText` erzwingt Tipp-Bestätigung (Org-Löschung O-6). Promise-basierte Nutzung über
`useConfirm()`-Composable; Fokus initial auf **Abbrechen**.

## LirDrawer

Seitliches Panel (rechts, `md`+; mobil Vollbild) für Kontextaufgaben ohne Seitenwechsel
(Filterdetails, Schnellansichten, Notification-Liste). Gleiche A11y-Mechanik wie Modal.
Nicht für primäre Editier-Flüsse (die bekommen Seiten).

## LirPopover

Ankerbasiertes Overlay (Floating-Positionierung, Kollisions-Flip) für Menüs, Filter,
Datepicker-Fläche. Trigger-Semantik: `aria-expanded`/`aria-controls`; Klick außerhalb + Esc
schließen; Pfeiltasten-Navigation, wenn Menü-Rolle.

## LirTooltip

Nur **ergänzende** Information (nie einziger Ort einer Information — A11y). Auslösung Hover +
Fokus, Verzögerung 300 ms, `role="tooltip"`; auf Touch: Weglassen oder Alternativdarstellung.
Kein interaktiver Inhalt im Tooltip (dafür Popover).

## Do / Don't

✅ Modal-Titel beschreibt die Entscheidung („Artikel archivieren?") ·
✅ ConfirmDialog nennt Konsequenzen konkret ·
❌ Tooltip für Pflichtinformationen/Fehler · ❌ Modal für mehrstufige Editor-Flüsse ·
❌ Drawer und Modal gleichzeitig.
