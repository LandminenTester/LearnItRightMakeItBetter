# Vision & Scope

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20

## 1. Produktvision

*Learn it right. Make it better.* ist eine **offene, modulare und vollständig selbst hostbare
Wissensplattform** für Entwickler, Communities, Open-Source-Projekte und Unternehmen.

Die Plattform soll eine **zentrale Wissensinfrastruktur für Entwickler** werden. Nicht nur
„eine Dokumentation lesen", sondern **„verstehen, verbessern und gemeinsam Wissen entwickeln."**

Sie vereint in einer einzigen Codebasis:

- **Community Hub** — gemeinschaftlich erstelltes und geprüftes Wissen
- **Open-Source-Wissenszentrum** — Projekterkennung und Projektpräsentation
- **Entwicklerportal** — Profile, Reputation, Achievements
- **Internes Unternehmenswiki** — Teams, Wissensbereiche, Verantwortlichkeiten
- **Enterprise Developer Platform** — SSO, IAM, Audit, Governance

## 2. Leitprinzipien

### Learn it right

Die Plattform legt Wert auf **Verständnis statt Copy & Paste**: Architekturverständnis, saubere
Entwicklung, Sicherheit und nachhaltige Lösungen. Inhalte erklären das *Warum*, nicht nur das *Wie*.

### Make it better

Jeder kann beitragen: Artikel erstellen, Fehler korrigieren, Übersetzungen verbessern,
Best Practices ergänzen, Projekte vorstellen. Beiträge durchlaufen einen Review-Prozess und
zahlen auf Reputation ein.

### Open Knowledge

Wissen ist **transparent, versioniert, nachvollziehbar und gemeinschaftlich verbesserbar**.
Jede inhaltliche Änderung ist einer Person und einer Version zuordenbar.

## 3. Grundsatzentscheidung: Eine Plattform, eine Codebasis

Es gibt **keine künstliche Trennung** in Community/Professional/Enterprise Edition
(→ [ADR-0009](../architecture/decisions/adr-0009-single-codebase-no-editions.md)).
Jede Installation entscheidet selbst über:

- aktivierte Module
- Authentifizierungsverfahren (lokal, OAuth, OIDC/SSO)
- Rollenmodell und Policies
- Storage-Backend
- Branding
- Governance-Regeln

## 4. Betriebsmodelle (typische Einsatzprofile, keine Editionen)

Betriebsmodelle beschreiben **typische Konfigurationen** — alle Funktionen bleiben in jedem
Modell verfügbar.

| Modell | Beispiel | Typische Konfiguration | Zusätzlich jederzeit möglich |
|---|---|---|---|
| **Public Community** | FiveM-/RedM-Entwicklerplattform | Öffentliche Registrierung, Discord-/GitHub-Login, öffentliche Artikel, Community-Reviews, Übersetzungen | OIDC-Login, geschlossene Benutzergruppen, Organisationen, Enterprise-Features |
| **Organization** | Entwicklerstudio | Interne Dokumentationen, Teams, Wissensbereiche, Verantwortlichkeiten | Öffentliche Inhalte, Open-Source-Beteiligung, externe Contributor |
| **Enterprise** | Unternehmen | SSO (Entra ID/Keycloak/Authentik), IAM, Audit, Security Policies, Governance | Alle Community-Funktionen |

## 5. Scope

### 5.1 In Scope (Release 1.0)

1. **Knowledge System**: Artikeltypen Learning Basics, Best Practices, How-To Guides,
   Troubleshooting, Open-Source-Wissen; versionierte Inhalte; Review-Workflow; Kommentare;
   Wissensbereiche (Spaces) mit Kategorien und Tags.
2. **Community Driven Translation**: Übersetzungsworkflow mit Translator, Translation Reviewer
   und Language Maintainer; Versionssynchronisation mit dem Original; keine KI-Pflicht.
3. **Identity & Access**: Lokale Registrierung, Discord/GitHub/Google OAuth,
   Microsoft Entra ID, Authentik, Keycloak sowie beliebige OAuth2-/OIDC-Provider;
   MFA (TOTP + Recovery Codes, WebAuthn vorbereitet); hybrides RBAC + ABAC.
4. **Entwicklerprofile**: Beiträge, Reviews, Übersetzungen, Projekte, Achievements, Reputation.
5. **Organisationen**: Mitglieder, Teams, eigene Wissensbereiche, Projektpräsentation,
   Verantwortlichkeiten.
6. **Open-Source-Integration**: automatische GitHub-Metadaten (Name, Sprache, Stars, Forks,
   Aktivität, Releases).
7. **Suche**: Volltextsuche mit Filtern, Ranking und Facetten über Artikel, Übersetzungen,
   Kommentare und Repository-Daten (Meilisearch).
8. **Media**: Upload-Pipeline mit Validierung, Security-Check, Kompression (WebP/AVIF),
   Größenvarianten, Metadatenentfernung; Storage-Abstraktion (Filesystem, S3-kompatibel, Blob).
9. **Notifications**: SMTP-E-Mails und In-App-Benachrichtigungen; Webhooks vorbereitet.
10. **Administration & Betrieb**: Setup Wizard, Instanzkonfiguration, Branding, Audit-Log,
    Recovery-System (Admin/CLI/Emergency), Docker-Compose- und Kubernetes-Deployment.

### 5.2 Out of Scope (Release 1.0 — bewusst verschoben)

| Thema | Begründung / Perspektive |
|---|---|
| Native Mobile Apps | Responsive Web deckt den Bedarf; PWA-Eignung wird eingeplant. |
| Echtzeit-Kollaborationseditor (Google-Docs-artig) | Versionierung + Review-Workflow zuerst; CRDT-Editor als spätere Evolution. |
| KI-gestützte Auto-Übersetzung / Auto-Content | Konzeptvorgabe: keine zwingende KI-Abhängigkeit. Optionale Integrationen später. |
| GitLab-/Gitea-/Bitbucket-Integration | Provider-Abstraktion im Repository-Modul ist vorbereitet; GitHub zuerst. |
| Bezahlfunktionen / Marktplatz | Kein Bestandteil der Vision 1.0. |
| Föderation zwischen Instanzen | Interessant, aber nach 1.0. |
| Vollständige WebAuthn/Passkey-Anmeldung | Architektur vorbereitet (→ FR-IDNT-014), Umsetzung Phase 3. |

### 5.3 Explizite Nicht-Ziele

- Kein Closed-Source-Kern, keine Feature-Gates hinter Lizenzschlüsseln.
- Keine harte Kopplung an einen Cloud-Anbieter (alles self-hostbar).
- Kein Ersatz für Quellcode-Hosting (wir verlinken/synchronisieren Repositories, hosten sie nicht).

## 6. Erfolgskriterien (Release 1.0)

| Kriterium | Messgröße |
|---|---|
| Installierbarkeit | Frische Installation inkl. Setup Wizard auf Referenz-Hardware in < 30 Minuten |
| Vollständiger Wissens-Loop | Artikel erstellen → Review → Publikation → Übersetzung → Review → Publikation ohne manuelle Eingriffe außerhalb der UI |
| Enterprise-Login | Anbindung eines generischen OIDC-Providers rein über Admin-UI/Konfiguration |
| Qualität | Quality Gates aus [testing/](../testing/README.md) und [security/](../security/README.md) in CI grün |
| Self-Hosting-Szenarien | Referenztopologien Single-Node (Compose) und Kubernetes dokumentiert und getestet |

## 7. Rahmenbedingungen

- **Lizenz Software:** GNU AGPLv3 — Nutzung, Änderung, Weitergabe erlaubt; Änderungen müssen
  offengelegt werden.
- **Lizenz Inhalte:** Creative Commons BY-SA.
- **Branding:** separate Trademark Policy (außerhalb dieses Repos gepflegt).
- **Techstack:** verbindlich festgelegt in
  [architecture/01-system-overview.md](../architecture/01-system-overview.md) und den ADRs.
- **Datenschutz:** DSGVO-Konformität ist Grundanforderung
  (→ [NFR-Katalog](04-non-functional-requirements.md),
  [security/04](../security/04-data-protection-privacy.md)).
