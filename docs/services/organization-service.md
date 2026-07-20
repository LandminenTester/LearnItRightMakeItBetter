# Organization Service

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20 ·
**FRs:** FR-ORGA-001…008 · **Epic:** [E-08](../requirements/epics/e-08-organizations-teams/README.md) ·
**Schema:** [database/schemas/organization.md](../database/schemas/organization.md)

## 1. Zweck & Verantwortlichkeiten

Mandantenähnliche Einheiten innerhalb einer Instanz:

- Organisationen (Slug, Profil, Sichtbarkeit `public`/`private`)
- Mitgliedschaften inkl. Einladungs-Lifecycle
- Teams als benannte Untergruppen
- Bereitstellung der Org-Attribute für ABAC (`user.orgIds`) und Space-Zuordnung
- Org-Profilseite (öffentlich, sofern `public`)

## 2. Abgrenzung

| Nicht hier | Sondern |
|---|---|
| Org-Rollen/Rechte-Mechanik | `authorization` (Systemrollen `org.owner/admin/member`, Scope `organization`) |
| Org-Spaces und deren Inhalte | `knowledge` (Space trägt `orgId`) |
| Org-Projekte | `repository` (Project trägt `ownerType='org'`) |
| Logo-Dateiverwaltung | `media` |

## 3. Domänenmodell

- `Organization` — `slug` (unique, Regeln wie Handles + reservierte Namen), `name`,
  `description` (Markdown-Subset), `logoMediaId?`, `visibility`, `settings` (JSON:
  `membersListVisibility`, Defaults für neue Spaces).
- `OrganizationMember` — (`orgId`, `userId`) unique, `status` (`invited`|`active`), `joinedAt`.
  Rechte laufen über RoleAssignments im Org-Scope.
- `Team` — (`orgId`, `slug`) unique, `name`, `description?`. `TeamMember` (`teamId`, `userId`).
  Technisch ist jedes Team auch eine `authorization`-Gruppe (`Group.teamId`-Referenz), damit
  Teams Rollen tragen können (US-08-03).
- `OrganizationInvite` — E-Mail **oder** `userId`, `tokenHash`, `invitedById`, vordefinierte
  Rolle (Default `org.member`), `expiresAt`, `status`.

## 4. Fachliche Regeln

- **O-1:** Gründung: Ersteller wird `org.owner` (via `AuthorizationAdminPort`); Org-Erstellung
  erfordert `organization.organization.create` (Default: `platform.member`, instanzweit
  abschaltbar).
- **O-2:** Owner-Invariante: mindestens ein aktives Mitglied mit `org.owner`; letzter Owner kann
  weder austreten noch degradiert werden — zuerst Übergabe (US-08-02.4).
- **O-3:** Einladungen: Annahme verknüpft Konto (bestehend oder neu — Einladung wirkt als
  Registrierungs-Token auch bei `invite_only`); Ablehnung/Ablauf beendet den Vorgang. Bis zur
  Annahme keinerlei Zugriff.
- **O-4:** Entfernen/Austritt: RoleAssignments und Team-Mitgliedschaften des Nutzers im
  Org-Scope werden entfernt, Event invalidiert AuthZ-Cache; persönliche Beiträge in Org-Spaces
  bleiben (Attribution).
- **O-5:** Private Organisationen: Existenz wird nicht preisgegeben (404 für Nicht-Mitglieder,
  keine Suche, keine Facetten).
- **O-6:** Löschung einer Organisation (nur `org.owner`, Re-Auth + Namensbestätigung):
  Org-Spaces werden archiviert-übertragen oder gelöscht gemäß explizitem Owner-Entscheid im
  Lösch-Dialog; Projekte werden gelöscht oder an einen Nutzer übertragen. Vorgang auditiert;
  Soft-Delete-Fenster 14 Tage (reaktivierbar durch Plattform-Admin).
- **O-7:** Slug-Änderung analog Handles (Redirect 90 Tage, Sperrfrist).

## 5. Schnittstellen

**API (Auszug):** `/orgs` (create/list public), `/orgs/:slug` (Profil), `/orgs/:slug/members`,
`/orgs/:slug/invites`, `/orgs/:slug/teams`, `/orgs/:slug/settings`.

**Publizierte Events:** `organization.created` / `deleted`, `organization.member.invited` /
`joined` / `left` / `removed`, `organization.team.changed`.

**Ports:** `OrganizationPort.getMembershipIds(userId)` (ABAC-Attribut, gecacht),
`OrganizationPort.isMember(orgId, userId)`, `OrganizationPort.getOrgRef(orgId)` (Anzeige).

## 6. Hintergrundjobs

`invite-gc` (maintenance): abgelaufene Einladungen bereinigen; `org-purge` (maintenance):
endgültige Löschung nach Soft-Delete-Fenster.

## 7. Konfiguration

Modul-Flag `organization`; Org-Erstellung offen/nur-Admin; Default-Sichtbarkeiten.

## 8. Sicherheit

Alle Member-/Team-/Settings-Endpunkte prüfen Org-Scope-Permissions; Einladungs-Tokens gehasht;
Enumeration-Schutz auf Einladungs-Endpunkten. Org-Löschung ist die destruktivste Aktion des
Systems → Re-Auth, Bestätigung, Audit, Soft-Delete (O-6).

## 9. Offene Punkte

- Übertragbarkeit von Spaces zwischen Organisationen — nach 1.0.
- SCIM-/Verzeichnis-Sync für Enterprise — nach 1.0 (Schnittstelle für Gruppen-Mapping in
  `authorization` vorbereitet).
