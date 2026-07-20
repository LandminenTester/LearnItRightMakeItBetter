# E-01 · Plattform-Foundation & Setup

**Status:** Verbindlich · **Phase:** 0–1 · **Priorität:** Must ·
**Module:** [configuration](../../../services/configuration-service.md) ·
**FRs:** FR-CONF-001…007 · **Stories:** [user-stories.md](user-stories.md)

## Ziel

Eine frische Installation ist ohne Handbuch-Studium in **unter 30 Minuten** betriebsbereit und
sicher konfiguriert (NFR-050). Der Setup Wizard prüft alle Abhängigkeiten, erzwingt sichere
Defaults und hinterlässt einen administrierbaren Zustand inkl. Recovery-Vorsorge. Danach steuert
die Instanzkonfiguration (Module, Policies, Branding) das Verhalten der gesamten Plattform —
**Konfiguration statt Editionen** ([ADR-0009](../../../architecture/decisions/adr-0009-single-codebase-no-editions.md)).

## Scope

**Enthalten:**

- Setup Wizard: System-Checks (Docker-Umgebung, Ressourcen, Port-/Dienst-Erreichbarkeit),
  Datenbank (Verbindung + Migrationen), Storage (Lese-/Schreibtest), OAuth (Verbindung +
  Redirect-Prüfung), Security-Defaults — Ablauf → [deployment/05](../../../deployment/05-setup-wizard.md)
- Admin-Erstellung + Recovery-Setup als Abschlussschritt
- Instanzeinstellungen (Name, Branding, Sprachen, Theme-Default)
- Modul-Aktivierung (Feature-Flags) und Plattform-Policies (Registrierungsmodus,
  Sichtbarkeits-Defaults, Review-Pflicht-Default)
- Konfigurations-Präzedenz ENV > DB, verschlüsselte Secret-Ablage

**Nicht enthalten:** Deployment-Automatisierung selbst (→ [deployment/](../../../deployment/README.md)),
Recovery-Durchführung im Betrieb (→ [E-13](../e-13-operations-recovery/README.md)).

## Abhängigkeiten

| Richtung | Bezug |
|---|---|
| Benötigt | Backend-Skelett, Migrationen (Phase 0), Design System für Wizard-UI (E-14) |
| Blockiert | praktisch alle Epics — ohne Setup keine konfigurierte Instanz |

## Erfolgsmetriken

- Frische Referenz-Installation → abgeschlossenes Setup in < 30 min (gemessen im Release-Test)
- 0 manuelle Datei-Edits im Container nötig (NFR-051)
- Jeder Wizard-Fehlerzustand hat eine konkrete, handlungsleitende Meldung

## Risiken & Gegenmaßnahmen

| Risiko | Gegenmaßnahme |
|---|---|
| Wizard als Angriffsfläche vor erstem Admin | Setup-Route nur bei `setupCompleted = false`; nach Abschluss 403 + Audit (US-01-05) |
| Fehlkonfiguration blockiert Instanz dauerhaft | jeder Schritt einzeln wiederholbar; CLI-Fallback `setup:reset-step` |
| ENV/DB-Konfusion („warum greift mein Wert nicht?") | UI zeigt ENV-überschriebene Werte als schreibgeschützt mit Herkunft an |
