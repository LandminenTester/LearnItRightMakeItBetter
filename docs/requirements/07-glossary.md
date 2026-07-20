# Glossar — Ubiquitous Language

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20

Diese Begriffe werden in Dokumentation, Code (englische Bezeichner), API und UI einheitlich
verwendet. Code-Bezeichner stehen in `Klammern`.

## Inhalte & Wissen

| Begriff | Definition |
|---|---|
| **Artikel** (`Article`) | Kleinste publizierbare Wissenseinheit. Hat genau einen Typ, eine Originalsprache, einen Space, Versionen und einen Lifecycle-Status. |
| **Artikeltyp** (`ArticleType`) | Einer von: `learning_basic` (Learning Basics), `best_practice`, `how_to`, `troubleshooting`, `oss_knowledge` (Open-Source-Wissen). |
| **Version** (`ArticleVersion`) | Unveränderlicher Snapshot eines Artikels (Titel, Zusammenfassung, Markdown) mit Autor, Zeitpunkt und Änderungsnotiz. |
| **Lifecycle-Status** | `draft` → `in_review` → `published` → `archived`. Gilt für Artikel und (analog) Übersetzungen. |
| **Review** (`ArticleReview`) | Formale Prüfung einer Version durch berechtigte Reviewer mit Ergebnis `approved` oder `changes_requested`. |
| **Space** (Wissensbereich, `Space`) | Oberster Container für Inhalte mit eigener Sichtbarkeit, Rollen und optionaler Organisationszugehörigkeit. |
| **Kategorie** (`Category`) | Hierarchische Gliederung innerhalb eines Space (max. 3 Ebenen). |
| **Tag** (`Tag`) | Instanzweites Schlagwort zur Querschnitts-Klassifikation. |
| **Änderungsvorschlag** (Edit Request) | Von Dritten eingereichte neue Version eines fremden Artikels, die den Review-Workflow durchläuft. |
| **Slug** | URL-stabiler Bezeichner (`kebab-case`); Umbenennung erzeugt Redirect. |

## Übersetzung

| Begriff | Definition |
|---|---|
| **Originalsprache** (`originalLocale`) | Sprache, in der ein Artikel verfasst wurde (BCP-47). |
| **Übersetzung** (`ArticleTranslation`) | Sprachfassung eines Artikels mit eigenem Lifecycle und eigenen Versionen. |
| **Quellversion** (`sourceVersion`) | Die Originalversion, auf der eine Übersetzungsversion basiert. |
| **Outdated** | Status einer publizierten Übersetzung, deren Quellversion nicht mehr die aktuelle Originalversion ist. |
| **Translator** | Rolle: erstellt Übersetzungen. |
| **Translation Reviewer** | Rolle: prüft Übersetzungen einer Sprache. |
| **Language Maintainer** | Rolle: verantwortet eine Sprache instanzweit (Scope `language`). |

## Identität & Rechte

| Begriff | Definition |
|---|---|
| **Benutzer** (`User`) | Menschliches Konto mit Handle, E-Mail und Profil. |
| **Handle** | Eindeutiger, änderbarer Kurzname (`@handle`) für URLs und Erwähnungen. |
| **Auth-Provider** (`AuthProvider`) | Konfigurierte Anmeldequelle: `local`, `discord`, `github`, `google` oder generisch `oidc`. |
| **Identität** (`AuthIdentity`) | Verknüpfung eines Benutzers mit einem Provider-Konto (Account-Linking). |
| **Session** | Serverseitig gespeicherte, widerrufbare Anmeldesitzung (Cookie-referenziert). |
| **MFA** | Zweiter Faktor: TOTP, Recovery Codes; WebAuthn vorbereitet. |
| **Permission** | Feingranulares Recht nach Schema `<modul>.<ressource>.<aktion>` (z. B. `knowledge.article.publish`). |
| **Rolle** (`Role`) | Benanntes Bündel von Permissions mit Scope-Typ. |
| **Scope** | Geltungsbereich einer Rollenzuweisung: `global`, `organization`, `space`, `language`. |
| **Gruppe** (`Group`) | Benutzer-Sammlung als Rechteträger (Rollen werden Gruppen zugewiesen). |
| **Policy** (ABAC) | Attributbasierte Regel mit Bedingungen und Effekt `allow`/`deny`; `deny` gewinnt. |
| **Systemrolle** | Mitgelieferte, nicht löschbare Rolle (z. B. `platform.admin`, `space.maintainer`, `org.owner`). |
| **PAT** | Personal Access Token für API-Zugriff mit Scopes und Ablauf. |

## Community & Organisation

| Begriff | Definition |
|---|---|
| **Profil** (`Profile`) | Öffentliche Selbstdarstellung eines Benutzers (Bio, Links, Skills, Beiträge, Achievements). |
| **Reputation** | Aggregierte Punktzahl aus Beitragsereignissen; Punktwerte konfigurierbar. |
| **Achievement** | Automatisch verliehene Auszeichnung mit definierten Kriterien. |
| **Organisation** (`Organization`) | Mandantenähnliche Einheit mit Mitgliedern, Teams, Spaces und Projekten. |
| **Team** | Untergruppe einer Organisation, u. a. als Verantwortlicher für Spaces. |
| **Projekt** (`Project`) | Präsentierte (Open-Source-)Arbeit eines Nutzers/einer Organisation, optional mit Repository-Verknüpfung. |
| **Repository-Verknüpfung** (`RepositoryLink`) | Verbindung eines Projekts zu einem externen Repository (GitHub), Quelle des Metadaten-Syncs. |

## Plattform & Betrieb

| Begriff | Definition |
|---|---|
| **Instanz** | Eine selbst gehostete Installation der Plattform. |
| **Modul** | Fachlich abgegrenzter Backend-Bereich (12 Stück, → [architecture/02](../architecture/02-module-boundaries.md)); teils per Konfiguration deaktivierbar. |
| **Betriebsmodell** | Typisches Einsatzprofil (Public Community / Organization / Enterprise) — keine Edition. |
| **Setup Wizard** | Geführte Ersteinrichtung mit System-, DB-, Storage-, OAuth- und Security-Checks. |
| **Recovery** | Verfahren zur Wiedererlangung administrativen Zugriffs: Admin-Recovery, CLI-Recovery, Emergency Access. |
| **Audit-Event** | Unveränderlicher Protokolleintrag einer sicherheits- oder governance-relevanten Aktion. |
| **Storage-Backend** | Konfigurierter Ablageort für Medien: Filesystem, S3-kompatibel, Azure Blob, GCS. |
| **Worker** | Prozess, der BullMQ-Hintergrundjobs ausführt (E-Mail, Sync, Media, Indexierung). |
| **Design System** | Zentrale UI-Bibliothek (`packages/design-system`); einzige erlaubte Quelle für UI-Bausteine. |
| **Design Token** | Benannter Gestaltungswert (Farbe, Abstand, Typo) als CSS-Variable. |

## Abkürzungen

| Kürzel | Bedeutung |
|---|---|
| ABAC | Attribute-Based Access Control |
| ADR | Architecture Decision Record |
| BCP-47 | IETF-Sprachcode-Standard (`de`, `en`, `pt-BR`) |
| DSGVO | Datenschutz-Grundverordnung |
| FR / NFR | Funktionale / Nicht-funktionale Anforderung |
| IAM | Identity & Access Management |
| JIT | Just-in-Time (Provisionierung) |
| MoSCoW | Must/Should/Could/Won't-Priorisierung |
| OIDC | OpenID Connect |
| RBAC | Role-Based Access Control |
| SCA / SAST | Software Composition Analysis / Static Application Security Testing |
| SSO | Single Sign-On |
| SSR | Server-Side Rendering |
| TOTP | Time-based One-Time Password |
