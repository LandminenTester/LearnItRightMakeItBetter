# API · authorization

**Fachregeln:** [services/authorization-service.md](../../services/authorization-service.md) ·
**Stories:** [E-03](../../requirements/epics/e-03-authorization/user-stories.md)

## Rollen & Permissions

| Methode | Pfad | Permission | Beschreibung |
|---|---|---|---|
| GET | `/admin/permissions` | `authorization.role.read` | Katalog (gruppiert nach Modul, inkl. Beschreibungen) |
| GET | `/admin/roles` | `authorization.role.read` | Rollen inkl. Zuweisungszahl |
| POST | `/admin/roles` | `authorization.role.manage` | Custom-Rolle anlegen |
| GET/PATCH/DELETE | `/admin/roles/:id` | `authorization.role.manage` | Details/ändern/löschen (Systemrollen-Schutz A-3; Löschen zeigt betroffene Zuweisungen) |
| PUT | `/admin/roles/:id/permissions` | `authorization.role.manage` | Permission-Set ersetzen (Kern-Permissions gesperrt) |

## Zuweisungen

| Methode | Pfad | Permission | Beschreibung |
|---|---|---|---|
| GET | `/admin/assignments` | `authorization.assignment.read` | Filter: principal, Rolle, Scope |
| POST | `/admin/assignments` | `authorization.assignment.assign` (im Ziel-Scope) | Rolle an User/Gruppe zuweisen (Eskalations-Sperre A-10) |
| DELETE | `/admin/assignments/:id` | `authorization.assignment.assign` (im Ziel-Scope) | Entziehen (letzte `platform.admin`-Zuweisung geschützt A-3) |

Scope-gebundene Vergabe existiert zusätzlich kontextuell: `POST /spaces/:slug/assignments`,
`POST /orgs/:slug/assignments`, `POST /languages/:locale/assignments` — gleiche Semantik,
Scope implizit.

## Gruppen

| Methode | Pfad | Permission | Beschreibung |
|---|---|---|---|
| GET/POST | `/admin/groups` | `authorization.group.read` / `manage` | Liste/anlegen |
| GET/PATCH/DELETE | `/admin/groups/:id` | `authorization.group.manage` | Details (Team-Spiegelgruppen readonly hier) |
| PUT/DELETE | `/admin/groups/:id/members/:userId` | `authorization.group.manage` | Mitglied hinzufügen/entfernen |

## Policies (ABAC, Phase 3)

| Methode | Pfad | Permission | Beschreibung |
|---|---|---|---|
| GET/POST | `/admin/policies` | `authorization.policy.read` / `manage` | Liste/anlegen (Bedingungs-Validierung A-6) |
| GET/PATCH/DELETE | `/admin/policies/:id` | `authorization.policy.manage` | Details/ändern (enable/disable)/löschen |

## Auskunft

| Methode | Pfad | Permission | Beschreibung |
|---|---|---|---|
| GET | `/admin/users/:id/effective-permissions` | `authorization.assignment.read` | Effektive Rechte inkl. Herkunft + Scope (FR-AUTZ-010) |
| GET | `/users/me/effective-permissions` | auth | Eigene effektive Rechte (Scope-Parameter optional) |
