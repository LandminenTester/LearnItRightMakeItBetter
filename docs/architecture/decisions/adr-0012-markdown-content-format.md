# ADR-0012: Markdown als kanonisches Inhaltsformat

**Status:** Akzeptiert · **Datum:** 2026-07-20

## Kontext

Artikel müssen versionierbar (FR-KNOW-003), diffbar (FR-KNOW-009), übersetzbar (E-05) und von
Entwicklern effizient schreibbar sein. Zielgruppe sind Entwickler (Markdown-Vertrautheit).
Sicherheit: gespeicherte Inhalte werden an viele Leser ausgeliefert — XSS über Inhalte ist das
größte Anwendungsrisiko (→ [security/05](../../security/05-application-security.md)).

## Entscheidung

**Markdown ist das einzige kanonische Speicherformat** für Artikelinhalte:
CommonMark + GitHub Flavored Markdown (Tabellen, Task-Lists, Strikethrough, Autolinks) +
**Admonitions** (`> [!NOTE]`-Syntax) + Code-Fences mit Sprachangabe (Shiki-Highlighting).
Rendering erfolgt **serverseitig** in einer einzigen Pipeline
(remark/rehype + strikte Sanitisierung per Allowlist); das gerenderte HTML wird pro Version
gecacht. Editor (MVP): Markdown-Editor mit Live-Preview, die **dieselbe** Render-Pipeline nutzt
(US-04-01). Rohes HTML in Markdown wird **nicht** gerendert (escaped).

## Betrachtete Alternativen

- **WYSIWYG mit HTML-Speicherung** — abgelehnt: schlecht diffbar, Sanitisierung fehleranfällig,
  schlechter für Code-lastige Inhalte. Ein Block-Editor **auf Markdown-Basis** (Milkdown/TipTap)
  bleibt als spätere UX-Verbesserung möglich, ohne das Speicherformat zu ändern.
- **MDX (Markdown + Komponenten)** — abgelehnt: Code-Ausführung im Content ist ein
  Sicherheits-Albtraum für nutzergenerierte Inhalte; benötigte Bausteine (Admonitions, Tabs)
  werden als geprüfte Direktiven ergänzt, nicht als frei programmierbare Komponenten.
- **AsciiDoc/reStructuredText** — abgelehnt: geringere Zielgruppen-Vertrautheit.

## Konsequenzen

- ✅ Zeilenbasierte Diffs für Reviews/Übersetzungen; Portabilität (CC BY-SA-Export trivial).
- ✅ Eine Render-Pipeline für Web, Preview und E-Mail-Auszüge → ein Sanitizing-Punkt.
- ⚠️ Erweiterungen der Markdown-Fähigkeiten (neue Direktiven) sind API-Contract-Änderungen:
  Doku + Sanitizer + Editor + Tests in einem PR.
- ⚠️ Bild-Referenzen zeigen auf Media-IDs (nicht auf rohe URLs), damit Varianten/`srcset` beim
  Rendern aufgelöst werden (→ [services/media](../../services/media-service.md)).
