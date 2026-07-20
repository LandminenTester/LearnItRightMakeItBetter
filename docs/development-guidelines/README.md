# Development Guidelines — Übersicht

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20

Arbeitsweise des Entwicklungsteams — für Menschen und KI-Agenten gleichermaßen verbindlich.

## Dokumente

| Dokument | Inhalt |
|---|---|
| [01-repository-structure.md](01-repository-structure.md) | Monorepo-Aufbau, Workspaces, Kommandos, lokales Setup |
| [02-coding-standards.md](02-coding-standards.md) | TypeScript-/Vue-/NestJS-Standards, Lint-Regeln, Fehlerbehandlung, Logging |
| [03-git-workflow.md](03-git-workflow.md) | Branching, Conventional Commits, PR-Prozess, Releases |
| [04-documentation-standards.md](04-documentation-standards.md) | Doku-Pflege dieses Repos, ADR-Prozess, Code-Doku |
| [05-agentic-development.md](05-agentic-development.md) | **Regeln für KI-gestützte Entwicklung** (Kontextquellen, Grenzen, Nachweispflichten) |
| [06-definition-of-done.md](06-definition-of-done.md) | Verbindliche Abschluss-Checkliste jeder Aufgabe |
| [templates/](templates/README.md) | **Themenordner: Vorlagen** — PR, Issues, Modul-Doku |

## Kurzfassung der Arbeitsprinzipien

1. **Spezifikation vor Code:** Fachregeln stehen in [services/](../services/README.md) und
   den [Epics](../requirements/epics/README.md) — Code implementiert sie, Abweichungen ändern
   zuerst die Doku (gleicher PR).
2. **Kleine, vollständige PRs:** Feature + Tests + Doku + ggf. Migration zusammen; nichts
   „kommt später".
3. **Grenzen sind heilig:** Modulgrenzen, Design-System-Regeln und Security-Checklisten sind
   lintbar/prüfbar und nicht verhandelbar.
4. **`pnpm verify` lokal grün, bevor der PR entsteht** — CI ist Bestätigung, nicht
   Entdeckungsort.
