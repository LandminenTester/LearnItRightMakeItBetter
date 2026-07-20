# Learn it right. Make it better. — Master Requirements Repository

> **Modular Open Knowledge, Developer Community & Enterprise Infrastructure Platform**
>
> Dieses Verzeichnis ist die **verbindliche Grundlage** für die Umsetzung der Plattform durch das
> Entwicklungsteam und für jede agentische (KI-gestützte) Generierung von Code, Dokumenten und
> Artefakten. Es konkretisiert das Fachkonzept *„Final Product & Technical Architecture Concept,
> Version 1.0"* in umsetzbare Anforderungen, Architekturen, Datenmodelle und Richtlinien.

| | |
|---|---|
| **Dokumentstatus** | Verbindlich (Version 1.0) |
| **Stand** | 2026-07-20 |
| **Software-Lizenz** | GNU AGPLv3 (siehe [`/LICENSE`](../LICENSE)) |
| **Inhalte-Lizenz** | Creative Commons BY-SA 4.0 |
| **Quelle** | Fachkonzept „Learn it right. Make it better." v1.0 Final Foundation |

---

## Leitgedanke

> **Eine Codebasis. Eine Plattform. Unbegrenzte Möglichkeiten.**
> Wissen wird erstellt, geprüft, übersetzt und gemeinsam besser gemacht.

Es gibt **keine** getrennten Editionen (Community / Professional / Enterprise). Jede Installation
aktiviert Module und Funktionen ausschließlich über Konfiguration
(→ [ADR-0009](architecture/decisions/adr-0009-single-codebase-no-editions.md)).

---

## Navigationsübersicht

| Bereich | Inhalt | Themen-Unterordner | Primäre Zielgruppe |
|---|---|---|---|
| [`requirements/`](requirements/README.md) | Vision, Personas, funktionale & nicht-funktionale Anforderungen, Roadmap, Glossar | [`epics/`](requirements/epics/README.md) — 14 Epic-Ordner mit Steckbrief + User Stories | Alle |
| [`architecture/`](architecture/README.md) | Systemarchitektur, Modulgrenzen, Frontend-/Backend-Architektur, Datenflüsse, Skalierung | [`modules/`](architecture/modules/README.md) — Modul-Landkarten · [`decisions/`](architecture/decisions/README.md) — 12 ADRs | Architektur, Backend, Frontend |
| [`services/`](services/README.md) | Detailspezifikation aller 12 Backend-Module (Domänenmodell, Regeln, Schnittstellen) | eine Spezifikation je Themenbereich | Backend |
| [`database/`](database/README.md) | Datenmodell-Konventionen, Prisma/Migrationen, Datenlebenszyklus & DSGVO | [`schemas/`](database/schemas/README.md) — Schema-Referenz pro Modul | Backend, DevOps |
| [`api/`](api/README.md) | REST-Konventionen, Authentifizierung, Realtime-Vorbereitung, OpenAPI-Workflow | [`endpoints/`](api/endpoints/README.md) — Endpunkt-Referenz pro Modul | Backend, Frontend |
| [`security/`](security/README.md) | Threat Model, AuthN/AuthZ-Härtung, Datenschutz, Secure Development Pipeline, Audit, Recovery | [`checklists/`](security/checklists/README.md) — Secure Coding, PR-Review, Härtung | Alle (Pflichtlektüre) |
| [`design-system/`](design-system/README.md) | Designprinzipien, Tokens, Komponentenbibliothek, Layouts, Accessibility, Agentic-UI-Regeln | [`components/`](design-system/components/README.md) — Einzelspezifikationen | Frontend, Design |
| [`deployment/`](deployment/README.md) | Umgebungen, Docker Compose, Kubernetes, Konfigurationsreferenz, Setup Wizard | [`runbooks/`](deployment/runbooks/README.md) — Backup, Upgrade, Monitoring, Skalierung, Incident | DevOps |
| [`testing/`](testing/README.md) | Teststrategie, Backend-/Frontend-/E2E-Tests, Quality Gates, Performance-Tests | [`scenarios/`](testing/scenarios/README.md) — E2E-Szenariokataloge | Alle |
| [`development-guidelines/`](development-guidelines/README.md) | Repository-Struktur, Code-Standards, Git-Workflow, Doku-Standards, Agentic Development, DoD | [`templates/`](development-guidelines/templates/README.md) — PR-/Issue-/Modul-Vorlagen | Alle |

## Empfohlene Lesereihenfolge für neue Teammitglieder

1. [Vision & Scope](requirements/01-vision-and-scope.md) — was wir bauen und warum.
2. [Glossar](requirements/07-glossary.md) — gemeinsame Sprache.
3. [Systemüberblick](architecture/01-system-overview.md) — wie alles zusammenhängt.
4. [Modulgrenzen](architecture/02-module-boundaries.md) — wo welcher Code lebt.
5. Rollenspezifisch: Backend → [`services/`](services/README.md) + [`database/`](database/README.md),
   Frontend → [`design-system/`](design-system/README.md) + [Frontend-Architektur](architecture/03-frontend-architecture.md),
   DevOps → [`deployment/`](deployment/README.md).
6. Für alle verpflichtend: [`security/`](security/README.md) und
   [Definition of Done](development-guidelines/06-definition-of-done.md).

---

## Dokumentkonventionen

### Verbindlichkeitsstufen (angelehnt an RFC 2119)

| Schlüsselwort | Bedeutung |
|---|---|
| **MUSS** / **DARF NICHT** | Absolute Anforderung bzw. absolutes Verbot. Abweichung nur mit neuem ADR. |
| **SOLLTE** / **SOLLTE NICHT** | Starke Empfehlung. Abweichung braucht dokumentierte Begründung (PR-Beschreibung genügt). |
| **KANN** | Optional, dem Team freigestellt. |

### Anforderungs-IDs

| Präfix | Bedeutung | Beispiel |
|---|---|---|
| `FR-<MODUL>-NNN` | Funktionale Anforderung eines Moduls | `FR-KNOW-003` |
| `NFR-NNN` | Nicht-funktionale Anforderung | `NFR-012` |
| `E-NN` | Epic | `E-04` |
| `US-<EPIC>-NN` | User Story innerhalb eines Epics | `US-04-02` |
| `ADR-NNNN` | Architecture Decision Record | `ADR-0001` |

Modulkürzel: `IDNT` (Identity), `AUTZ` (Authorization), `PROF` (Profile), `KNOW` (Knowledge),
`TRAN` (Translation), `ORGA` (Organization), `SRCH` (Search), `REPO` (Repository), `MEDI` (Media),
`NOTI` (Notification), `AUDT` (Audit), `CONF` (Configuration), `PLAT` (plattformweit/Setup).

IDs sind **stabil**: Eine einmal vergebene ID wird nie umgewidmet. Entfallene Anforderungen werden
als *Verworfen* markiert, nicht gelöscht.

### Statuskennzeichnung

Jedes Dokument trägt im Kopf `Status: Verbindlich | Entwurf | Verworfen`. Änderungen an
verbindlichen Dokumenten laufen über Pull Request mit Review
(→ [Dokumentationsstandards](development-guidelines/04-documentation-standards.md)).

### Diagramme

Diagramme werden als **Mermaid** direkt in Markdown gepflegt — keine binären Diagrammdateien,
damit Änderungen diffbar bleiben.

---

## Verhältnis zum Fachkonzept

Das Fachkonzept v1.0 bleibt als Produktvision maßgeblich. Bei Widersprüchen zwischen Fachkonzept
und diesem Repository gilt: **dieses Repository**, denn es ist die verfeinerte, durch ADRs
begründete Fassung. Jede bewusste Abweichung vom Fachkonzept ist als ADR dokumentiert und im
jeweiligen Dokument gekennzeichnet (Beispiel: das zusätzliche Modul `profile`,
→ [Services-Übersicht](services/README.md)).
