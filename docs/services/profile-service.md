# Profile & Reputation Service

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20 ·
**FRs:** FR-PROF-001…006 · **Schema:** [database/schemas/profile.md](../database/schemas/profile.md)

## 1. Zweck & Verantwortlichkeiten

Bildet Fachkonzept §11 (Entwicklerprofile) ab:

- Öffentliche Entwicklerprofile (Bio, Links, Skills) als Ergänzung der Identity-Kontodaten
- **Beitragshistorie**: Artikel, Reviews, Übersetzungen, Projekte (aggregiert, event-getrieben)
- **Reputation**: Punktesystem mit konfigurierbaren Werten
- **Achievements**: kriterienbasierte Auszeichnungen
- Sichtbarkeits-/Privatsphäre-Einstellungen des Profils

## 2. Abgrenzung

| Nicht hier | Sondern |
|---|---|
| Konto, Handle, E-Mail, Avatar-Upload | `identity` (Handle/Anzeigename), `media` (Avatar-Datei) |
| Die Inhalte selbst (Artikel, Übersetzungen, Projekte) | Fachmodule; Profile speichert nur Verweise/Zähler |
| Moderation von Profilinhalten | Regeln hier, Ausführung mit `platform.moderator`-Rechten |

## 3. Domänenmodell

- `Profile` — 1:1 zu User: `bio` (Markdown, eingeschränktes Subset), `location?`, `website?`,
  `socialLinks` (JSON, validierte Typen: github, discord, mastodon, linkedin, custom),
  `skills` (Tag-Liste, max. 20), `visibility`-Einstellungen (JSON: `showContributions`,
  `showReputation`, `showAchievements`, jeweils `public`|`members`|`private`).
- `ContributionEvent` — append-only: `userId`, `kind` (`article_published`, `article_updated`,
  `review_approved`, `translation_published`, `comment_helpful`, `project_created`, …),
  `sourceType`+`sourceId`, `occurredAt`, `dedupeKey` (unique — Idempotenzanker).
- `ReputationLedger` — append-only Punktebuchungen: `userId`, `points` (±),
  `contributionEventId?`, `reason`, `actorId?` (bei manueller Korrektur).
- `ReputationSummary` — materialisiert: `userId`, `total`, `byCategory` (JSON).
- `AchievementDefinition` — `key`, Name (i18n-Key), Beschreibung, Icon, `criteria` (JSON),
  `enabled`. Mitgeliefert als Seed, instanzweit erweiterbar.
- `UserAchievement` — `userId`, `achievementKey`, `awardedAt` (unique pro Paar).

## 4. Fachliche Regeln

- **P-1:** Reputation entsteht **ausschließlich** aus `ContributionEvent`-Verarbeitung — nie
  durch direkte Punkteschreibung (Ausnahme: auditierte Admin-Korrekturbuchung mit Grund).
- **P-2:** Idempotenz: `dedupeKey` = `<kind>:<sourceType>:<sourceId>[:<qualifier>]`. Doppelte
  Events (Job-Retry) erzeugen keine zweite Buchung (US-07-02).
- **P-3:** Default-Punktwerte (instanzweit konfigurierbar, FR-PROF-003):

  | Ereignis | Punkte |
  |---|---|
  | Artikel publiziert | +20 |
  | Substanzielles Artikel-Update publiziert | +5 |
  | Review durchgeführt (approve oder changes_requested) | +5 |
  | Übersetzung publiziert | +15 |
  | Übersetzungs-Review durchgeführt | +5 |
  | Eigener Artikel erhält Hilfreich-Stimme | +2 |
  | Kommentar als Lösung markiert | +10 |
  | Projekt angelegt (max. 1×/Projekt) | +5 |

- **P-4:** Rückabwicklung: Wird ein Inhalt gelöscht/depubliziert (Moderation), bucht ein
  Kompensations-Event die Punkte zurück (`dedupeKey` mit `:reversal`).
- **P-5:** Achievements werden nach jeder Event-Verarbeitung des betroffenen Nutzers geprüft;
  Vergabe genau einmal. Startkatalog (Seed): „Erster Artikel", „Fleißiger Autor (10 Artikel)",
  „Erste Übersetzung", „Polyglott (Übersetzungen in 3 Sprachen)", „Wächter (25 Reviews)",
  „Hilfreich (50 Hilfreich-Stimmen erhalten)", „Open-Source-Botschafter (5 Projekte)".
- **P-6:** `recalculate-reputation` (FR-PROF-006) baut Summary + Achievements deterministisch
  aus `ContributionEvent` neu — Korrekturbuchungen (P-1) bleiben erhalten.
- **P-7:** Profil-Sichtbarkeit: `private` versteckt Bereiche auch in der Suche;
  Beitragslisten zeigen nur Inhalte, die der **Betrachter** sehen darf (Permission-Filter der
  Fachmodule, US-07-01).

## 5. Schnittstellen

**API (Auszug):** `GET /users/:handle/profile`, `GET /users/:handle/contributions`,
`PATCH /users/me/profile`, `GET /achievements`, Admin: `POST /admin/reputation/adjust`,
`POST /admin/reputation/recalculate`.

**Konsumierte Events:** `knowledge.article.published`, `knowledge.review.completed`,
`knowledge.comment.*`, `translation.translation.published`, `translation.review.completed`,
`repository.project.created`, `identity.user.registered` (Profil anlegen),
`identity.user.deleted` (Profil löschen).

**Publizierte Events:** `profile.achievement.awarded`, `profile.reputation.changed`
(Konsument: notification).

**Ports:** `ProfilePort.getPublicProfile(userIdOrHandle)`,
`ProfilePort.getReputation(userId)` (für ABAC-Attribut `user.reputation`).

## 6. Hintergrundjobs

| Job | Queue | Zweck |
|---|---|---|
| `process-contribution` | maintenance | Event → Ledger → Summary → Achievement-Prüfung |
| `recalculate-reputation` | maintenance | Voll-Rebuild (Admin-Auslösung) |

## 7. Konfiguration

Punktwerte-Tabelle, Achievements-Aktivierung (Modul-Flag), Reputation-Anzeige an/aus —
alles Instanzeinstellungen (`configuration`).

## 8. Sicherheit

Bio/Links sind nutzergenerierter Inhalt → gleiche Sanitizing-Pipeline wie Artikel
(ADR-0012); Social-Links nur mit Schema-Allowlist (`https://`), Anzeige mit `rel="nofollow
noopener"`. Reputation ist manipulationsgeschützt durch P-1/P-2 (kein Endpoint schreibt Punkte).

## 9. Offene Punkte

- Öffentliche Leaderboards? (Community-Wunsch abwarten — Datenschutz-Standard: opt-in.)
- Skill-Verifikation (endorsements) — nach 1.0.
