# Nicht-funktionale Anforderungen (NFR-Katalog)

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20

Alle Messwerte beziehen sich, sofern nicht anders angegeben, auf die
**Referenzumgebung Single-Node**: 4 vCPU, 8 GB RAM, SSD, Docker Compose
(→ [deployment/01](../deployment/01-environments-topologies.md)).

## 1. Performance & Kapazität

| ID | Anforderung | Zielwert | Prüfmethode |
|---|---|---|---|
| NFR-001 | API-Antwortzeit lesend (p95) | < 300 ms | Lasttest k6 (→ [testing/05](../testing/05-quality-gates-performance.md)) |
| NFR-002 | API-Antwortzeit schreibend (p95) | < 600 ms | Lasttest k6 |
| NFR-003 | Suchanfragen (p95, inkl. Meilisearch) | < 200 ms | Lasttest k6 |
| NFR-004 | Artikelseite öffentlich (SSR, p95, ohne Netzwerk-Latenz) | < 500 ms TTFB | Lasttest / Lighthouse |
| NFR-005 | Frontend Core Web Vitals öffentliche Seiten | LCP < 2,5 s · CLS < 0,1 · INP < 200 ms | Lighthouse CI |
| NFR-006 | Kapazität Referenzumgebung | ≥ 10.000 registrierte Nutzer, ≥ 500 gleichzeitige Sessions, ≥ 50.000 Artikelversionen | Lasttest |
| NFR-007 | Media-Verarbeitung (Bild ≤ 10 MB bis „ready") | < 15 s (asynchron, blockiert keine Requests) | Integrationstest |
| NFR-008 | Suchindex-Aktualität nach Publikation | ≤ 30 s | E2E-Test |

## 2. Verfügbarkeit & Zuverlässigkeit

| ID | Anforderung | Zielwert |
|---|---|---|
| NFR-010 | Verfügbarkeitsziel Referenzbetrieb (Betreiber-Verantwortung, Software darf nicht limitieren) | 99,5 % |
| NFR-011 | Graceful Shutdown: laufende Requests abschließen, Jobs sauber zurücklegen | SIGTERM ≤ 30 s |
| NFR-012 | Hintergrundjobs: automatische Retries mit exponentiellem Backoff, Dead-Letter-Verhalten, Idempotenz | verbindlich für alle Jobs |
| NFR-013 | Kein Datenverlust bei Neustart: alle persistenten Zustände in PostgreSQL/Storage, keine kritischen Nur-Memory-Zustände | verbindlich |
| NFR-014 | Startverhalten: Backend startet auch bei temporär nicht erreichbarem Meilisearch/SMTP (degradiert, mit Health-Warnung); PostgreSQL und Redis sind harte Abhängigkeiten | verbindlich |

## 3. Sicherheit & Datenschutz

Details: [security/](../security/README.md). Hier nur die messbaren Grundanforderungen.

| ID | Anforderung |
|---|---|
| NFR-020 | Transport ausschließlich HTTPS/TLS ≥ 1.2; HSTS; sichere Cookies (`Secure`, `HttpOnly`, `SameSite=Lax`); vollständige Security-Header (→ [security/05](../security/05-application-security.md)) |
| NFR-021 | Passwörter niemals im Klartext; Argon2id mit individuellen Salts (→ [security/02](../security/02-authentication-security.md)) |
| NFR-022 | Sensible Daten (OAuth-Secrets, API-Tokens, TOTP-Secrets, SMTP-Passwörter) verschlüsselt at rest (AES-256-GCM, Feldebene) |
| NFR-023 | DSGVO: Auskunft (Datenexport), Berichtigung, Löschung/Anonymisierung, Datenminimierung, dokumentierte Rechtsgrundlagen (→ [database/06](../database/06-data-lifecycle-gdpr.md)) |
| NFR-024 | Secure Development Pipeline in CI verpflichtend: SCA, SAST, Secret Scanning, Container Scanning (→ [security/06](../security/06-secure-development-pipeline.md)) |
| NFR-025 | Rate Limiting auf allen Auth- und Schreib-Endpunkten (Redis-basiert, konfigurierbar) |
| NFR-026 | Alle sicherheitsrelevanten Aktionen erzeugen Audit-Events (→ [security/07](../security/07-audit-logging.md)) |

## 4. Benutzbarkeit & Zugänglichkeit

| ID | Anforderung |
|---|---|
| NFR-030 | Accessibility: WCAG 2.1 Level AA für alle Kern-Flows; Tastaturbedienbarkeit vollständig; automatisierte axe-Prüfungen in E2E-Tests (→ [design-system/05](../design-system/05-accessibility-i18n.md)) |
| NFR-031 | Responsive: Breakpoints Mobile (≥ 360 px), Tablet, Desktop; keine horizontalen Scrollbalken auf Kernseiten |
| NFR-032 | Dark Mode gleichwertig gepflegt wie Light Mode (kein „nachgezogenes" Theme) |
| NFR-033 | UI-Sprachen `de` und `en` zum Release vollständig; UI-Strings ausschließlich über i18n-Mechanismus, keine hartcodierten Texte |
| NFR-034 | Browser-Support: jeweils letzte 2 Versionen von Chrome, Firefox, Safari, Edge |

## 5. Wartbarkeit & Erweiterbarkeit

| ID | Anforderung |
|---|---|
| NFR-040 | TypeScript durchgehend im `strict`-Modus; keine `any` ohne dokumentierte Begründung |
| NFR-041 | Modulgrenzen werden statisch erzwungen (Lint-Regeln für erlaubte Importpfade, → [architecture/02](../architecture/02-module-boundaries.md)) |
| NFR-042 | Testabdeckung: Branches ≥ 70 % Backend-Module, kritische Pfade (Auth, Authorization, Publikation, Media-Pipeline) ≥ 90 % (→ [testing/01](../testing/01-test-strategy.md)) |
| NFR-043 | Öffentliche API vollständig per OpenAPI beschrieben; Breaking Changes nur mit API-Versionssprung (→ [api/01](../api/01-api-conventions.md)) |
| NFR-044 | Neue Storage-, Auth- und Notification-Provider ausschließlich über die definierten Adapter-Interfaces — kein Provider-Code außerhalb der Adapter |
| NFR-045 | Datenbankänderungen ausschließlich über versionierte Prisma-Migrationen; Migrationen sind vorwärtsgerichtet und auf Bestandsdaten getestet |

## 6. Betrieb & Self-Hosting

| ID | Anforderung |
|---|---|
| NFR-050 | Vollständige Installation (Compose) inkl. Setup Wizard in < 30 Minuten auf Referenzumgebung |
| NFR-051 | Alle Konfiguration über Umgebungsvariablen bzw. Admin-UI; keine Konfigurationsdatei-Edits im Container nötig (→ [deployment/04](../deployment/04-configuration-reference.md)) |
| NFR-052 | Zero-Downtime-fähige Upgrades unter Kubernetes (Rolling Update, kompatible Migrationen); unter Compose kurze definierte Downtime zulässig |
| NFR-053 | Strukturierte Logs (JSON) auf stdout; keine Log-Dateien im Container; Request-ID-Korrelation |
| NFR-054 | Prometheus-kompatible Metriken; Health-/Readiness-Endpoints (→ [Runbook Monitoring](../deployment/runbooks/monitoring-alerting.md)) |
| NFR-055 | Backup-/Restore-Verfahren dokumentiert und getestet (PostgreSQL + Storage + Konfiguration) |
| NFR-056 | Horizontal skalierbar: Backend und Worker stateless (Sessions in Redis, Dateien im Storage-Backend) |

## 7. Internationalisierung (Inhalte)

| ID | Anforderung |
|---|---|
| NFR-060 | Content-Sprachen als BCP-47-Codes (`de`, `en`, `pt-BR`, …); Plattform macht keine Annahmen über eine feste Sprachliste |
| NFR-061 | Unicode durchgängig (UTF-8 in DB, API, Suche); Suche funktioniert diakritika-tolerant |
| NFR-062 | RTL-Sprachen: Layout-Grundlagen vorbereitet (logische CSS-Properties im Design System), vollständiger RTL-Support nach 1.0 |

## 8. Lizenz- & Compliance-Rahmen

| ID | Anforderung |
|---|---|
| NFR-070 | Software unter AGPLv3; alle Abhängigkeiten müssen AGPLv3-kompatibel sein (License-Check in CI) |
| NFR-071 | Nutzerinhalte unter CC BY-SA; Attribution (Autoren, Übersetzer) wird technisch abgebildet und angezeigt |
| NFR-072 | Branding/Trademark getrennt von der Codebasis; White-Labeling der Instanz beeinträchtigt keine Lizenzpflichten |
