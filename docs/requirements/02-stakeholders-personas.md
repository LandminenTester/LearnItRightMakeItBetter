# Stakeholder & Personas

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20

## 1. Stakeholder-Übersicht

| Stakeholder | Interesse | Einfluss auf Anforderungen |
|---|---|---|
| Plattform-Betreiber (Self-Hoster) | Einfache Installation, Betrieb, Upgrades, Sicherheit | Setup Wizard, Deployment, Konfiguration, Recovery |
| Community-Mitglieder | Wissen finden, lernen, beitragen | Knowledge, Suche, Profile, Übersetzungen |
| Organisationen/Unternehmen | Internes Wissen, Governance, SSO, Compliance | Organization, Identity, Authorization, Audit |
| Open-Source-Maintainer | Projekte präsentieren, Doku pflegen | Repository-Integration, Spaces |
| Entwicklungsteam | Klare Anforderungen, wartbare Architektur | gesamtes Repository |
| Datenschutzverantwortliche | DSGVO-Konformität | Datenlebenszyklus, Audit, Security |

## 2. Personas

Personas sind fiktiv, aber verbindlicher Bezugspunkt für User Stories
(→ [05-epics-user-stories.md](05-epics-user-stories.md)).

### P1 — „Alex" · Community-Entwickler:in (Konsument → Contributor)

- **Kontext:** Scripter in einer FiveM-/RedM-Community, mittleres Erfahrungslevel, liest zunächst
  nur mit, meldet sich per Discord-Login an.
- **Ziele:** Schnell verlässliche How-Tos und Troubleshooting-Artikel finden; erste eigene
  Beiträge leisten; Reputation aufbauen.
- **Frustrationen:** Veraltete Tutorials, Copy-Paste-Wissen ohne Erklärung, verstreute Quellen.
- **Kernbedürfnisse:** starke Suche, Qualitätskennzeichnung (geprüft/Review-Status), niedrige
  Einstiegshürde zum Beitragen, sichtbare Anerkennung.

### P2 — „Mira" · Erfahrene Maintainerin (Space Maintainer / Reviewer)

- **Kontext:** Senior-Entwicklerin, verantwortet einen Wissensbereich (z. B. „Backend Basics"),
  prüft eingehende Artikel und Änderungen.
- **Ziele:** Qualität sichern, Review-Aufwand klein halten, Verantwortlichkeiten klar regeln.
- **Kernbedürfnisse:** Review-Queues mit Diff-Ansicht, Versionierung, Benachrichtigungen,
  granulare Rechte pro Space, Moderationswerkzeuge.

### P3 — „Jonas" · Übersetzer (Translator / Language Maintainer)

- **Kontext:** Zweisprachig (DE/EN), übersetzt Artikel in seiner Freizeit, verantwortet später
  die Sprache Deutsch als Language Maintainer.
- **Ziele:** Übersetzungen effizient erstellen und aktuell halten.
- **Kernbedürfnisse:** Seite-an-Seite-Übersicht Original/Übersetzung, Kennzeichnung veralteter
  Übersetzungen bei Originaländerung, Review-Workflow, Fortschrittsübersicht pro Sprache.

### P4 — „Sofia" · Open-Source-Maintainerin

- **Kontext:** Betreut mehrere GitHub-Repositories, möchte Projekte auf der Plattform vorstellen.
- **Ziele:** Projektseiten mit aktuellen Repo-Daten ohne Pflegeaufwand.
- **Kernbedürfnisse:** automatische GitHub-Synchronisation (Stars, Forks, Releases, Sprachen,
  Aktivität), Verknüpfung von Artikeln mit Projekten.

### P5 — „Deniz" · Organisations-Admin (Studio)

- **Kontext:** Tech Lead eines Entwicklerstudios, führt die Plattform als internes Wiki ein.
- **Ziele:** Teams abbilden, interne Wissensbereiche schützen, Verantwortlichkeiten vergeben,
  optional Inhalte veröffentlichen.
- **Kernbedürfnisse:** Organisationsverwaltung, Einladungen, Team-Rechte, private Spaces,
  Sichtbarkeitssteuerung pro Inhalt.

### P6 — „Claire" · Enterprise-IT / Compliance

- **Kontext:** IAM-Verantwortliche eines Unternehmens, bindet die Instanz an Entra ID an.
- **Ziele:** SSO-Pflicht, MFA-Policies, lückenloses Audit, DSGVO-Prozesse.
- **Kernbedürfnisse:** OIDC-Konfiguration über Admin-UI, rollen-/gruppenbasierte MFA-Pflicht,
  Audit-Export, Deprovisionierung, Security-Header und Betriebsdokumentation.

### P7 — „Sam" · Plattform-Administrator (Instanzbetreiber)

- **Kontext:** Betreibt die Instanz (Docker Compose auf einer VM oder Kubernetes).
- **Ziele:** Installation, Updates, Backups, Störungsbeseitigung mit minimalem Aufwand.
- **Kernbedürfnisse:** Setup Wizard, klare Konfigurationsreferenz, Health-Endpoints,
  Recovery-Zugänge, Upgrade-Pfad mit Migrationen.

### P8 — „Gast" · Nicht angemeldete Leser:in

- **Kontext:** Findet Artikel über Suchmaschinen.
- **Ziele:** Inhalte ohne Konto lesen (sofern Instanz öffentlich konfiguriert).
- **Kernbedürfnisse:** schnelle, öffentlich zugängliche, SEO-taugliche Artikelseiten,
  Sprachauswahl.

## 3. Persona-Modul-Matrix

| Persona | IDNT | AUTZ | PROF | KNOW | TRAN | ORGA | SRCH | REPO | MEDI | NOTI | AUDT | CONF |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| P1 Alex | ● | ○ | ● | ● | ○ | | ● | ○ | ● | ● | | |
| P2 Mira | ● | ● | ● | ● | ○ | ○ | ● | | ● | ● | | |
| P3 Jonas | ● | ○ | ● | ○ | ● | | ● | | | ● | | |
| P4 Sofia | ● | ○ | ● | ● | | ○ | ● | ● | ● | ● | | |
| P5 Deniz | ● | ● | ○ | ● | | ● | ● | ○ | ● | ● | ○ | ○ |
| P6 Claire | ● | ● | | | | ● | | | | ○ | ● | ● |
| P7 Sam | ● | ● | | | | | | | | ● | ● | ● |
| P8 Gast | | | ○ | ● | ● | | ● | ● | ○ | | | |

● = Primärnutzung · ○ = Sekundärnutzung
