# Authorization Enforcement

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20 ·
**Modell:** [ADR-0008](../architecture/decisions/adr-0008-hybrid-rbac-abac.md) ·
**Fachregeln:** [services/authorization-service.md](../services/authorization-service.md)

## 1. Durchsetzungsebenen (Defense in Depth)

| Ebene | Mechanik | Fängt ab |
|---|---|---|
| 1 · Route-Guard | `@RequirePermission(key, {scope})` + `PermissionGuard`; Startup-Check erzwingt Deklaration oder `@Public()` (FR-AUTZ-008) | grobe Zugriffe, vergessene Absicherung |
| 2 · Service-Prüfung | `AccessDecisionPort.can(actor, permission, resource)` mit konkretem Objekt | objektbezogene Rechte (richtiger Space? richtige Org?) |
| 3 · Query-Filter | `getAccessibleScopeIds` in Listen/Suche — Filter ist Teil der Query (S-1) | Leaks über Aufzählung |
| 4 · DB-Constraints | FKs, Uniques, CHECKs | Konsistenzfehler als letzte Linie |

**Regel E-1 (MUSS):** Ebene 2 ist für jeden Objektzugriff verpflichtend, auch wenn Ebene 1
bereits eine Permission prüfte — der Guard kennt das Objekt nicht (Scope-Auflösung erst im
Service).

## 2. IDOR-Prävention

- Objektzugriffe laden **immer** über (ID + Kontext) und prüfen die Zugehörigkeit
  (Artikel→Space→Sichtbarkeit; Kommentar→Artikel; Media→Owner/Verwendung) — nie „ID allein
  genügt".
- **404-Semantik:** Wo Existenz vertraulich ist (private Spaces/Orgs K-1/O-5), antworten
  fehlende Rechte mit 404, identisch zu „existiert nicht" (Timing angeglichen).
- UUIDs sind nicht erratbar, aber **kein** Schutzmechanismus — jede ID gilt als potenziell
  bekannt.
- Batch-/Bulk-Endpunkte prüfen jedes Element einzeln (`canBulk`), Teilergebnisse statt
  Alles-oder-Leak.

## 3. Owner-Kurzschlüsse (A-8)

„Autor darf eigenen Draft bearbeiten" u. ä. sind erlaubt, MÜSSEN aber: im Service explizit
implementiert, in der Service-Doku gelistet und durch Tests abgedeckt sein — und ergänzen
`can()`, ersetzen es nie (Moderations-/Policy-Denies greifen weiterhin).

## 4. Suche, Facetten, Zähler, Nebenkanäle

- Sichtbarkeitsfilter in **jeder** Meilisearch-Query inkl. Facetten (S-1); Suggest ebenso.
- Aggregierte Zähler (Space-Artikelzahl, Profil-Statistiken) zählen nur, was der Betrachter
  sehen dürfte, oder werden bewusst als „öffentliche Zahl" deklariert (Review-Pflicht).
- Fehlerdifferenzen, Timing und `Location`-Header dürfen Existenz nicht verraten
  (Timing-Angleichung bei 404-Schutzpfaden).

## 5. Frontend-Verhältnis

`useCan()` steuert nur Sichtbarkeit von UI-Elementen (UX). Jede Mutation wird serverseitig
erneut geprüft; E2E-Tests führen Negativfälle direkt gegen die API aus (nicht nur durch die
UI), um „nur im Frontend versteckt" zu erkennen.

## 6. Testpflichten (NFR-042)

- Entscheidungskern (`can`, Policy-Evaluation): ≥ 95 % Branch-Coverage + Property-Tests
  (zufällige Policy-Kombinationen: `deny` gewinnt immer; Default deny).
- Pro Modul: Autorisierungs-Testmatrix (Rolle × Aktion × Scope) für alle Endpunkte —
  Vorlage in [testing/02](../testing/02-backend-testing.md).
- Leak-Suiten: private Inhalte unsichtbar über API-Listen, Suche, Facetten, Suggest,
  Sitemap, Profil-Beitragslisten ([testing/scenarios](../testing/scenarios/organization-enterprise.md)).
- Eskalations-Suite: A-10-Szenarien (Selbst-Zuweisung, letzte Admin-Rolle, Scope-Ausbruch).

## 7. Cache-Sicherheit

AuthZ-Cache (60 s TTL) wird bei `assignment.changed`, Gruppen-/Org-/Policy-Änderungen sofort
invalidiert; Kontosperrung umgeht den Cache (Status-Check an Session). Kein Caching von
Entscheidungen über Nutzergrenzen hinweg; Cache-Keys enthalten Nutzer + Scope-Version.
