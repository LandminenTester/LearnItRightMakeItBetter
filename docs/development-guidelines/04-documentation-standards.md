# Dokumentationsstandards

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20

## 1. Dieses Requirements-Repository (`/docs`)

- **Lebende Spezifikation:** Verhaltensänderungen aktualisieren die betroffenen Dokumente im
  **selben PR** wie den Code — Doku-Drift ist ein Defekt. Betroffen sind typisch:
  Service-Doku (Fachregeln), Schema-Referenz, Endpunktkatalog, ggf. Epic/Story, ENV-Referenz.
- Konventionen aus [docs/README.md](../README.md) gelten: Statuskopf, MUSS/SOLLTE/KANN,
  stabile IDs (FR/NFR/US/ADR/Regel-IDs wie K-7 — nie umnummerieren), Mermaid für Diagramme,
  relative Links.
- Strukturprinzip: **Übersichtsdatei je Kategorie + Themenordner für Detailtiefe**
  (epics/, modules/, schemas/, endpoints/, checklists/, components/, runbooks/, scenarios/,
  templates/) — neue Detailthemen folgen diesem Muster statt Monolith-Dateien wachsen zu
  lassen.
- Querverweise: beim Verschieben/Umbenennen Link-Check ausführen (`pnpm docs:check-links`,
  CI-Gate) — tote interne Links machen den Build rot.
- Anforderungsänderungen: FR/NFR-Änderungen mit Prio *Must* brauchen Product-Owner- +
  Tech-Lead-Review ([requirements/README](../requirements/README.md)).

## 2. ADR-Prozess

Wann ADR? Neue Technologie/Infrastruktur, geändertes Kommunikationsmuster, neues Modul,
Service-Extraktion, Abweichung von bestehendem ADR. Prozess + Template:
[architecture/decisions/README.md](../architecture/decisions/README.md). Faustregel: Wenn die
Entscheidung in einem Jahr eine „Warum ist das so?"-Frage erzeugt, ist sie ADR-würdig.

## 3. Code-nahe Dokumentation

- **README je Paket/App:** Zweck, Start-Kommandos, Besonderheiten — kurz, verweist auf
  `/docs` statt zu duplizieren.
- **TSDoc** für exportierte/öffentliche APIs (Ports, Utilities, Design-System-Props):
  Kurzbeschreibung + `@param`/`@returns` bei nicht offensichtlichen Signaturen; Fachregeln
  per ID referenzieren statt nacherzählen.
- **OpenAPI** ist die API-Detaildoku (Code-first, [api/05](../api/05-openapi-workflow.md)) —
  Endpunktkatalog in `/docs` bleibt die fachliche Kurzreferenz (CI-Abgleich).
- **Design System:** Histoire-Stories sind die lebende Komponenten-Doku (R6).
- Kommentar-Stil: siehe [02-coding-standards.md §1](02-coding-standards.md).

## 4. Nutzer-/Betreiber-Dokumentation (Auslieferung)

Betreiber-Doku entsteht aus `/docs/deployment` (Installation, Konfiguration, Runbooks) und
wird zum 1.0-Release als eigenständige Site aufbereitet (Werkzeug-Entscheid per ADR in
Phase 3 — naheliegend: die Plattform dokumentiert sich selbst als öffentliche Instanz).
Bis dahin ist `/docs` die einzige Quelle — keine parallelen Wikis.

## 5. Sprache

Doku Deutsch (technische Begriffe englisch, Orthografie korrekt inkl. Umlaute); Code-Artefakte
und Commit-Subjects Englisch ([02 §1](02-coding-standards.md)); UI-Texte über i18n
([design-system/05 §4](../design-system/05-accessibility-i18n.md)).
