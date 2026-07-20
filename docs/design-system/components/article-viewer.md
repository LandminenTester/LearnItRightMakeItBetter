# LirArticleViewer

**Phase:** 1 · **Kategorie:** Fachkomponenten · **Epic:** E-04/E-14 (US-14-05) ·
**Render-Pipeline:** [ADR-0012](../../architecture/decisions/adr-0012-markdown-content-format.md)

## Zweck

Die Lese-Darstellung von Artikeln und Übersetzungen — wichtigste Oberfläche der Plattform.
Rendert das **serverseitig sanitisierte HTML** der Pipeline (nie rohes Nutzer-HTML) mit
Lese-Typografie, Code-Features und Navigationshilfen.

## API

```ts
interface LirArticleViewerProps {
  html: string                   // sanitisierte Pipeline-Ausgabe (contentHtmlCached)
  toc?: TocEntry[]               // { id, text, level }[] — von der Pipeline geliefert
  showToc?: boolean              // default: auto (ab 3 Überschriften, sticky ab lg)
  locale: string                 // für hyphens/quotes-Typografie
}
// Slots: before-content (Banner-Zone), after-content (Feedback/Kommentare)
```

Die einzige Komponente mit erlaubtem `v-html` (Lint-Ausnahme, security/05 §2) — Vertrag:
Input stammt ausschließlich aus der Pipeline.

## Darstellungs-Anforderungen

| Element | Anforderung |
|---|---|
| Fließtext | `measure-article` (72ch), `leading-relaxed`, Absatzabstände aus Skala |
| Überschriften | Anker-Links (Hover-Icon, kopierbar), `scroll-margin` für Sticky-Header |
| Codeblöcke | Shiki-Highlighting über Syntax-Tokens (beide Themes), Sprach-Label, **Copy-Button** (beschriftet, Erfolgs-Feedback), horizontales Scrollen statt Umbruch, optional Zeilennummern ab 5 Zeilen |
| Inline-Code | `code-bg`/`code-text`-Tokens |
| Admonitions | Typen note/tip/warning/danger über `LirAlert`-Optik, Rolle `note`, Icon + Textpräfix |
| Tabellen | im Scroll-Container (Table-Degradation), Zebra optional |
| Bilder | aus Media-`srcset` (K-15), Lazy-Loading, Klick → Lightbox (Vergrößerung), Alt-Text-Pflicht aus Editor |
| Links | intern normal, extern mit Icon + `rel`-Sicherheitsattributen |
| TOC | `nav[aria-label]`, aktive Sektion via Scroll-Spy markiert, mobil als einklappbarer Block über dem Inhalt |

## Kontext-Integration (durch die Seite, nicht die Komponente)

Meta-Leiste, Statusbanner (Outdated/Archiviert), Sprachumschalter, Feedback- und
Kommentarbereich liegen im Seiten-Pattern ([../04 §2](../04-layouts-and-patterns.md)) —
der Viewer bleibt reine Inhaltsdarstellung (auch nutzbar in Editor-Preview und Diff-Kontext).

## A11y & Performance

Überschriften-Hierarchie bleibt erhalten (Pipeline erzwingt h2-Start im Inhalt);
Copy-Buttons und Lightbox tastaturbedienbar; `print`-Styles (Artikel drucken sauber).
Ziel: kein Layout-Shift durch Bilder (Dimensionen aus Media-Varianten), LCP-freundlich
(NFR-005).
