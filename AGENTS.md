# Kontext für Coding-Agenten

Du arbeitest im Monorepo von **Learn it right. Make it better.** — einer selbst hostbaren
Wissensplattform (Nuxt 3 + NestJS + Prisma/PostgreSQL + Redis/BullMQ + Meilisearch).

## Verbindliche Quellen (in dieser Reihenfolge)

1. **`docs/`** ist die Spezifikation — insbesondere:
   [Agentic-Development-Regeln](docs/development-guidelines/05-agentic-development.md)
   (Kontext-Hierarchie, Erlaubt/Genehmigungspflichtig/Verboten) und
   [Agentic-UI-Regeln](docs/design-system/06-agentic-ui-rules.md) (R1–R7).
2. Einstieg je Aufgabe: [Modul-Landkarten](docs/architecture/modules/README.md) → verlinkte
   Service-Spezifikation, Schema-, API-Referenz und Epic/User Stories.
3. [Definition of Done](docs/development-guidelines/06-definition-of-done.md) gilt für jede
   Aufgabe vollständig.

## Kommandos

```bash
pnpm install         # einmalig
pnpm infra:up        # Docker-Dev-Stack (PG, Redis, Meili, MinIO, Mailhog)
pnpm dev             # Frontend :3000 + Backend :3001
pnpm verify          # Lint + Typecheck + Unit-Tests + Build — Pflicht vor jedem PR
pnpm test:int?       # (folgt in Phase 0) — bis dahin: pnpm test
```

## Harte Regeln (Kurzfassung — Details in docs/)

- **Nie:** Gates umgehen (Lint-Disables/Test-Skips ohne Begründung), Anforderungen erfinden,
  Secrets committen, `--force`-Push, Spezifikation per Code-Fakt ändern (erst Doku im selben PR).
- **Modulgrenzen:** Module importieren nur über den jeweiligen `index.ts`
  ([architecture/02](docs/architecture/02-module-boundaries.md)); Prisma nur in
  `infrastructure/`-Repositories des eigenen Moduls.
- **UI:** ausschließlich `Lir*`-Komponenten + Design Tokens; neue Bausteine zuerst ins
  Design System (mit Story + Test + Doku).
- **Genehmigungspflichtig:** neue Dependencies, ENV-Variablen, Migrationen mit Datenumbau,
  Permissions, Audit-Events, Security-Mechanik, API-Breaking — via ADR/Review.
- Nachweis vor Behauptung: `pnpm verify` real ausführen, Ergebnis im PR dokumentieren;
  KI-Anteile im PR kennzeichnen (Template-Checkbox + Co-Authored-By).

## Commits

Conventional Commits, englische Subjects, Scope = Modul/Paket
([docs/development-guidelines/03](docs/development-guidelines/03-git-workflow.md)).
