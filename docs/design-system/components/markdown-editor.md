# LirMarkdownEditor

**Phase:** 1 · **Kategorie:** Fachkomponenten · **Stories:** US-04-01, US-05-01

## Zweck

Markdown-Erstellung für Artikel, Übersetzungen, Kommentare (reduzierte Variante) und
Beschreibungen — Editor mit Live-Preview über **dieselbe Render-Pipeline** wie die Anzeige
(serverseitiger Preview-Endpunkt `POST /markdown/preview`, debounced; identisches Ergebnis
garantiert, ADR-0012).

## API

```ts
interface LirMarkdownEditorProps {
  modelValue: string
  mode?: 'full' | 'compact'      // compact: Kommentare/Bio (ohne Bilder-Upload, kleinere Toolbar)
  previewLayout?: 'side' | 'tab' // side ab lg, sonst Tab-Umschaltung
  maxLength?: number             // mit Zähler (K-17-Limits)
  uploadContext?: MediaUploadContext   // aktiviert Bild-Upload (draft-Usage MD-4)
  placeholder?: string
}
// Emits: update:modelValue, upload (delegiert an Media-API), save-intent (Cmd/Ctrl+S)
```

## Funktionsumfang `full`

- **Toolbar** (alles auch als Shortcut): Bold/Italic/Code, Überschrift-Menü, Link, Liste/
  Checkliste, Zitat, Codeblock (mit Sprachwahl-Combobox), Tabelle einfügen, Admonition-Menü,
  Bild-Upload, interner Link (`[[…]]`-Picker mit Artikel-Suche).
- **Editor-Fläche:** Monospace-Option, Zeilenumbruch weich, Syntax-Einfärbung des Markdown
  (leichtgewichtig), Drag&Drop + Paste von Bildern (→ Media-Pipeline, Platzhalter bis
  `ready`, US-10-01), Auto-Fortführung von Listen.
- **Preview:** rendert via Pipeline-Endpunkt (debounce 500 ms), zeigt Warnungen der Pipeline
  (tote interne Links K-16) als Marker-Liste.
- **Sicherheit vor Datenverlust:** lokaler Draft-Puffer (IndexedDB) je Kontext, Restore-Angebot
  nach Absturz; `beforeunload`-Schutz bei ungespeicherten Änderungen; Autosave-Hook für
  Artikel-Entwürfe (Speichern erzeugt bewusst **keine** neue Version — erst „Speichern" K-5).

## Nicht-Ziele (1.0)

Kein WYSIWYG/Block-Editor (bewusst, ADR-0012 — Upgrade-Pfad offen), keine
Echtzeit-Kollaboration, kein Grammatik-/KI-Assistent.

## A11y

Toolbar als `toolbar`-Pattern (Pfeiltasten-Navigation, Shortcuts in Tooltips + Doku);
Editor-Textarea mit Label; Preview-Tab-Wechsel kündigt sich an; Upload-Status per Live-Region;
alles ohne Maus bedienbar.

## Abnahme-Kriterien

1. Preview = publizierte Darstellung (Pixel-identische Pipeline-Ausgabe)
2. 10.000-Zeilen-Dokument bleibt tippbar (< 16 ms Input-Latenz, virtuelle Preview-Sektionen)
3. Bild-Einfügen erzeugt `media:`-Referenz + Alt-Text-Abfrage
4. Absturz-Restore-Test grün
