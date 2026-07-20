# Backend-Testing

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20

## 1. Unit-Tests (`*.spec.ts` neben dem Code)

- Application-Services mit gemockten Ports (DI via `@nestjs/testing` oder direkte
  Konstruktion); `domain/`-Logik framework-frei pur.
- Pflichtgebiete: Zustandsautomaten (Artikel-/Übersetzungs-Lifecycle), Validierungsregeln,
  Policy-/Bedingungs-Evaluation (inkl. **Property-Tests** mit fast-check: Deny-Dominanz,
  Default-Deny, Wildcard-Auflösung), Dedupe-/Idempotenz-Schlüsselbildung (P-2, M-6),
  Markdown-Pipeline (Snapshot + **XSS-Corpus**: Payload-Sammlung darf nie durchsanitieren).

## 2. Integrationstests (`test/integration/` je Modul)

**Setup:** Testcontainers startet PostgreSQL 17, Redis 7, Meilisearch je Suite einmal
(global), Migrationen + base-Seed laufen; jede Testdatei arbeitet in isoliertem Schema bzw.
mit Truncate-Hook. Storage: `filesystem`-Adapter in tmp-Verzeichnis; S3-Adapter läuft in der
**Adapter-Contract-Suite** zusätzlich gegen MinIO-Container (E-10-Risiko „Adapter-Drift").

**Pflicht-Suiten je Modul:**

1. **HTTP-Ebene** (supertest gegen die Nest-App): Statuscodes, Problem-Details-Format,
   Pagination, Validierungsfehler (422-Feldpfade).
2. **AuthZ-Matrix** (§4).
3. **Event→Job→Wirkung:** z. B. `article.published` ⇒ `index-article`-Job ⇒ Dokument in
   Meilisearch mit korrekten Sichtbarkeitsfeldern; doppelte Job-Ausführung ⇒ identischer
   Endzustand (Idempotenz).
4. **Fachliche Kernflüsse** modulintern (Beispiele unten).

**Beispiele verbindlicher Fälle:**

| Modul | Fälle (Auszug) |
|---|---|
| identity | Enumeration-Gleichheit (Antwort + Timing-Toleranz), Session-Rotation bei Login, Recovery-Code-Einmaligkeit, Lockout nach 10 Fehlversuchen, JIT-Provisionierung je Registrierungsmodus |
| authorization | Cache-Invalidierung bei Rollenentzug (E-3-Risiko), Eskalations-Sperre A-10, letzte-Admin-Sperre A-3 |
| knowledge | K-7-Versionskonflikt (409), Review-Pflicht je Space-Konfiguration, Slug-Redirect-Kette, moderative Depublikation + Audit |
| translation | Outdated-Kaskade bei Original-Publish (T-3) inkl. Benachrichtigungs-Jobs, Selbst-Review-Verbot |
| media | Magic-Bytes-Reject, Pixel-Bomben-Abbruch, EXIF-Entfernung nachweisbar, Quota-Grenze, Orphan-Cleanup-Fristen |
| search | **Leak-Suite:** privater Space unsichtbar in Query/Facetten/Suggest; Sichtbarkeitswechsel ⇒ Reindex |
| notification | Präferenz-Filter, Security-Mail trotz Abbestellung, SMTP-Fehler ⇒ Retry ⇒ Dead-Letter |
| audit | Pflicht-Ereignisliste (AU-3-Abgleich gegen security/07-Katalog), Secret-Blockliste AU-4 |
| configuration | Setup-Guard vor/nach Abschluss, ENV-Präzedenz, verschlüsselte Settings nie im Klartext lesbar |

## 3. Job-/Worker-Tests

BullMQ im Testmodus mit manuellem `worker.run()`-Trigger (keine Timer); Repeatable-Logik
über direkte Handler-Aufrufe mit gefakter Zeit; Dead-Letter-Verhalten simuliert durch
injizierte Fehler (Retry-Zählung, finale Ablage).

## 4. AuthZ-Matrix (Vorlage)

Pro Modul eine Tabelle `Rolle/Kontext × Endpunkt ⇒ erwarteter Status`, ausgeführt als
parametrisierter Test. Mindestrollen: anonym, `platform.member`, Objekt-Autor,
`space.contributor/reviewer/maintainer` (im/außerhalb des Scopes!), `org.member/admin/owner`,
`platform.moderator`, `platform.admin`, PAT mit/ohne Scope. Erwartung enthält bewusst die
404-statt-403-Fälle (K-1/O-5).

## 5. Konventionen

- Testname = Verhalten + Regel-ID; AAA-Struktur; ein fachlicher Assert-Fokus pro Test.
- Keine Mocks für Prisma in Integrationstests (echte DB ist der Punkt); keine echten externen
  Dienste (GitHub/SMTP ⇒ Fake-Server: `msw`/nodemailer-Mock — GitHub-Adapter hat
  Aufzeichnungs-Fixtures).
- `pnpm test:unit` / `test:int` / `test:all` — CI-Verdrahtung in
  [05-quality-gates-performance.md](05-quality-gates-performance.md).
