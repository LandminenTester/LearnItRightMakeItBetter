# LirTable / LirPagination

**Phase:** 1 · **Kategorie:** Daten ·
**Pattern-Kontext:** Listen-Seiten ([../04-layouts-and-patterns.md §2](../04-layouts-and-patterns.md))

## LirTable

```ts
interface LirTableColumn<T> {
  key: string
  label: string
  sortable?: boolean            // löst emit('sort', { key, dir }) aus — Sortierung ist Server-Sache
  align?: 'start' | 'end'
  width?: 'min' | 'auto' | string   // Token-basierte Breiten
  cell?: Component | Slot           // Custom-Zelle (z. B. LirUserRef, LirBadge)
}
interface LirTableProps<T> {
  columns: LirTableColumn<T>[]
  rows: T[]
  rowKey: keyof T
  loading?: boolean             // Skeleton-Zeilen in Spaltenform
  selectable?: boolean          // Checkbox-Spalte, v-model:selection, Header indeterminate
  rowHref?: (row: T) => string  // ganze Zeile als Link (echte <a>-Semantik in erster Zelle)
  stickyHeader?: boolean
  density?: 'comfortable' | 'compact'   // Admin default compact
}
// Slots: empty (LirEmptyState einsetzen) · Emits: sort, update:selection, row-action
```

### Verhalten

- Echte `<table>`-Semantik; `caption` bzw. `aria-label` Pflicht-Prop; Sortier-Header als
  Buttons mit `aria-sort`.
- **Responsive Degradation** (verbindlich wählbar pro Einsatz): `scroll` (Container mit
  Schatten-Indikatoren) oder `stack` (Zeilen werden Karten mit Label-Wert-Paaren, Spalten mit
  `stackPriority` steuern Reihenfolge/Sichtbarkeit).
- Zeilenaktionen: rechts als `LirIconButton`-Gruppe oder Overflow-Menü (`LirPopover`);
  Bulk-Aktionsleiste erscheint bei Auswahl (Anzahl + Aktionen + Aufheben).
- `loading` ersetzt nie die Struktur (Spaltenköpfe bleiben — kein Layout-Sprung).

## LirPagination (Cursor)

```ts
interface LirPaginationProps {
  pageInfo: { nextCursor?: string; hasMore: boolean }
  loading?: boolean
  mode?: 'button' | 'auto'   // „Mehr laden"-Button (default) oder Infinite-Scroll (nur Feeds)
}
```

Cursor-basiert gemäß [api/01 §4](../../api/01-api-conventions.md) — keine Seitenzahlen
(bewusst: keine OFFSET-Queries, K-DB-15). Admin-Tabellen nutzen `button`-Modus;
Zähler „X angezeigt" statt „Seite 3 von 7".

## Do / Don't

✅ Status als `LirBadge`-Zelle, Personen als `LirUserRef`-Zelle ·
✅ Leerzustand mit nächster Aktion ·
❌ Client-seitiges Sortieren/Filtern geladener Teilmengen (führt Nutzer in die Irre) ·
❌ Tabellen für Key-Value-Details (dafür `LirDescriptionList`).
