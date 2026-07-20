# Testing — Übersicht

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20

Teststrategie und -praxis der Plattform. Ziel: Vertrauen in jeden Merge auf `main` — die
Quality Gates hier sind Bestandteil der
[Definition of Done](../development-guidelines/06-definition-of-done.md).

## Dokumente

| Dokument | Inhalt |
|---|---|
| [01-test-strategy.md](01-test-strategy.md) | Pyramide, Tooling-Entscheidungen, Abdeckungsziele, Verantwortlichkeiten |
| [02-backend-testing.md](02-backend-testing.md) | Unit-/Integrationstests (Testcontainers), AuthZ-Matrix, Contract-Tests |
| [03-frontend-testing.md](03-frontend-testing.md) | Komponenten-/Store-/Composable-Tests, axe, Story-basierte Prüfungen |
| [04-e2e-testing.md](04-e2e-testing.md) | Playwright-Setup, Fixtures, Kernszenarien |
| [05-quality-gates-performance.md](05-quality-gates-performance.md) | CI-Pipeline, Gates, Lasttests (k6), Lighthouse |
| [scenarios/](scenarios/README.md) | **Themenordner: E2E-Szenariokataloge** je Fachbereich |

## Grundsätze

1. **Verhalten testen, nicht Implementierung** — Tests überleben Refactorings
   (Regel-Referenzen wie K-10, I-8 sind die Spezifikation).
2. **Negativpfade sind Pflicht** — jede Permission, jedes Limit, jeder Fehlerfall hat einen
   Test; Happy-Path-only gilt als unfertig.
3. **Deterministisch** — keine Sleeps/Flakes: Zeit wird gefaked, Jobs werden explizit
   ausgeführt, Testdaten sind isoliert.
4. **Schnell genug, um zu laufen** — Unit < 1 min, Integration < 5 min, E2E-Kern < 10 min
   (CI-Budget in [05](05-quality-gates-performance.md)).
