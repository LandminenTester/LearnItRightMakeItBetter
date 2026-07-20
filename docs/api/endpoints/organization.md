# API · organization

**Fachregeln:** [services/organization-service.md](../../services/organization-service.md) ·
**Stories:** [E-08](../../requirements/epics/e-08-organizations-teams/user-stories.md)

Modul-Flag `organization`. Private Orgs: 404 für Nicht-Mitglieder (O-5).

## Organisationen

| Methode | Pfad | Permission | Beschreibung |
|---|---|---|---|
| GET | `/orgs` | — | Öffentliche Organisationen (Suche/Filter) |
| POST | `/orgs` | `organization.organization.create` | Gründung (Ersteller wird Owner, O-1) |
| GET | `/orgs/:slug` | sichtbarkeitsabhängig | Profilseite (Spaces/Projekte/Mitglieder gemäß Einstellungen) |
| PATCH | `/orgs/:slug` | `organization.organization.manage` (Org) | Name, Beschreibung, Logo, Sichtbarkeit, Settings |
| POST | `/orgs/:slug/slug` | `organization.organization.manage` + Re-Auth | Slug ändern (Redirect O-7) |
| DELETE | `/orgs/:slug` | `org.owner` + Re-Auth + Namensbestätigung | Löschung mit Entscheid über Spaces/Projekte (O-6, Soft-Delete 14 Tage) |

## Mitglieder & Einladungen

| Methode | Pfad | Permission | Beschreibung |
|---|---|---|---|
| GET | `/orgs/:slug/members` | Org-Mitglied (bzw. öffentlich je Einstellung) | Mitgliederliste + Rollen |
| POST | `/orgs/:slug/invites` | `organization.member.manage` (Org) | Einladung (E-Mail oder Handle, Rolle; O-3) |
| GET/DELETE | `/orgs/:slug/invites[/:id]` | `organization.member.manage` | Offene Einladungen verwalten |
| POST | `/invites/:token/accept` · `/decline` | auth (bzw. Registrierung im Flow) | Annahme/Ablehnung |
| DELETE | `/orgs/:slug/members/:userId` | `organization.member.manage` | Entfernen (O-4; letzter Owner geschützt O-2) |
| POST | `/orgs/:slug/leave` | Org-Mitglied | Austritt (letzter Owner geschützt) |
| POST | `/orgs/:slug/transfer-ownership` | `org.owner` + Re-Auth | Owner-Übergabe |
| POST | `/orgs/:slug/assignments` | `authorization.assignment.assign` (Org) | Org-Rollen vergeben (Admin/Member/Custom) |

## Teams

| Methode | Pfad | Permission | Beschreibung |
|---|---|---|---|
| GET/POST | `/orgs/:slug/teams` | Mitglied / `organization.team.manage` | Liste/anlegen (Spiegelgruppe automatisch) |
| GET/PATCH/DELETE | `/orgs/:slug/teams/:teamSlug` | `organization.team.manage` | Details/ändern/löschen |
| PUT/DELETE | `/orgs/:slug/teams/:teamSlug/members/:userId` | `organization.team.manage` | Team-Mitgliedschaft (hält Gruppe synchron) |
