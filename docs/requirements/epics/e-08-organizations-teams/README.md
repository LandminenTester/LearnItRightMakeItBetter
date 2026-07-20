# E-08 · Organisationen & Teams

**Status:** Verbindlich · **Phase:** 2 · **Priorität:** Must ·
**Module:** [organization](../../../services/organization-service.md) ·
**FRs:** FR-ORGA-001…008 · **Stories:** [user-stories.md](user-stories.md)

## Ziel

Studios, Communities und Unternehmen bilden sich als **Organisationen** ab: Mitglieder, Teams,
eigene (auch private) Wissensbereiche, Projektpräsentation und klare Verantwortlichkeiten —
vom internen Wiki (Organization Deployment) bis zur öffentlichen Präsenz.

## Scope

**Enthalten:**

- Organisationen (Slug, Name, Beschreibung, Logo, Sichtbarkeit `public`/`private`)
- Mitgliederverwaltung: Einladungen (E-Mail/Handle), Annahme, Entfernen, Austritt
- Org-Rollen als Systemrollen im Scope `organization` (Owner/Admin/Member)
- Teams mit Mitgliederlisten; Teams als Space-Verantwortliche
- Org-eigene Spaces (`Space.orgId`) inkl. Sichtbarkeit `organization`
- Öffentliche Org-Profilseite (Mitglieder, Spaces, Projekte — je nach Sichtbarkeit)

**Nicht enthalten:** Abrechnungs-/Vertragsdaten (kein Bestandteil der Plattform),
SCIM-Provisionierung (nach 1.0), Org-übergreifende Föderation (out of scope 1.0).

## Abhängigkeiten

Benötigt: E-02 (Konten), E-03 (Org-Scope-Rollen), E-04 (Spaces), E-11 (Einladungsmails).
Liefert Attribute an ABAC (`user.orgIds`) und Events an Audit/AuthZ-Cache.

## Erfolgsmetriken

- Org-Gründung → privater Space → Mitglied eingeladen → Zugriff funktioniert: E2E grün
  ([testing/scenarios](../../../testing/scenarios/organization-enterprise.md))
- 404-Verhalten privater Ressourcen ohne Existenz-Preisgabe in Tests nachgewiesen
- Mitgliedschaftsänderung wirkt auf effektive Rechte ≤ 60 s (Cache-Invalidierung)

## Risiken & Gegenmaßnahmen

| Risiko | Gegenmaßnahme |
|---|---|
| Verwaiste Organisationen (Owner weg) | letzter Owner nicht entfernbar; Owner-Übergabe-Flow; Plattform-Admin-Eingriff auditiert |
| Namens-/Slug-Squatting | Slug-Richtlinie, Moderations-Umbenennung, reservierte Namen |
| Sichtbarkeits-Fehlkonfiguration exponiert Interna | sichere Defaults (`private` für Org-Spaces), Sichtbarkeits-Badge in der UI überall |
