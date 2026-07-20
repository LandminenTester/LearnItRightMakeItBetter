# Vorlage · Modul-Dokumentation

Für neue Module (ADR-pflichtig!) oder größere Erweiterungen bestehender. Zwei Artefakte —
Gliederungen exakt einhalten (Konsistenz der 12 bestehenden Module).

## 1. Service-Spezifikation (`docs/services/<modul>-service.md`)

```markdown
# <Modul> Service

**Status:** Entwurf · **Version:** 0.1 · **Stand:** JJJJ-MM-TT ·
**FRs:** FR-XXXX-… · **Epic:** [E-XX](…) · **Schema:** [database/schemas/<modul>.md](…)

## 1. Zweck & Verantwortlichkeiten
<!-- Was das Modul besitzt (Datenhoheit) und leistet — Stichpunkte. -->

## 2. Abgrenzung
| Nicht hier | Sondern |

## 3. Domänenmodell
<!-- Entitäten + Mermaid-ER bei ≥ 3 Beziehungen; Details in Schema-Referenz. -->

## 4. Fachliche Regeln
<!-- Nummerierte, testbare Regeln mit Modulpräfix (X-1, X-2 …) — Herzstück. -->

## 5. Schnittstellen
<!-- API-Auszug (Details → api/endpoints/<modul>.md), publizierte/konsumierte Events, Ports. -->

## 6. Hintergrundjobs
| Job | Queue | Zweck |

## 7. Konfiguration
<!-- ENV + Instanzeinstellungen; Verweis deployment/04. -->

## 8. Sicherheit
<!-- Modulspezifische Risiken + Pflichtprüfungen; Threat-Model-Eintrag prüfen. -->

## 9. Offene Punkte
```

## 2. Modul-Landkarte (`docs/architecture/modules/<modul>.md`)

```markdown
# Modul-Landkarte · <modul>

**Zweck:** <!-- 2–3 Sätze. -->

## Datenhoheit
<!-- Tabellenliste. -->

## Kanten
| Richtung | Beziehung |
<!-- nutzt / wird genutzt von / publiziert / konsumiert — konsistent zur
     Abhängigkeitsmatrix architecture/02 (Matrix im selben PR erweitern!). -->

## Themenbereich-Dokumente
| Aspekt | Dokument |
<!-- Spezifikation, Epic, Schema, API, Security, Flows. -->
```

## 3. Pflicht-Begleitänderungen (Checkliste)

- [ ] ADR für das neue Modul akzeptiert
- [ ] [architecture/02](../../architecture/02-module-boundaries.md): Modulliste +
      Abhängigkeitsmatrix + ggf. Event-Katalog erweitert
- [ ] [database/schemas/README](../../database/schemas/README.md) + neues Schema-Dokument
- [ ] [api/endpoints/README](../../api/endpoints/README.md) + neues Endpunkt-Dokument
- [ ] Permission-Katalog (`shared-types`) + [authorization-service.md](../../services/authorization-service.md)-Systemrollen geprüft
- [ ] [Audit-Katalog](../../security/07-audit-logging.md) um Pflicht-Events ergänzt
- [ ] Epics/Stories angelegt ([requirements/epics/](../../requirements/epics/README.md))
- [ ] services/README- und Landkarten-Index-Tabellen erweitert
```
