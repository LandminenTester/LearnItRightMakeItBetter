# Secure Development Pipeline

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20 ·
**Bezug:** Fachkonzept §15, NFR-024 · **CI-Gesamtbild:** [testing/05](../testing/05-quality-gates-performance.md)

## 1. Automatische Prüfungen (GitHub Actions)

| Prüfung | Werkzeug | Wann | Gate |
|---|---|---|---|
| **SCA** (Dependency-Schwachstellen) | **Dependabot**-Alerts + `pnpm audit` (Baseline-gepflegt) | PR + täglich | Fail bei neuen High/Critical ohne dokumentierte Ausnahme |
| Dependency-Updates | **Renovate** (gruppiert, Lockfile-Pflege) + Dependabot Security-PRs | laufend | Security-Updates priorisiert (§3) |
| **SAST** | **CodeQL** (JS/TS-Suite) | PR + wöchentlich voll | Fail bei High/Critical |
| **SAST-Regeln projektspezifisch** | **Semgrep** (Registry `p/owasp-top-ten`, `p/typescript` + Eigenregeln §2) | PR | Fail bei `ERROR`-Severity |
| **Secret Scanning** | GitHub Secret Scanning + **Push Protection** + Gitleaks in CI (Forks/lokal) | Push/PR | Fail bei Fund |
| **Container Scanning** | **Trivy** (Images + IaC/Compose/K8s-Manifeste) | PR (Build) + Release | Fail bei High/Critical mit Fix verfügbar |
| Lizenz-Compliance (NFR-070) | `license-checker` gegen Allowlist (AGPLv3-kompatibel) | PR | Fail bei unbekannter/inkompatibler Lizenz |
| SBOM | Syft (SPDX) je Release-Image | Release | Artefakt-Pflicht |

## 2. Semgrep-Eigenregeln (Mindestsatz, wächst mit Findings)

- `v-html` außerhalb `ArticleContent`-Komponente → ERROR
- String-Konkatenation in `$queryRaw`/`$executeRaw` → ERROR
- `child_process`-Nutzung außerhalb erlaubter CLI-Dateien → ERROR
- Direkter `new PrismaClient()` außerhalb `common/database` → ERROR
- `fetch`/HTTP-Client mit nicht-konstanter URL außerhalb Adapter-Verzeichnisse → WARN (SSRF-Review)
- Logging von Feldern aus Redaction-Liste (`password`, `token`, `secret`, `authorization`) → ERROR
- Import aus `modules/*/infrastructure|domain` fremder Module → ERROR (Modulgrenzen, ergänzt dependency-cruiser)

## 3. Umgang mit Findings & Updates

- **Triage-SLA:** Critical ≤ 24 h bewerten, High ≤ 3 Werktage, sonst ≤ Sprint. Bewertung =
  fixen, Ausnahme dokumentieren (Baseline-Datei mit Grund + Ablaufdatum) oder als False
  Positive markieren (Regel verbessern).
- Renovate: Patch/Minor gruppiert wöchentlich, Major einzeln mit Changelog-Review;
  Security-Fixes sofort. Lockfile-Änderungen nie ungeprüft mergen (Supply-Chain T11).
- Neue Direktabhängigkeiten brauchen im PR eine Kurzbegründung (Alternativen, Wartungszustand,
  Lizenz) — Checklisten-Frage.

## 4. Repo-/Build-Härtung

- Branch Protection `main`: PR-Pflicht, ≥ 1 Review, alle Checks grün, keine Force-Pushes;
  signierte Commits SOLLTE.
- Actions: minimale `permissions:` je Workflow (`contents: read` Default), Pinning von
  Third-Party-Actions auf Commit-SHA, kein `pull_request_target` mit Secret-Zugriff.
- Build-Artefakte: reproduzierbare Docker-Builds (gepinnte Basis-Images per Digest,
  Multi-Stage, non-root User, → [deployment/02](../deployment/02-docker-compose.md));
  Release-Images signiert (cosign, Phase 3).
- Keine Secrets in CI-Logs (masking); Fork-PRs erhalten keine Secrets.

## 5. Entwickler-Pflichten

- [Secure-Coding-Checkliste](checklists/secure-coding.md) ist Referenz beim Schreiben,
  [Security-Review-Checkliste](checklists/code-review-security.md) Pflicht im PR
  (→ [Definition of Done](../development-guidelines/06-definition-of-done.md)).
- Lokale Hooks (optional, empfohlen): Gitleaks + Lint vor Push (`pnpm verify`).
- Security-Findings aus Betrieb/Reports → Prozess in
  [08-incident-response-recovery.md](08-incident-response-recovery.md).
