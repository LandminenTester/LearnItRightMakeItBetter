# E-13 · Betrieb, Recovery & Observability

**Status:** Verbindlich · **Phase:** 1–3 · **Priorität:** Must ·
**Module:** [configuration](../../../services/configuration-service.md), Querschnitt alle ·
**FRs:** FR-PLAT-005, FR-PLAT-006 · **Stories:** [user-stories.md](user-stories.md)

## Ziel

Betreiber führen die Instanz **sicher durch den Alltag und durch Störungen**: Health-/
Readiness-/Metrics-Endpoints, strukturierte Logs, dokumentierte Runbooks — und ein
Recovery-System (Admin-Recovery, CLI-Recovery, Emergency Access), das Aussperrungen ohne
Sicherheitskompromisse löst. Alle Recovery-Aktionen sind auditiert und nachvollziehbar
(Fachkonzept §17).

## Scope

**Enthalten:**

- `/healthz`, `/readyz`, `/metrics` (Prometheus) mit definierter Degradations-Semantik (NFR-014)
- Strukturierte JSON-Logs mit Request-Korrelation (NFR-053)
- Recovery-Wege:
  - **Admin-Recovery:** Recovery Codes des Admin-Kontos (aus Setup), Passwort-/MFA-Reset-Flows
  - **CLI-Recovery:** `platform recovery ...` im Container (nur mit Systemzugriff):
    Admin-Passwort-Reset, MFA-Entfernung, Emergency-Konto, Modul-Not-Aus
  - **Emergency Access:** zeitlich begrenztes Break-Glass-Konto mit Pflicht-Begründung
- Wartungsjobs (GC, Retention, Konsistenz-Checks) und deren Sichtbarkeit
- Betriebs-Runbooks (→ [deployment/runbooks/](../../../deployment/runbooks/README.md))

**Nicht enthalten:** Externes Monitoring/Alerting-Stack (Betreiber wählt; Runbook liefert
Empfehlungen), Backups selbst (Runbook + Betreiber).

## Abhängigkeiten

Benötigt: E-01 (Setup legt Recovery-Grundlagen), E-12 (Audit der Recovery-Aktionen).

## Erfolgsmetriken

- US-13-01 (Aussperrung) im Release-Test real durchgespielt < 15 min bis Zugriff
- Alle Runbook-Prozeduren einmal pro Release verifiziert
- `/metrics` deckt die NFR-Messgrößen ab (Latenzen, Queues, Jobs, DB-Pool)

## Risiken & Gegenmaßnahmen

| Risiko | Gegenmaßnahme |
|---|---|
| Recovery-Wege als Hintertür | CLI nur mit Container-/Systemzugriff; Emergency-Konten zeitlich begrenzt, unlöschbar auditiert, Benachrichtigung an alle Admins |
| Degradation unbemerkt | `/readyz`-Detailstatus, System-Warnungen (E-11) an Admins |
| Betriebsfehler durch fehlende Doku | Runbooks sind Release-Kriterium (Definition of Done des Epics) |
