# E-12 · Audit & Compliance

**Status:** Verbindlich · **Phase:** 1–3 · **Priorität:** Must ·
**Module:** [audit](../../../services/audit-service.md), [identity](../../../services/identity-service.md) (DSGVO-Lifecycle) ·
**FRs:** FR-AUDT-001…006, FR-IDNT-018 · **Stories:** [user-stories.md](user-stories.md)

## Ziel

Sicherheits- und governance-relevante Vorgänge sind **lückenlos, unveränderlich und
auswertbar** protokolliert (Enterprise-Anforderung), und die Instanz erfüllt die
DSGVO-Betroffenenrechte (Auskunft, Export, Löschung) technisch sauber.

## Scope

**Enthalten:**

- Append-only Audit-Log mit strukturiertem Ereignisformat (Actor, Aktion, Ressource, Kontext)
- Basiskatalog (Phase 1): Auth-Ereignisse, Rechteänderungen, Admin-Aktionen, Setup/Recovery,
  Konfigurationsänderungen; erweiterter Katalog (Phase 3) zuschaltbar
- Audit-Viewer mit Filtern (Zeitraum, Actor, Aktion, Ressource), Export CSV/JSON
- Retention-Konfiguration mit automatischer Bereinigung
- DSGVO-Werkzeuge: Datenexport (Auskunft), Lösch-/Anonymisierungskaskade
  (→ [database/06](../../../database/06-data-lifecycle-gdpr.md))

**Nicht enthalten:** SIEM-Integration (über Log-Export/stdout möglich, kein eigenes Feature),
revisionssichere externe Archivierung (Betreiber-Verantwortung, Runbook-Hinweis).

## Abhängigkeiten

Alle Module liefern Ereignisse über den `audit.record`-Port (Regel M-4). Der Ereigniskatalog
ist in [security/07](../../../security/07-audit-logging.md) verbindlich definiert.

## Erfolgsmetriken

- 100 % der in security/07 als Pflicht markierten Ereignisse werden erzeugt (Testsuite)
- Audit-Schreibpfad übersteht Lastspitzen ohne Requests zu blockieren (asynchron, verlustfrei)
- DSGVO-Export enthält alle personenbezogenen Daten eines Kontos (Vollständigkeitstest)

## Risiken & Gegenmaßnahmen

| Risiko | Gegenmaßnahme |
|---|---|
| Audit-Log als Datenschutzrisiko (IP, Verhalten) | Retention-Pflicht, Zugriff nur mit `audit.event.read`, IP-Speicherung konfigurierbar kürzbar |
| Manipulation durch Admins | kein Update-/Delete-Pfad in der Anwendung; DB-Rechte-Härtung im Deployment dokumentiert |
| Ereignis-Inflation macht Log unlesbar | kuratierter Katalog, Severity-Stufen, erweiterter Katalog opt-in |
