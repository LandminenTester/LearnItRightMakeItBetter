# Agentic Development — KI-gestützte Entwicklung

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20 ·
**UI-Spezialfall:** [design-system/06-agentic-ui-rules.md](../design-system/06-agentic-ui-rules.md)

Dieses Repository ist bewusst als **Agentic Development Foundation** aufgebaut (Fachkonzept
§21): Struktur, IDs und Regeln sind so formuliert, dass KI-Agenten damit zuverlässig arbeiten
können. Für Agenten gelten **alle** Team-Regeln — plus die folgenden.

## 1. Kontext-Hierarchie (verbindliche Wahrheitsquellen)

Bei Widerspruch gilt die höhere Ebene; Agenten zitieren die Quelle ihrer Entscheidungen
(Regel-/Story-/ADR-IDs):

1. [Security-Grundsätze](../security/README.md) — niemals zugunsten von Feature-Tempo brechen
2. [ADRs](../architecture/decisions/README.md) + [Modulgrenzen](../architecture/02-module-boundaries.md)
3. Service-Spezifikationen ([services/](../services/README.md)) + Schema-/API-Referenzen
4. Epics/User Stories ([requirements/epics/](../requirements/epics/README.md))
5. Guidelines dieses Ordners
6. Bestehender Code als Muster (nur wo 1–5 schweigen)

**Einstiegspfad je Aufgabe:** Modul-Landkarte
([architecture/modules/](../architecture/modules/README.md)) → verlinkte Spezifikationen →
betroffene Stories. Nicht raten — nachlesen.

## 2. Erlaubt / Genehmigungspflichtig / Verboten

**Erlaubt (autonom):** Features gemäß Spezifikation, Bugfixes mit Test, Refactorings innerhalb
der Modulgrenzen, Testausbau, Doku-Synchronisation, Lint-/Typecheck-Fixes.

**Genehmigungspflichtig (Mensch entscheidet, i. d. R. via ADR/Review):** neue Dependencies,
neue ENV-Variablen/Settings-Keys, Schema-Migrationen mit Datenumbau, neue
Permissions/Systemrollen-Änderungen, neue Audit-Event-Typen, Änderungen an
Security-Mechanismen (Auth-Flows, Sanitizer, Crypto), API-Contract-Änderungen mit
Breaking-Potenzial, neue Module/Queues.

**Verboten:** Deaktivieren/Umgehen von Gates (Lint-Disables ohne Begründung, Test-Skips,
Baseline-Aufweichung), Erfinden von Anforderungen („wäre doch praktisch"),
Spezifikationsänderung per Code-Fakt (erst Doku-PR), Secrets in irgendeiner Form erzeugen/
committen, `--force`-Pushes, Löschen fremder Arbeit.

## 3. Arbeitsweise-Pflichten

- **Spezifikations-Treue:** Implementierung referenziert Regel-IDs (Testnamen, Kommentare an
  Invarianten, PR-Beschreibung). Lücken/Widersprüche in der Spezifikation ⇒ als Frage/Issue
  eskalieren, nicht still interpretieren.
- **Vollständige Inkremente:** Code + Tests (inkl. Negativpfade) + Doku-Sync + Migration im
  selben PR — Definition of Done gilt uneingeschränkt
  ([06-definition-of-done.md](06-definition-of-done.md)).
- **Nachweis vor Behauptung:** `pnpm verify` (+ relevante `test:int`) tatsächlich ausführen
  und Ergebnis im PR dokumentieren; „sollte funktionieren" existiert nicht.
- **Kleine Schritte:** ein fachliches Thema pro PR; bei Unsicherheit über Schnitt → erst
  Plan als PR-Beschreibung/Issue-Kommentar.
- **Kennzeichnung:** KI-erstellte PRs sind als solche markiert (PR-Template-Checkbox +
  Co-Authored-By-Trailer) — gleiche Qualitätsmaßstäbe, transparente Herkunft.

## 4. Review von Agenten-PRs (menschliche Pflicht)

Menschen reviewen Agenten-PRs mit denselben Checklisten, besonders wachsam bei: erfundenen
APIs/Feldern (gegen Schema-/Endpunkt-Referenz prüfen), scheinbar plausiblen, aber
regelwidrigen Sicherheitsdetails (Checkliste!), Duplikat-Logik statt Wiederverwendung, und
Doku-Behauptungen ohne Testbeleg. Ein Agent ist ein produktives Teammitglied ohne
Merge-Rechte — Verantwortung bleibt beim Menschen.

## 5. Kontext-Dateien im Repo

`CLAUDE.md`/`AGENTS.md` im Repo-Root fassen für Coding-Agenten zusammen: Einstiegspfade in
`/docs`, `pnpm`-Kommandos, die Verboten-Liste aus §2 und den Verweis auf dieses Dokument.
Sie **duplizieren keine Fachregeln** (Single Source bleibt `/docs`) und werden bei
Strukturänderungen mitgepflegt.
