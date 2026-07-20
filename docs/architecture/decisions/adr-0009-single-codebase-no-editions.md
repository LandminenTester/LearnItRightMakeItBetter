# ADR-0009: Eine Codebasis, Konfiguration statt Editionen

**Status:** Akzeptiert · **Datum:** 2026-07-20

## Kontext

Vergleichbare Produkte spalten sich in Community-/Professional-/Enterprise-Editionen mit
Feature-Gates. Das Fachkonzept (§4, §5) verbietet das ausdrücklich: Betriebsmodelle sind
**typische Einsatzprofile**, keine eingeschränkten Versionen; alle Funktionen bleiben überall
verfügbar. Die Software steht unter AGPLv3.

## Entscheidung

Es gibt genau **eine** Codebasis und **ein** Release-Artefakt. Unterschiede zwischen
Installationen entstehen ausschließlich durch:

- **Modul-Aktivierung** (FR-CONF-004) — fachliche Module an/aus,
- **Konfiguration** — Auth-Provider, Registrierungsmodus, Storage, Branding, Policies,
- **Daten** — Rollen, Gruppen, Spaces, Governance der Instanz.

Es DÜRFEN NIEMALS eingebaut werden: Lizenzschlüssel-Prüfungen, editionsabhängige Builds,
Telemetrie-Zwang, künstliche Limits (Nutzerzahlen, Modulverfügbarkeit).

## Betrachtete Alternativen

- **Open Core (Enterprise-Features proprietär)** — abgelehnt: widerspricht Vision und AGPLv3-
  Geist; SSO/Audit hinter Paywalls ist genau das Anti-Muster, das die Plattform vermeiden will.
- **Getrennte Distributionen (leichtgewichtig vs. voll)** — abgelehnt: doppelte Pflege;
  Modul-Flags erreichen dasselbe zur Laufzeit.

## Konsequenzen

- ✅ Jede Instanz kann jederzeit vom Community- ins Enterprise-Profil wachsen — ohne Migration
  auf „eine andere Version".
- ✅ Test-Matrix bleibt beherrschbar: getestet werden Modul-Flag-Kombinationen, nicht Editionen.
- ⚠️ Enterprise-Funktionen (ABAC, Audit-Vollausbau, OIDC) müssen so gebaut sein, dass sie
  deaktiviert **keinerlei** Komplexität in kleine Instanzen tragen (Guards + no-op-Handler,
  → [02-module-boundaries.md §7](../02-module-boundaries.md)).
- ⚠️ Finanzierungsmodelle des Projekts (Hosting, Support) dürfen die technische Gleichheit nicht
  aufweichen — außerhalb dieses Repos zu regeln (Trademark Policy).
