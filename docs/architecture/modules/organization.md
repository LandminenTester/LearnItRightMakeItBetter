# Modul-Landkarte · organization

**Zweck:** Mandantenähnliche Einheiten — Organisationen mit Mitgliedern (Einladungs-Lifecycle),
Teams (als Rechteträger via Gruppen), Org-Profilseiten; Grundlage für Org-Spaces, Org-Projekte
und Enterprise-Governance.

## Datenhoheit

`Organization`, `OrganizationMember`, `Team`, `TeamMember`, `OrganizationInvite`

## Kanten

| Richtung | Beziehung |
|---|---|
| nutzt | `identity` (Konten), `authorization` (Org-Scope-Rollen, Team↔Gruppe), `media` (Logo), `notification` (Einladungen), `audit`, `configuration` |
| wird genutzt von | `authorization` (Mitgliedschafts-Attribute), `knowledge` (Org-Spaces), `repository` (Org-Projekte) |
| publiziert | `organization.created/deleted`, `organization.member.invited/joined/left/removed`, `organization.team.changed` |

## Themenbereich-Dokumente

| Aspekt | Dokument |
|---|---|
| Spezifikation (Regeln O-1…O-7) | [services/organization-service.md](../../services/organization-service.md) |
| Epic + Stories | [E-08 Organisationen & Teams](../../requirements/epics/e-08-organizations-teams/README.md) |
| Datenbankschema | [database/schemas/organization.md](../../database/schemas/organization.md) |
| API-Endpunkte | [api/endpoints/organization.md](../../api/endpoints/organization.md) |
| E2E-Szenario | [testing/scenarios/organization-enterprise.md](../../testing/scenarios/organization-enterprise.md) |
