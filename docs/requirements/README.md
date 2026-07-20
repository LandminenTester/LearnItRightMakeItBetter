# Requirements — Übersicht

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20

Dieser Bereich enthält alle produktseitigen Anforderungen der Plattform
*Learn it right. Make it better.* Er ist die fachliche Quelle der Wahrheit; Architektur,
Services und Datenmodell leiten sich hieraus ab.

## Dokumente

| Dokument | Inhalt |
|---|---|
| [01-vision-and-scope.md](01-vision-and-scope.md) | Vision, Leitprinzipien, Betriebsmodelle, Scope-Abgrenzung, Erfolgskriterien |
| [02-stakeholders-personas.md](02-stakeholders-personas.md) | Stakeholder, Personas und deren Kernbedürfnisse |
| [03-functional-requirements.md](03-functional-requirements.md) | Funktionaler Anforderungskatalog aller Module (FR-IDs, MoSCoW, Phasen) |
| [04-non-functional-requirements.md](04-non-functional-requirements.md) | Qualitätsanforderungen: Performance, Sicherheit, Datenschutz, A11y, Betrieb |
| [05-epics-user-stories.md](05-epics-user-stories.md) | Index aller Epics und User Stories |
| [06-roadmap-milestones.md](06-roadmap-milestones.md) | Umsetzungsphasen 0–3, Meilensteine, Abhängigkeiten |
| [07-glossary.md](07-glossary.md) | Glossar / Ubiquitous Language |
| [epics/](epics/README.md) | **Themenordner pro Epic** (E-01…E-14): Epic-Steckbrief + vollständiger User-Story-Katalog mit Akzeptanzkriterien |

## Pflegeprozess

- Neue Anforderungen erhalten die nächste freie ID ihres Präfixes; IDs werden nie wiederverwendet.
- Jede FR verweist auf ihr Epic; jede User Story verweist auf mindestens eine FR.
- Prioritäten folgen **MoSCoW** (Must / Should / Could / Won't-for-now) und sind zusätzlich einer
  Umsetzungsphase (0–3, siehe [Roadmap](06-roadmap-milestones.md)) zugeordnet.
- Änderungen an Must-Anforderungen erfordern Review durch Product Owner **und** Tech Lead.
