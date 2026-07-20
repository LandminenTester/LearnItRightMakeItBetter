# E2E-Testing (Playwright)

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20 ·
**Szenariokataloge:** [scenarios/](scenarios/README.md)

## 1. Umgebung

- Vollständiger Stack via `infrastructure/docker/compose.e2e.yml` (prod-nahe Images +
  Mailhog + MinIO), DB mit `e2e`-Seed (deterministische Fixtures:
  Admin/Maintainer/Reviewer/Translator/Member-Konten, Beispiel-Space, Org, Artikel in allen
  Status).
- `globalSetup`: Stack-Health abwarten, Seed einspielen, **Auth-States** je Rolle einmal
  erzeugen (`storageState`-Dateien) — Tests loggen sich nicht jedes Mal durch die UI ein
  (Login selbst hat eigene Szenarien).
- Browser-Matrix: Chromium in jedem PR; Firefox + WebKit nightly (NFR-034); Viewports
  Desktop 1280 + Mobile 375 (Kernszenarien doppelt).

## 2. Konventionen

- Selektoren über Rollen/Labels (`getByRole`, `getByLabel`); `data-testid` nur wo Semantik
  nicht greift (dokumentiert).
- Jedes Szenario ist unabhängig (eigene Fixture-Entitäten über API-Setup-Helper erzeugt,
  Namespacing per Test-ID) — Reihenfolge egal, parallelisierbar.
- Warten ausschließlich auf Zustände (`expect(locator).toBeVisible()`, Response-Waits) —
  keine `waitForTimeout`; asynchrone Backend-Wirkung (Indexierung, Mail) über Poll-Helfer mit
  Deadline (z. B. `expectSearchable(title, { timeout: 30_000 })` — misst nebenbei NFR-008).
- Mails werden über die Mailhog-API gelesen (Verifizierungs-/Reset-Links extrahiert).
- **API-Negativfälle gehören dazu:** Szenarien enthalten direkte `request`-Aufrufe für
  403/404-Prüfungen (nicht nur „Button ist versteckt", E-Regel [security/03 §5](../security/03-authorization-enforcement.md)).

## 3. Suiten & Umfang

| Suite | Inhalt | Läuft |
|---|---|---|
| **Kern** (`@core`) | Wissens-Loop komplett, Login lokal + Discord-Fake, Suche + Leak-Stichprobe, Media-Upload, Setup-Smoke | jeder PR (< 10 min) |
| **Voll** | alle [Szenariokataloge](scenarios/README.md), Browser-Matrix, Mobile | nightly + vor Release |
| **A11y** | axe auf Kernseiten beider Themes; Tastatur-Journeys (Login, Artikel erstellen, Review) | PR (Kernseiten) + nightly |
| **Smoke-Deploy** | Health, Login, Artikel lesen, Suche — gegen Staging nach Deploy | je Deploy |

OAuth-Provider in E2E: gefakter OIDC/OAuth-Server im Stack (dex o. ä.) mit
Discord-/GitHub-kompatiblen Flows — echte Provider werden nie in CI angesprochen.

## 4. Setup-Wizard-Tests

Eigener Stack-Start ohne Seed (`SETUP_E2E=1`): kompletter Wizard-Durchlauf (US-01-01),
Fehlerpfade (DB falsch → korrigieren), Abschluss-Sperre (US-01-05). Läuft nightly (teuer,
eigener Stack).

## 5. Artefakte & Debugging

Trace + Video + Screenshot bei Fehlern (CI-Artefakte, 14 Tage); HTML-Report als
PR-Kommentar-Link; lokal `pnpm e2e --ui` gegen den Dev-Stack (dokumentierte Abweichungen:
Dev-Seed statt e2e-Seed).
