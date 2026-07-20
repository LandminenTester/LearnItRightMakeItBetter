# Services — Modulspezifikationen

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20

Dieser Bereich spezifiziert die 12 Backend-Module des modularen Monolithen fachlich im Detail.
Architektur-Rahmen (Anatomie, Abhängigkeitsmatrix, Event-Regeln):
[architecture/02-module-boundaries.md](../architecture/02-module-boundaries.md).

## Module

| Modul | Spezifikation | Phase | Deaktivierbar |
|---|---|---|---|
| Identity | [identity-service.md](identity-service.md) | 1–3 | nein (Kern) |
| Authorization | [authorization-service.md](authorization-service.md) | 1–3 | nein (Kern) |
| Profile & Reputation | [profile-service.md](profile-service.md) | 1–2 | teilweise (Achievements) |
| Knowledge | [knowledge-service.md](knowledge-service.md) | 1–2 | nein (Kern); Kommentare abschaltbar |
| Translation | [translation-service.md](translation-service.md) | 2 | ja |
| Organization | [organization-service.md](organization-service.md) | 2 | ja |
| Search | [search-service.md](search-service.md) | 1–2 | nein (Kern) |
| Repository | [repository-service.md](repository-service.md) | 2 | ja |
| Media | [media-service.md](media-service.md) | 1–2 | nein (Kern) |
| Notification | [notification-service.md](notification-service.md) | 1–3 | nein (Kern) |
| Audit | [audit-service.md](audit-service.md) | 1–3 | nein (Kern) |
| Configuration | [configuration-service.md](configuration-service.md) | 1–2 | nein (Kern) |

> **Hinweis zur Modulliste:** Das Fachkonzept (§6) nennt 11 Module. `profile` wurde als 12. Modul
> ergänzt, damit Konzept-Kapitel 11 (Entwicklerprofile), Reputation und Achievements einen
> eindeutigen Eigentümer haben. Reputation entsteht ausschließlich event-getrieben — `knowledge`,
> `translation` und `repository` kennen das Profile-Modul nicht (→ Abhängigkeitsmatrix).

## Einheitliches Dokument-Template

Jede Spezifikation folgt dieser Gliederung:

1. **Zweck & Verantwortlichkeiten** — was das Modul besitzt (Datenhoheit) und leistet
2. **Abgrenzung** — was explizit *nicht* dazugehört (und wo es stattdessen liegt)
3. **Domänenmodell** — Entitäten und Beziehungen (Detailschema → [database/](../database/README.md))
4. **Fachliche Regeln** — Invarianten, Zustandsautomaten, Validierungen
5. **Schnittstellen** — API-Endpunkte (Kurzreferenz → [api/endpoints/](../api/endpoints/README.md)),
   Domain Events (publiziert/konsumiert), interne Ports
6. **Hintergrundjobs** — Queue-Jobs des Moduls
7. **Konfiguration** — ENV-/Instanz-Einstellungen des Moduls
8. **Sicherheit** — modulspezifische Risiken und Pflichtprüfungen
9. **Offene Punkte** — bekannte Entscheidungen, die während der Umsetzung zu treffen sind

## Verbindlichkeit

Die Regeln in Abschnitt „Fachliche Regeln" jeder Spezifikation sind Akzeptanzgrundlage für die
Implementierung; Abweichungen erfordern ein Update der Spezifikation im selben PR
(→ [development-guidelines/04](../development-guidelines/04-documentation-standards.md)).
