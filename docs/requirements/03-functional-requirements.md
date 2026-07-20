# Funktionale Anforderungen (FR-Katalog)

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20

Dieser Katalog listet alle funktionalen Anforderungen, gruppiert nach Modul. Die fachliche
Detailspezifikation jeder Anforderung liegt in der jeweiligen Service-Dokumentation
(→ [services/](../services/README.md)); Akzeptanzkriterien in
[05-epics-user-stories.md](05-epics-user-stories.md).

**Spalten:** Priorität nach MoSCoW (M/S/C/W), Umsetzungsphase 0–3
(→ [Roadmap](06-roadmap-milestones.md)), Epic-Zuordnung.

---

## 1. Identity (`FR-IDNT`) — [Service-Doku](../services/identity-service.md)

| ID | Anforderung | Prio | Phase | Epic |
|---|---|---|---|---|
| FR-IDNT-001 | Lokale Registrierung mit E-Mail + Passwort; per Instanzkonfiguration aktivierbar/deaktivierbar | M | 1 | E-02 |
| FR-IDNT-002 | E-Mail-Verifizierung über zeitlich begrenzten Einmal-Token | M | 1 | E-02 |
| FR-IDNT-003 | Login/Logout mit serverseitigen, widerrufbaren Sessions (HTTP-only Secure Cookie) | M | 1 | E-02 |
| FR-IDNT-004 | Passwort-Reset per E-Mail-Token; bestehende Sessions werden dabei invalidiert | M | 1 | E-02 |
| FR-IDNT-005 | OAuth-Login über Discord | M | 1 | E-02 |
| FR-IDNT-006 | OAuth-Login über GitHub | M | 1 | E-02 |
| FR-IDNT-007 | OAuth-Login über Google | S | 2 | E-02 |
| FR-IDNT-008 | Generischer OIDC-Provider-Support (Microsoft Entra ID, Keycloak, Authentik, beliebige OAuth2/OIDC) über Provider-Abstraktion | M | 3 | E-02 |
| FR-IDNT-009 | Account-Linking: mehrere Auth-Provider an einem Benutzerkonto; Verknüpfen/Trennen durch den Nutzer | M | 2 | E-02 |
| FR-IDNT-010 | Admin-Verwaltung der Auth-Provider über UI: anlegen, konfigurieren, aktivieren/deaktivieren, testen | M | 2 | E-02 |
| FR-IDNT-011 | MFA per TOTP (Einrichtung mit QR-Code, Verifizierung, Deaktivierung mit Re-Auth) | M | 2 | E-02 |
| FR-IDNT-012 | Einmal verwendbare Recovery Codes (Erzeugung, Anzeige einmalig, Regenerierung) | M | 2 | E-02 |
| FR-IDNT-013 | MFA-Policies: optional, rollenbasiert, gruppenbasiert oder instanzweit verpflichtend | M | 3 | E-02 |
| FR-IDNT-014 | WebAuthn/FIDO2/Passkeys: Datenmodell und Credential-Interface vorbereitet | C | 3 | E-02 |
| FR-IDNT-015 | Session-Verwaltung durch Nutzer: aktive Sitzungen einsehen und einzeln/alle widerrufen | S | 2 | E-02 |
| FR-IDNT-016 | Personal Access Tokens (PAT) mit Scopes und Ablaufdatum für API-Zugriff | S | 3 | E-02 |
| FR-IDNT-017 | Registrierungsmodi: offen, nur per Einladung, geschlossen (nur SSO/Provisionierung) | M | 1 | E-02 |
| FR-IDNT-018 | Konto-Deaktivierung und DSGVO-konforme Löschung (inkl. Anonymisierung von Beiträgen) | M | 2 | E-12 |
| FR-IDNT-019 | Admin-Benutzerverwaltung: suchen, sperren/entsperren, Rollen zuweisen, Sessions beenden | M | 1 | E-02 |
| FR-IDNT-020 | Handle-System: eindeutiger, änderbarer Benutzer-Handle mit Redirect-Historie | S | 1 | E-07 |

## 2. Authorization (`FR-AUTZ`) — [Service-Doku](../services/authorization-service.md)

| ID | Anforderung | Prio | Phase | Epic |
|---|---|---|---|---|
| FR-AUTZ-001 | RBAC: Rollen bündeln Permissions; Zuweisung an Nutzer und Gruppen | M | 1 | E-03 |
| FR-AUTZ-002 | Zentraler Permission-Katalog nach Konvention `<modul>.<ressource>.<aktion>`, im Code definiert und in die DB synchronisiert | M | 1 | E-03 |
| FR-AUTZ-003 | Rollen-Scopes: `global`, `organization`, `space`, `language` | M | 1 | E-03 |
| FR-AUTZ-004 | Benutzergruppen mit Rollenzuweisung (z. B. „Backend Developer Group" → „Backend Domain Contributor") | M | 2 | E-03 |
| FR-AUTZ-005 | ABAC-Policies: attributbasierte Bedingungen (Subjekt/Ressource/Kontext), Effekt allow/deny, Priorität; deny gewinnt | M | 3 | E-03 |
| FR-AUTZ-006 | Systemrollen (nicht löschbar, Kern-Permissions nicht entfernbar) und frei definierbare Custom-Rollen | M | 1 | E-03 |
| FR-AUTZ-007 | Rollen- und Gruppenverwaltung über Admin-UI | M | 2 | E-03 |
| FR-AUTZ-008 | Deny-by-default: jeder geschützte Endpunkt deklariert explizit seine Permission; ohne Deklaration wird verweigert | M | 1 | E-03 |
| FR-AUTZ-009 | Permission-Editor als wiederverwendbare Design-System-Komponente | S | 2 | E-14 |
| FR-AUTZ-010 | Berechtigungsauskunft: effektive Permissions eines Nutzers inkl. Herkunft (Rolle/Gruppe/Policy) einsehbar | S | 3 | E-03 |

## 3. Profile & Reputation (`FR-PROF`) — [Service-Doku](../services/profile-service.md)

| ID | Anforderung | Prio | Phase | Epic |
|---|---|---|---|---|
| FR-PROF-001 | Öffentliches Entwicklerprofil: Handle, Anzeigename, Avatar, Bio, Links, Skills/Tech-Tags | M | 1 | E-07 |
| FR-PROF-002 | Beitragshistorie auf dem Profil: Artikel, Reviews, Übersetzungen, Projekte | M | 2 | E-07 |
| FR-PROF-003 | Reputationssystem: Punkte für Beiträge (publizierte Artikel, angenommene Reviews, Übersetzungen, Hilfreich-Stimmen); Punktwerte instanzweit konfigurierbar | M | 2 | E-07 |
| FR-PROF-004 | Achievements: definierte Auszeichnungen mit Kriterien, automatische Vergabe, Anzeige im Profil | S | 2 | E-07 |
| FR-PROF-005 | Sichtbarkeits-/Privatsphäre-Einstellungen für Profilbestandteile | S | 2 | E-07 |
| FR-PROF-006 | Reputations-Neuberechnung (idempotenter Rebuild aus Ereignishistorie) als Admin-Werkzeug | S | 2 | E-07 |

## 4. Knowledge (`FR-KNOW`) — [Service-Doku](../services/knowledge-service.md)

| ID | Anforderung | Prio | Phase | Epic |
|---|---|---|---|---|
| FR-KNOW-001 | Artikeltypen: Learning Basics, Best Practices, How-To Guides, Troubleshooting, Open-Source-Wissen | M | 1 | E-04 |
| FR-KNOW-002 | Inhalte in Markdown (CommonMark + GFM + Admonitions); serverseitiges Rendering mit Sanitizing | M | 1 | E-04 |
| FR-KNOW-003 | Vollständige Versionierung: jede Änderung erzeugt eine unveränderliche Version mit Autor, Zeitpunkt und Änderungsnotiz | M | 1 | E-04 |
| FR-KNOW-004 | Lifecycle: `draft` → `in_review` → `published` → `archived`; Statusübergänge nur mit passender Permission | M | 1 | E-04 |
| FR-KNOW-005 | Review-Workflow: Reviewer genehmigen (`approve`) oder fordern Änderungen an (`request_changes`) mit Kommentar; Publikation erst nach Genehmigung (pro Space konfigurierbar) | M | 1 | E-04 |
| FR-KNOW-006 | Wissensbereiche (Spaces) mit Sichtbarkeit `public`, `internal` (nur angemeldete), `organization`, `private` | M | 1 | E-04 |
| FR-KNOW-007 | Hierarchische Kategorien innerhalb eines Space (max. 3 Ebenen) mit Sortierung | M | 1 | E-04 |
| FR-KNOW-008 | Tags (instanzweit, kuratierbar) zur Querschnitts-Verschlagwortung | M | 1 | E-04 |
| FR-KNOW-009 | Versions-Diff-Ansicht (Markdown-Quelltext-Diff) für Review und Historie | M | 1 | E-04 |
| FR-KNOW-010 | Kommentare pro Artikel: Threads, Antworten, Auflösen (`resolved`), Moderation | S | 2 | E-04 |
| FR-KNOW-011 | „War dieser Artikel hilfreich?"-Feedback (angemeldete Nutzer, 1× pro Nutzer/Artikel) | S | 2 | E-04 |
| FR-KNOW-012 | Änderungsvorschläge Dritter auf fremde Artikel (Edit-Request als neue Version im Review) | S | 2 | E-04 |
| FR-KNOW-013 | Verknüpfung von Artikeln mit Projekten (Open-Source-Wissen) | S | 2 | E-09 |
| FR-KNOW-014 | Archivierung mit sichtbarem Hinweis und Ausschluss aus Standard-Suche | M | 2 | E-04 |
| FR-KNOW-015 | Co-Autoren pro Artikel | C | 2 | E-04 |
| FR-KNOW-016 | Artikel-Serien / Lernpfade (geordnete Artikelfolgen) | C | 3 | E-04 |
| FR-KNOW-017 | Slug-Verwaltung mit Redirect bei Umbenennung (keine toten Links) | M | 1 | E-04 |

## 5. Translation (`FR-TRAN`) — [Service-Doku](../services/translation-service.md)

| ID | Anforderung | Prio | Phase | Epic |
|---|---|---|---|---|
| FR-TRAN-001 | Jeder Artikel besitzt eine Originalsprache; Übersetzungen existieren pro Zielsprache mit eigenem Lifecycle (`draft` → `in_review` → `published`, zusätzlich `outdated`) | M | 2 | E-05 |
| FR-TRAN-002 | Workflow: Übersetzungsvorschlag → Review → Freigabe → Veröffentlichung | M | 2 | E-05 |
| FR-TRAN-003 | Jede Übersetzungsversion referenziert die übersetzte Originalversion; neue Originalversion markiert Übersetzungen automatisch als `outdated` | M | 2 | E-05 |
| FR-TRAN-004 | Rollen: Translator (erstellt), Translation Reviewer (prüft), Language Maintainer (verantwortet Sprache, Scope `language`) | M | 2 | E-05 |
| FR-TRAN-005 | Übersetzungsfortschritt pro Sprache und Space (Abdeckung, Outdated-Anteil) | S | 2 | E-05 |
| FR-TRAN-006 | Side-by-side-Übersetzungseditor (Original links, Übersetzung rechts, absatzweise Navigation) | S | 2 | E-05 |
| FR-TRAN-007 | Aktivierte Inhaltssprachen instanzweit konfigurierbar | M | 2 | E-05 |
| FR-TRAN-008 | Leser-Sprachwahl mit Fallback auf Originalsprache; Outdated-Hinweis am Artikel | M | 2 | E-05 |
| FR-TRAN-009 | Optionale maschinelle Übersetzungs-Schnittstelle (Provider-Interface); keine KI-Pflicht im Kernworkflow | C | 3 | E-05 |

## 6. Organization (`FR-ORGA`) — [Service-Doku](../services/organization-service.md)

| ID | Anforderung | Prio | Phase | Epic |
|---|---|---|---|---|
| FR-ORGA-001 | Organisationen mit eindeutigem Slug, Name, Beschreibung, Logo, Sichtbarkeit `public`/`private` | M | 2 | E-08 |
| FR-ORGA-002 | Mitgliederverwaltung: Einladung per E-Mail/Handle, Annahme/Ablehnung, Entfernen, Austritt | M | 2 | E-08 |
| FR-ORGA-003 | Organisationsrollen über Authorization-Scope `organization` (Owner, Admin, Member als Systemrollen) | M | 2 | E-08 |
| FR-ORGA-004 | Teams innerhalb einer Organisation mit eigener Mitgliederliste | S | 2 | E-08 |
| FR-ORGA-005 | Organisationseigene Wissensbereiche (Spaces mit `orgId`) | M | 2 | E-08 |
| FR-ORGA-006 | Projektpräsentation: Organisationen können Projekte anlegen und öffentlich präsentieren | S | 2 | E-08 |
| FR-ORGA-007 | Verantwortlichkeiten: Teams/Mitglieder als Maintainer von Spaces oder Kategorien | S | 2 | E-08 |
| FR-ORGA-008 | Organisationsprofilseite (öffentlich, sofern `public`) mit Mitgliedern, Spaces, Projekten | S | 2 | E-08 |

## 7. Search (`FR-SRCH`) — [Service-Doku](../services/search-service.md)

| ID | Anforderung | Prio | Phase | Epic |
|---|---|---|---|---|
| FR-SRCH-001 | Volltextsuche über publizierte Artikel in allen Sprachfassungen (Meilisearch) | M | 1 | E-06 |
| FR-SRCH-002 | Facetten/Filter: Artikeltyp, Space, Kategorie, Tags, Sprache, Aktualität | M | 1 | E-06 |
| FR-SRCH-003 | Berechtigungsbewusste Suche: nicht-öffentliche Inhalte erscheinen nur für Berechtigte | M | 1 | E-06 |
| FR-SRCH-004 | Typo-Toleranz und Ranking (Aktualität, Hilfreich-Stimmen, Titel-Boost) | S | 1 | E-06 |
| FR-SRCH-005 | Indexierung near-realtime: Änderungen sind ≤ 30 s nach Publikation auffindbar | S | 1 | E-06 |
| FR-SRCH-006 | Projekte und Kommentare als eigene durchsuchbare Indizes | S | 2 | E-06 |
| FR-SRCH-007 | Admin-Werkzeug: vollständiger Reindex pro Index, mit Fortschrittsanzeige | M | 1 | E-06 |
| FR-SRCH-008 | Globale Suche in der UI (Cmd/Ctrl+K-Palette) mit gruppierten Ergebnissen | S | 2 | E-06 |

## 8. Repository (`FR-REPO`) — [Service-Doku](../services/repository-service.md)

| ID | Anforderung | Prio | Phase | Epic |
|---|---|---|---|---|
| FR-REPO-001 | Projekte als eigenständige Entität (Owner: Nutzer oder Organisation) mit Beschreibung und Tags — ohne Pflicht zur Repo-Verknüpfung | M | 2 | E-09 |
| FR-REPO-002 | Verknüpfung eines Projekts mit einem GitHub-Repository | M | 2 | E-09 |
| FR-REPO-003 | Automatischer Metadaten-Sync: Repository-Name, Beschreibung, Primärsprache, Sprachverteilung, Stars, Forks, offene Issues, letzte Aktivität, Releases, Lizenz | M | 2 | E-09 |
| FR-REPO-004 | Periodischer Sync (konfigurierbares Intervall) + manueller Refresh durch Projekt-Owner | S | 2 | E-09 |
| FR-REPO-005 | Instanzweite GitHub-API-Konfiguration (Token/App) über Admin-UI; Betrieb ohne Token mit reduzierten Limits möglich | M | 2 | E-09 |
| FR-REPO-006 | Rate-Limit-Handling mit Backoff; Sync-Status und letzter Erfolg sichtbar | M | 2 | E-09 |
| FR-REPO-007 | Provider-Abstraktion für spätere GitLab-/Gitea-Anbindung | C | 3 | E-09 |

## 9. Media (`FR-MEDI`) — [Service-Doku](../services/media-service.md)

| ID | Anforderung | Prio | Phase | Epic |
|---|---|---|---|---|
| FR-MEDI-001 | Bild-Upload (PNG, JPEG, WebP, AVIF, GIF) für Artikel, Profile, Organisationen, Projekte | M | 1 | E-10 |
| FR-MEDI-002 | Upload-Pipeline: Validation → Security Check → Compression → Storage (verbindliche Reihenfolge) | M | 1 | E-10 |
| FR-MEDI-003 | Verarbeitung mit Sharp: Kompression, WebP-/AVIF-Varianten, Größenvarianten (Thumbnail/Content/Original), EXIF-/Metadaten-Entfernung | M | 1 | E-10 |
| FR-MEDI-004 | Storage-Abstraktion mit Adaptern: lokales Filesystem, S3-kompatibel (Hetzner, AWS, MinIO, R2) | M | 1 | E-10 |
| FR-MEDI-005 | Storage-Adapter für Azure Blob und Google Cloud Storage | S | 3 | E-10 |
| FR-MEDI-006 | SVG nur für Instanz-Branding durch Admins (mit Sanitizing); kein SVG-Upload für reguläre Inhalte | M | 1 | E-10 |
| FR-MEDI-007 | Speicher-Quota pro Nutzer und Organisation (konfigurierbar) | S | 2 | E-10 |
| FR-MEDI-008 | Bereinigung verwaister Medien (nicht referenziert, älter als Frist) als Hintergrundjob | S | 2 | E-10 |

## 10. Notification (`FR-NOTI`) — [Service-Doku](../services/notification-service.md)

| ID | Anforderung | Prio | Phase | Epic |
|---|---|---|---|---|
| FR-NOTI-001 | Vollständig konfigurierbarer SMTP-Versand (Host, Port, TLS, Auth, Absender) inkl. Testversand aus der Admin-UI | M | 1 | E-11 |
| FR-NOTI-002 | Transaktionale E-Mails: Verifizierung, Passwort-Reset, Einladungen, Sicherheitshinweise | M | 1 | E-11 |
| FR-NOTI-003 | In-App-Benachrichtigungen mit Ungelesen-Zähler, Liste, Als-gelesen-Markierung | M | 2 | E-11 |
| FR-NOTI-004 | Ereigniskatalog: neue Beiträge im beobachteten Space, Review benötigt, Review-Ergebnis, Übersetzung outdated, Kommentar/Antwort, Security-Ereignisse, System-Warnungen | M | 2 | E-11 |
| FR-NOTI-005 | Benachrichtigungspräferenzen pro Nutzer, Ereignistyp und Kanal (E-Mail/In-App) | S | 2 | E-11 |
| FR-NOTI-006 | E-Mail-Templates mit Instanz-Branding und i18n (Sprache des Empfängers) | S | 2 | E-11 |
| FR-NOTI-007 | Ausgehende Webhooks (signiert, Ereignis-Abonnement, Retry) — Architektur vorbereitet | C | 3 | E-11 |
| FR-NOTI-008 | Digest-Mails (täglich/wöchentlich zusammengefasst) | C | 3 | E-11 |

## 11. Audit (`FR-AUDT`) — [Service-Doku](../services/audit-service.md)

| ID | Anforderung | Prio | Phase | Epic |
|---|---|---|---|---|
| FR-AUDT-001 | Append-only Audit-Log: Auth-Ereignisse, Rechteänderungen, Admin-Aktionen, Recovery-Zugriffe, Konfigurationsänderungen | M | 1 | E-12 |
| FR-AUDT-002 | Ereignisstruktur mit Actor (Nutzer/System/Token), Aktion, Ressource, Zeitpunkt, IP, User-Agent, Metadaten | M | 1 | E-12 |
| FR-AUDT-003 | Admin-Audit-Viewer mit Filtern (Zeitraum, Actor, Aktion, Ressource) | M | 3 | E-12 |
| FR-AUDT-004 | Export als CSV/JSON für Compliance | S | 3 | E-12 |
| FR-AUDT-005 | Konfigurierbare Retention mit automatischer Bereinigung | M | 3 | E-12 |
| FR-AUDT-006 | Erweiterter Ereigniskatalog (Content-Lifecycle, Org-Änderungen) per Konfiguration zuschaltbar | S | 3 | E-12 |

## 12. Configuration & Setup (`FR-CONF`) — [Service-Doku](../services/configuration-service.md)

| ID | Anforderung | Prio | Phase | Epic |
|---|---|---|---|---|
| FR-CONF-001 | Setup Wizard beim Erststart: System-Checks (Ressourcen, Erreichbarkeit der Dienste), DB-Verbindung + Migrationen, Storage-Lese-/Schreibtest, OAuth-Verbindungstest inkl. Redirect-Prüfung, Security-Defaults | M | 1 | E-01 |
| FR-CONF-002 | Setup-Abschluss: Erstellung des ersten Admin-Kontos + Recovery-Setup (Recovery Codes) | M | 1 | E-01 |
| FR-CONF-003 | Instanzeinstellungen über Admin-UI: Name, Beschreibung, Logo/Branding, Standardsprachen, Standard-Theme | M | 1 | E-01 |
| FR-CONF-004 | Modul-Aktivierung: Organisationen, Übersetzungen, Repository-Integration, Kommentare, Achievements einzeln schaltbar | M | 2 | E-01 |
| FR-CONF-005 | Policies: Registrierungsmodus, Standard-Sichtbarkeiten, Review-Pflicht pro Space-Default | M | 1 | E-01 |
| FR-CONF-006 | Konfigurations-Präzedenz: Umgebungsvariablen (Infrastruktur) > Datenbank (fachliche Einstellungen); ENV-gesetzte Werte sind in der UI sichtbar, aber schreibgeschützt | M | 1 | E-01 |
| FR-CONF-007 | Verschlüsselte Speicherung sensibler Konfigurationswerte (SMTP-Passwort, OAuth-Secrets, API-Tokens) | M | 1 | E-01 |

## 13. Plattformweit (`FR-PLAT`)

| ID | Anforderung | Prio | Phase | Epic |
|---|---|---|---|---|
| FR-PLAT-001 | Dark Mode und Light Mode, systempräferenz-bewusst, nutzerseitig übersteuerbar | M | 1 | E-14 |
| FR-PLAT-002 | Vollständig responsive UI (Mobile → Desktop) | M | 1 | E-14 |
| FR-PLAT-003 | UI-Internationalisierung (initial `de`, `en`), getrennt vom Content-Übersetzungssystem | M | 1 | E-14 |
| FR-PLAT-004 | SEO für öffentliche Inhalte: SSR, Meta-/OpenGraph-Tags, Sitemap, kanonische URLs, `hreflang` | S | 1 | E-06 |
| FR-PLAT-005 | Health-/Readiness-/Metrics-Endpoints für Betrieb und Orchestrierung | M | 1 | E-13 |
| FR-PLAT-006 | Recovery-System: Admin-Recovery (Break-Glass-Konto/Codes), CLI-Recovery im Container, Emergency-Access-Verfahren — alle Aktionen auditiert | M | 2 | E-13 |
| FR-PLAT-007 | Alle UIs verwenden ausschließlich das zentrale Design System | M | 0 | E-14 |
