# API · profile

**Fachregeln:** [services/profile-service.md](../../services/profile-service.md) ·
**Stories:** [E-07](../../requirements/epics/e-07-developer-profiles/user-stories.md)

## Profile

| Methode | Pfad | Permission | Beschreibung |
|---|---|---|---|
| GET | `/users/:handle/profile` | — | Öffentliches Profil (Sichtbarkeitseinstellungen P-7 angewendet; 404 bei gelöscht) |
| GET | `/users/:handle/contributions` | — | Beitragshistorie (Betrachter-berechtigungsgefiltert, Cursor) |
| GET | `/users/:handle/achievements` | — | Achievements (sofern sichtbar) |
| GET/PATCH | `/users/me/profile` | auth | Eigenes Profil lesen/ändern (Bio, Links validiert, Skills ≤ 20) |
| PUT | `/users/me/profile/visibility` | auth | Sichtbarkeitseinstellungen |

## Reputation

| Methode | Pfad | Permission | Beschreibung |
|---|---|---|---|
| GET | `/users/:handle/reputation` | — | Summary (sofern sichtbar) |
| GET | `/users/me/reputation/ledger` | auth | Eigene Punktebuchungen (nachvollziehbar, US-07-03) |

## Achievements-Katalog

| Methode | Pfad | Permission | Beschreibung |
|---|---|---|---|
| GET | `/achievements` | — | Definierte Achievements (aktivierte) |

## Administration

| Methode | Pfad | Permission | Beschreibung |
|---|---|---|---|
| POST | `/admin/reputation/adjust` | `profile.reputation.manage` | Korrekturbuchung ±Punkte mit Pflicht-Begründung (P-1, auditiert) |
| POST | `/admin/reputation/recalculate` | `profile.reputation.manage` | Voll-Rebuild (202, P-6) |
| GET/POST/PATCH | `/admin/achievements[/:key]` | `profile.achievement.manage` | Katalog verwalten (enable/disable, Kriterien) |
| PATCH | `/admin/profiles/:handle` | `profile.profile.moderate` | Moderation (Bio/Links entfernen, Begründung, auditiert) |
