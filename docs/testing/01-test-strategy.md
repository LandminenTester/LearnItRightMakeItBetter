# Teststrategie

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20

## 1. Testpyramide & Tooling

| Ebene | Umfang | Werkzeuge | Läuft |
|---|---|---|---|
| **Unit** | Fachregeln, Services (Ports gemockt), Utilities, Zod-Schemas, Policy-Evaluation | **Vitest** (Backend via SWC, Frontend) | jeder PR, watch lokal |
| **Integration Backend** | Module gegen echte Infrastruktur: PostgreSQL, Redis, Meilisearch via **Testcontainers**; HTTP-Ebene via supertest | Vitest + Testcontainers | jeder PR |
| **Komponenten Frontend** | Design-System- und Feature-Komponenten im DOM (happy-dom), axe | Vitest + Vue Testing Library | jeder PR |
| **E2E** | Kern-Journeys durch echte App (Compose-Stack) | **Playwright** | PR (Kern-Suite) + nightly (voll) |
| **Last/Performance** | NFR-Nachweise | **k6**, Lighthouse CI | nightly + je Meilenstein |

**Entscheidung Vitest statt Jest** (auch im NestJS-Backend): ein Test-Runner im Monorepo,
gleiche Konfiguration/Assertions überall, deutlich schnellere Ausführung; NestJS-DI wird über
`@nestjs/testing` genutzt — Runner-unabhängig. Abweichung vom Nest-Default ist bewusst und
gilt repo-weit.

## 2. Abdeckungsziele (NFR-042)

| Bereich | Branch-Coverage |
|---|---|
| Gesamt-Backend-Module | ≥ 70 % |
| Kritische Pfade: `authorization` (Entscheidungskern), Auth-Flows (`identity`), Publikations-Workflow (`knowledge`), Media-Pipeline, Setup-Guard | ≥ 90 % (Entscheidungskern ≥ 95 % + Property-Tests) |
| `packages/design-system` | ≥ 80 % + axe-clean |
| `packages/shared-types` (Schemas) | über Nutzer-Tests abgedeckt; Schema-Edge-Cases explizit |

Coverage ist **Gate, nicht Ziel**: Zahlen sinken nie unter den Stand von `main`
(Ratchet-Prinzip); gezielte Tests > Coverage-Kosmetik.

## 3. Was wo getestet wird (Abgrenzung)

- **Fachregeln (K-x, T-x, I-x, …):** Unit auf Service-Ebene; die Regel-ID steht im Testnamen
  (`it('K-7: warnt bei veralteter Basis-Version', …)`) — Spezifikation und Tests bleiben
  verknüpfbar.
- **AuthZ:** Matrix-Tests pro Modul (Integration, [02 §4](02-backend-testing.md)) + zentrale
  Property-Tests; E2E prüft nur Stichproben durch die UI + direkte API-Negativfälle.
- **Events/Jobs:** Integration — Event ausgelöst ⇒ Job enqueued ⇒ Handler-Wirkung; Idempotenz
  durch doppelte Ausführung.
- **API-Contract:** OpenAPI-Checks ([api/05 §3](../api/05-openapi-workflow.md)) + Zod-Schemas;
  keine hand-gepflegten Contract-Tests nötig (eine Quelle).
- **UI-Verhalten:** Komponententests; Journeys nur in E2E (keine „Seiten-Unit-Tests" mit
  riesigen Mocks).

## 4. Testdaten

- **Factories** (`test/factories/`) je Entität mit sinnvollen Defaults + Overrides — keine
  Fixture-Friedhöfe; Seeds-Profile (`dev`, `e2e`) für Stack-Tests
  ([database/05 §4](../database/05-prisma-and-migrations.md)).
- Isolation: Integrationstests je Datei eigenes Schema/Truncate; E2E setzt DB per
  `e2e`-Seed zurück (globalSetup).
- Zeit: `vi.setSystemTime` bzw. injizierte Clock; TOTP-Tests mit fixer Zeit.

## 5. Flake-Politik

Flaky Test = Bug: sofort Issue, Quarantäne-Tag (`@flaky`, läuft non-blocking), Fix binnen
eines Sprints — sonst wird der Test gelöscht und das Loch als Risiko dokumentiert. Kein
„Retry bis grün" als Dauerzustand (max. 1 Auto-Retry nur in E2E).

## 6. Verantwortung

Tests schreibt, wer das Verhalten baut — im selben PR. Reviewer prüfen Negativpfade
(Security-Checkliste Frage 1/4/7). Die E2E-Kern-Suite gehört dem gesamten Team; Änderungen an
Szenarien ([scenarios/](scenarios/README.md)) reviewt zusätzlich der Fachbereichs-Owner.
