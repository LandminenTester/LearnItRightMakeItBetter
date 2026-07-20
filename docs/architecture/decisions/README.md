# Architecture Decision Records (ADR)

**Status:** Verbindlich · **Stand:** 2026-07-20

Jede architekturprägende Entscheidung wird als ADR festgehalten. ADRs sind unveränderlich:
Eine Revision erzeugt einen **neuen** ADR, der den alten ersetzt (`Superseded by ADR-XXXX`).

## Index

| ADR | Titel | Status |
|---|---|---|
| [ADR-0001](adr-0001-modular-monolith.md) | Modularer Monolith mit service-orientierter Binnenstruktur | Akzeptiert |
| [ADR-0002](adr-0002-nuxt-frontend.md) | Nuxt 3 + Vue 3 + TypeScript + Tailwind CSS 4 als Frontend-Stack | Akzeptiert |
| [ADR-0003](adr-0003-nestjs-backend.md) | NestJS als Backend-Framework | Akzeptiert |
| [ADR-0004](adr-0004-postgresql-prisma.md) | PostgreSQL als Datenbank, Prisma als ORM | Akzeptiert |
| [ADR-0005](adr-0005-meilisearch.md) | Meilisearch als Suchtechnologie | Akzeptiert |
| [ADR-0006](adr-0006-redis-bullmq.md) | Redis für Cache/Sessions/Rate-Limits, BullMQ für Hintergrundjobs | Akzeptiert |
| [ADR-0007](adr-0007-storage-abstraction.md) | Storage-Abstraktion mit Provider-Adaptern | Akzeptiert |
| [ADR-0008](adr-0008-hybrid-rbac-abac.md) | Hybrides Autorisierungsmodell RBAC + ABAC | Akzeptiert |
| [ADR-0009](adr-0009-single-codebase-no-editions.md) | Eine Codebasis, Konfiguration statt Editionen | Akzeptiert |
| [ADR-0010](adr-0010-monorepo-pnpm-turborepo.md) | Monorepo mit pnpm workspaces + Turborepo | Akzeptiert |
| [ADR-0011](adr-0011-session-auth-server-side.md) | Serverseitige Sessions statt JWT als primäre Web-Authentifizierung | Akzeptiert |
| [ADR-0012](adr-0012-markdown-content-format.md) | Markdown als kanonisches Inhaltsformat | Akzeptiert |

## Template für neue ADRs

```markdown
# ADR-XXXX: <Titel>

**Status:** Vorgeschlagen | Akzeptiert | Ersetzt durch ADR-YYYY · **Datum:** JJJJ-MM-TT

## Kontext
<Problem, Rahmenbedingungen, Anforderungen mit FR/NFR-Referenzen>

## Entscheidung
<Die getroffene Entscheidung in 1–3 Sätzen, dann Präzisierung>

## Betrachtete Alternativen
<Alternative → Grund der Ablehnung>

## Konsequenzen
<Positive und negative Folgen, entstehende Pflichten>
```

## Prozess

1. ADR als PR im Status *Vorgeschlagen* einreichen (nächste freie Nummer).
2. Review durch Tech Lead + mindestens ein weiteres Teammitglied.
3. Nach Merge: Status *Akzeptiert*; betroffene Dokumente im selben PR aktualisieren.
