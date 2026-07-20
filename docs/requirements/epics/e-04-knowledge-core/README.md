# E-04 · Knowledge Core

**Status:** Verbindlich · **Phase:** 1–2 · **Priorität:** Must ·
**Module:** [knowledge](../../../services/knowledge-service.md), [media](../../../services/media-service.md) ·
**FRs:** FR-KNOW-001…017 · **ADR:** [ADR-0012](../../../architecture/decisions/adr-0012-markdown-content-format.md) ·
**Stories:** [user-stories.md](user-stories.md)

## Ziel

Der vollständige Wissens-Loop — **erstellen → prüfen → publizieren → verbessern** — mit
lückenloser Versionierung. Träger der Leitprinzipien: *Learn it right* (geprüfte Qualität durch
Review-Pflicht) und *Make it better* (jeder kann Verbesserungen vorschlagen).

## Scope

**Enthalten:**

- Spaces mit Sichtbarkeiten (`public`/`internal`/`organization`/`private`), Kategorien (3 Ebenen), Tags
- Artikeltypen: Learning Basics, Best Practices, How-To Guides, Troubleshooting, OSS-Wissen
- Markdown-Inhalte (CommonMark+GFM+Admonitions), zentrale Render-/Sanitizing-Pipeline
- Versionierung mit Änderungsnotizen, Diff-Ansicht, unveränderliche publizierte Versionen
- Lifecycle `draft → in_review → published → archived` + Review-Workflow
- Änderungsvorschläge Dritter, Co-Autoren (Could)
- Kommentare (Threads, resolve) und Hilfreich-Feedback
- Slug-Verwaltung mit Redirects

**Nicht enthalten:** Übersetzungen (E-05), Suche (E-06), Bild-Verarbeitung (E-10 — hier nur
Einbettung), Serien/Lernpfade (Phase 3+, FR-KNOW-016).

## Phasenschnitt

| Phase | Inhalt |
|---|---|
| 1 | Spaces, Kategorien, Tags, Artikel-CRUD, Versionen, Diff, Review, Publish, Slugs, Rendering |
| 2 | Kommentare, Hilfreich-Feedback, Änderungsvorschläge, Archivierung, Co-Autoren |

## Abhängigkeiten

Benötigt: E-03 (Space-Rollen), E-10 (Bilder), E-14 (Editor-/Viewer-Komponenten), E-11
(Review-Benachrichtigungen). Liefert Events an: E-05, E-06, E-07, E-11.

## Erfolgsmetriken

- E2E „Wissens-Loop" ([testing/scenarios](../../../testing/scenarios/wissens-loop.md)) grün
- Publikation → auffindbar in Suche ≤ 30 s (NFR-008)
- Render-Pipeline: 0 XSS-Findings in Fuzz-/Pentest-Runden

## Risiken & Gegenmaßnahmen

| Risiko | Gegenmaßnahme |
|---|---|
| XSS über Nutzer-Markdown | eine zentrale Sanitizing-Pipeline, Allowlist, Fuzz-Tests (security/05) |
| Review wird zum Flaschenhals | `reviewRequired` pro Space konfigurierbar; Review-Queues + Benachrichtigungen |
| Versionskonflikte frustrieren Autoren | Konfliktwarnung + Diff gegen aktuelle Fassung (K-7); Auto-Merge bewusst nach 1.0 |
