# Quality Gates & Performance-Tests

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20

## 1. CI-Pipeline (GitHub Actions, Turborepo-Task-Graph)

```
PR →  lint (ESLint/Stylelint/dependency-cruiser/i18n-Hartcode)
   →  typecheck (tsc --noEmit alle Pakete)
   →  test:unit  →  test:integration (Testcontainers)
   →  build (alle Apps/Pakete, Histoire, OpenAPI-Spec + Katalog-Abgleich + Breaking-Diff)
   →  e2e @core (Compose-Stack)
   →  security (CodeQL · Semgrep · Gitleaks · pnpm audit · Trivy · Lizenz-Check)
   →  merge-fähig
nightly → e2e voll · A11y voll · visuelle Diffs · k6-Smoke · Lighthouse CI
release → alles + k6-Voll-Lasttest · Setup-E2E · SBOM · Image-Signierung
```

Turborepo-Caching: nur betroffene Pakete laufen (ADR-0010); der `security`-Block läuft
unabhängig parallel. **Alle Gates sind blockierend** — Ausnahmen nur über dokumentierte
Baselines ([security/06 §3](../security/06-secure-development-pipeline.md)).

## 2. Gate-Übersicht (was rot macht)

| Gate | Kriterium |
|---|---|
| Lint | 0 Errors (inkl. Modulgrenzen-, Token-, `v-html`-, Import-Regeln) |
| Typecheck | 0 Errors, kein neues `any` (Lint-Regel) |
| Unit/Integration | grün + Coverage-Ratchet (≥ `main`-Stand, NFR-042-Ziele) |
| Build | alle Artefakte + OpenAPI-Generierung + Endpunktkatalog-Abgleich + kein v1-Breaking-Diff |
| E2E @core | grün (max. 1 Auto-Retry, Flake-Politik [01 §5](01-test-strategy.md)) |
| Security | keine neuen High/Critical-Findings, kein Secret, Lizenz-Allowlist |
| i18n | Key-Parität de/en |

## 3. Lasttests (k6) — NFR-Nachweise

**Profile** (gegen Staging in Referenzgröße, `e2e`-Seed hochskaliert: 10 k Nutzer, 50 k
Versionen — Generator-Skript im Repo):

| Profil | Last | Prüft |
|---|---|---|
| `smoke` | 20 VUs, 5 min | Regressionen (nightly) |
| `load` | 500 gleichzeitige Sessions, 30 min, Mix: 70 % lesen (SSR+API), 15 % Suche, 10 % schreiben, 5 % Media | NFR-001/002/003/006 (p95-Schwellen als k6-Thresholds) |
| `stress` | Rampe bis Sättigung | Degradationsverhalten, Rate-Limit-Greifen, keine 5xx-Kaskaden |
| `soak` | 100 VUs, 4 h (je Meilenstein) | Memory-Leaks, Queue-Drift, Verbindungs-Pools |

Thresholds kodieren die NFR-Werte (`http_req_duration{scenario:read}: p(95)<300`); Verstoß =
roter Release-Gate. Ergebnisse werden je Meilenstein im Betriebs-/Kapazitäts-Log festgehalten
([architecture/06 §4](../architecture/06-scalability-evolution.md)).

## 4. Frontend-Performance (Lighthouse CI)

Seiten: Startseite, Artikelseite (lang, mit Bildern/Code), Suchergebnis, Space-Übersicht —
mobil + Desktop, beide Themes stichprobenartig. Budgets = NFR-005 (LCP < 2,5 s, CLS < 0,1,
INP < 200 ms) + Bundle-Budget: Erst-Load JS öffentlich < 200 KB gzip (Route-Splitting-Wächter).
Nightly + Release; Verschlechterung > 10 % gegen Baseline ⇒ rot.

## 5. Meilenstein-Nachweise (Release-Kriterien)

| Meilenstein | Zusätzlich zu allen Gates |
|---|---|
| M1 | Wissens-Loop-E2E, k6 `load` erste Baseline, Restore-Übung |
| M2 | Translation-/Org-Szenarien, Aussperrungs-Übung, `soak` |
| M3 = 1.0 | volle NFR-Nachweise (k6 + Lighthouse dokumentiert), Setup < 30 min-Messung, Security-Pentest-Runde (extern empfohlen), alle Runbook-Übungen |
