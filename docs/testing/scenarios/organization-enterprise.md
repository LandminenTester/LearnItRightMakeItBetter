# E2E-Szenarien · Organisationen & Enterprise-Rechte

**Epics:** E-08, E-03 · Schwerpunkt: private Inhalte bleiben privat (Leak-Vollprüfung)

## OE-01 · Org-Gründung bis privater Space — US-08-01, US-08-04

Member gründet private Org (wird Owner) → legt Org-Space (`organization`-Sichtbarkeit) mit
Artikel an → **Leak-Vollprüfung** als anonym + fremder Member: Org-URL 404, Space-URL 404,
Artikel-URL 404, Suche/Suggest/Facetten 0 Treffer, Sitemap enthält nichts, Profil-Beitragsliste
des Autors zeigt den Artikel Fremden nicht (P-7-Filter). Alle Prüfungen zusätzlich als direkte
API-Calls.

## OE-02 · Einladung & Mitgliedschaft — US-08-02

Einladung an neue E-Mail (Modus `invite_only` aktiv) → Konto über Einladungslink → nach
Annahme: Zugriff auf Org-Space binnen 60 s (AuthZ-Cache) → Entfernen des Mitglieds ⇒ Zugriff
sofort weg (API 404), Team-/Rollen-Reste bereinigt (O-4), Audit-Einträge vorhanden. Letzter
Owner: Austritt blockiert bis Übergabe (US-08-02.4).

## OE-03 · Teams als Rechteträger — US-08-03, US-03-02

Team „Docs" als Maintainer des Org-Space (Rolle an Spiegelgruppe) → Teammitglied sieht
Review-Queue-Eintrag; Nutzer verlässt Team ⇒ Queue leer + `manage`-Aktionen 403; Beitritt
stellt Rechte wieder her — ohne einzelne Zuweisungen.

## OE-04 · Custom-Rolle + Permission-Editor — US-03-03

Org-Admin baut Rolle „Doku-Kurator" im Editor (Kern-Permissions einer Systemrolle sichtbar
gesperrt) → Zuweisung an Mitglied → genau die gewährten Aktionen funktionieren, alle anderen
403; Rollen-Löschung zeigt betroffene Zuweisungen.

## OE-05 · Eskalations-Sperren — US-03-06

Space-Maintainer versucht per API sich selbst `platform.admin` zuzuweisen ⇒ 403 + Audit
`authz.escalation.blocked`; letzte `platform.admin`-Zuweisung entfernen ⇒ 409/403 mit
Erklärung (A-3).

## OE-06 · ABAC-Policy (Phase 3) — US-03-04

Deny-Policy „publish nur mit MFA": Maintainer ohne MFA ⇒ 403 `mfa_required`-artige
Begründung trotz Rolle; nach MFA-Einrichtung klappt Publikation; Policy deaktiviert ⇒ wieder
ohne (Testreihenfolge isoliert).

## OE-07 · Effektive-Rechte-Auskunft (Phase 3) — US-03-05

Auskunfts-Ansicht eines Nutzers zeigt Permission mit Herkunft (direkte Rolle vs. Gruppe
„Docs" vs. Policy) konsistent zu den in OE-03/04 aufgebauten Zuständen.

## OE-08 · Org-Löschung — O-6

Owner löscht Org (Re-Auth + Namensbestätigung, Entscheid „Spaces löschen") ⇒ Soft-Delete:
Inhalte sofort unzugänglich (404), Plattform-Admin kann binnen Fenster reaktivieren;
nach Purge-Job (Zeit gefakt) endgültig weg; Audit-Kette vollständig.
