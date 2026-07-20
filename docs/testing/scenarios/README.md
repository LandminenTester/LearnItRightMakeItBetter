# E2E-Szenariokataloge

**Status:** Verbindlich · **Stand:** 2026-07-20 · **Setup:** [../04-e2e-testing.md](../04-e2e-testing.md)

Fachbereichs-Kataloge der End-to-End-Szenarien. Jedes Szenario referenziert seine User
Stories — die dortigen Akzeptanzkriterien sind die Assertions. `@core` = Teil der
PR-Kern-Suite.

| Katalog | Fachbereich | Epics |
|---|---|---|
| [wissens-loop.md](wissens-loop.md) | Artikel erstellen → Review → Publikation → Suche → Verbesserung | E-04, E-06, E-10 |
| [identity-auth.md](identity-auth.md) | Registrierung, Login, OAuth, MFA, Sessions, Konto-Lifecycle | E-02, E-12 |
| [translation.md](translation.md) | Übersetzungs-Workflow inkl. Outdated-Kaskade | E-05 |
| [organization-enterprise.md](organization-enterprise.md) | Organisationen, private Inhalte, Rechte, Leak-Prüfungen | E-08, E-03 |

Weitere Kataloge entstehen mit den Phasen (Profile/Reputation, Repository-Sync mit
GitHub-Fake, Setup-Wizard — letzterer in [04-e2e-testing.md §4](../04-e2e-testing.md)).
