# Modul-Landkarte · authorization

**Zweck:** Zentrale Zugriffsentscheidung — hybrides RBAC + ABAC: Permission-Katalog, System-/
Custom-Rollen mit Scopes (`global`/`organization`/`space`/`language`), Gruppen, Policies,
`AccessDecisionService` als einziger Entscheidungspunkt, Entscheidungscache,
Berechtigungsauskunft.

## Datenhoheit

`Permission`, `Role`, `RolePermission`, `RoleAssignment`, `Group`, `GroupMember`, `Policy`

## Kanten

| Richtung | Beziehung |
|---|---|
| nutzt | `identity` (Subjekt-Attribute), `organization` (Mitgliedschafts-Attribute), `configuration`, `audit` |
| wird genutzt von | allen Modulen via `AccessDecisionPort` (`can`, `getAccessibleScopeIds`); Guards in `common/auth` |
| publiziert | `authorization.assignment.changed`, `authorization.role.changed`, `authorization.policy.changed`, `authorization.group.changed` |

## Themenbereich-Dokumente

| Aspekt | Dokument |
|---|---|
| Spezifikation (inkl. Systemrollen-Katalog) | [services/authorization-service.md](../../services/authorization-service.md) |
| Epic + Stories | [E-03 Authorization](../../requirements/epics/e-03-authorization/README.md) |
| Architekturentscheidung | [ADR-0008 Hybrid RBAC+ABAC](../decisions/adr-0008-hybrid-rbac-abac.md) |
| Datenbankschema | [database/schemas/authorization.md](../../database/schemas/authorization.md) |
| API-Endpunkte | [api/endpoints/authorization.md](../../api/endpoints/authorization.md) |
| Enforcement-Regeln | [security/03 Authorization Enforcement](../../security/03-authorization-enforcement.md) |
