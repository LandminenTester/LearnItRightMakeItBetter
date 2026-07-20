# E-08 · User Stories

**Epic:** [README.md](README.md) · Fachregeln: [organization-service.md](../../../services/organization-service.md)

## US-08-01 · Studio abbilden (P5 Deniz) — FR-ORGA-001, 003 · Must

> Als Tech Lead möchte ich unsere Organisation anlegen und verwalten, damit internes Wissen
> strukturiert und geschützt ist.

1. **Gegeben** die Org-Erstellung (Slug, Name, Sichtbarkeit), **wenn** ich sie abschließe,
   **dann** bin ich `org.owner` und die Org-Verwaltung steht bereit.
2. **Gegeben** eine private Organisation, **wenn** ein Nicht-Mitglied `/o/<slug>` aufruft,
   **dann** erhält es 404 ohne Existenz-Preisgabe.
3. **Gegeben** Logo-Upload, **dann** läuft er über die Media-Pipeline (Varianten, FR-MEDI-001).

## US-08-02 · Mitglieder einladen (P5 Deniz) — FR-ORGA-002 · Must

1. **Gegeben** eine Einladung per E-Mail an eine Nicht-Nutzerin, **wenn** sie den Link öffnet,
   **dann** kann sie ein Konto erstellen (auch bei Registrierungsmodus `invite_only`) und wird
   nach Annahme Mitglied.
2. **Gegeben** eine Einladung an einen bestehenden Handle, **dann** erhält er In-App +
   E-Mail-Benachrichtigung und kann annehmen/ablehnen; bis zur Annahme keinerlei Org-Zugriff.
3. **Gegeben** mein Austritt bzw. meine Entfernung, **dann** verliere ich sofort alle
   Org-Rechte (Event → AuthZ-Cache) und der Vorgang ist auditiert.
4. **Gegeben** der letzte Owner, **wenn** er austreten will, **dann** verlangt das System zuvor
   eine Owner-Übergabe.

## US-08-03 · Teams & Verantwortlichkeiten (P5 Deniz) — FR-ORGA-004, 007 · Should

1. **Gegeben** Team „Docs-Team" als Maintainer des Space „Interne Standards", **wenn** ein
   Artikel eingereicht wird, **dann** erscheint er in der Review-Queue aller Teammitglieder
   (Team = Gruppe mit Rolle im Space-Scope).
2. **Gegeben** ein Teamwechsel eines Mitglieds, **dann** wandern die teamgebundenen Rechte mit
   (US-03-02 sinngemäß).

## US-08-04 · Org-Wissensbereiche (P5 Deniz) — FR-ORGA-005 · Must

1. **Gegeben** ein Org-Space mit Sichtbarkeit `organization`, **wenn** ein Org-Mitglied ihn
   öffnet, **dann** hat es Lesezugriff (`org.member`); Nicht-Mitglieder erhalten 404.
2. **Gegeben** ein öffentlicher Org-Space, **dann** erscheint er auf der Org-Profilseite und in
   der öffentlichen Suche (Open-Source-Beteiligung des Studios).

## US-08-05 · Organisation präsentieren (P4 Sofia / P5 Deniz) — FR-ORGA-006, 008 · Should

1. **Gegeben** eine öffentliche Organisation, **wenn** jemand `/o/<slug>` öffnet, **dann** sieht
   er Beschreibung, öffentliche Spaces, Projekte und (gemäß Einstellung) Mitglieder.
2. **Gegeben** Org-Projekte mit Repo-Verknüpfung, **dann** zeigen sie live synchronisierte
   Metadaten (E-09).
