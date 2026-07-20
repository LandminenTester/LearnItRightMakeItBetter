# Schema-Referenz pro Modul

**Status:** Verbindlich · **Stand:** 2026-07-20 ·
Konventionen: [../01-data-model-overview.md](../01-data-model-overview.md)

Ein Dokument pro Backend-Modul. Notation: Spaltennamen im Prisma-Client-Format (`camelCase`);
DB-seitig gilt `snake_case` (K-DB-11). Typen sind Prisma-Typen; `uuid` = `String @db.Uuid`
(UUIDv7). Alle Tabellen haben zusätzlich `createdAt`/`updatedAt` (K-DB-4) — dort nicht
wiederholt.

| Modul | Schema | Tabellen |
|---|---|---|
| Identity | [identity.md](identity.md) | users, user_credentials, auth_provider_configs, auth_identities, sessions, mfa_credentials, recovery_codes, personal_access_tokens, invitations, email_tokens, handle_redirects |
| Authorization | [authorization.md](authorization.md) | permissions, roles, role_permissions, role_assignments, groups, group_members, policies |
| Profile | [profile.md](profile.md) | profiles, contribution_events, reputation_ledger, reputation_summaries, achievement_definitions, user_achievements |
| Knowledge | [knowledge.md](knowledge.md) | spaces, categories, articles, article_versions, article_reviews, comments, article_feedback, tags, article_tags, slug_redirects, article_project_links |
| Translation | [translation.md](translation.md) | content_languages, article_translations, translation_versions, translation_reviews |
| Organization | [organization.md](organization.md) | organizations, organization_members, teams, team_members, organization_invites |
| Search | [search.md](search.md) | — (keine eigenen Tabellen; Index-Definitionen) |
| Repository | [repository.md](repository.md) | projects, repository_links, repository_metadata |
| Media | [media.md](media.md) | media_objects, media_usages |
| Notification | [notification.md](notification.md) | notifications, notification_preferences, watches, email_logs, webhook_endpoints |
| Audit | [audit.md](audit.md) | audit_events |
| Configuration | [configuration.md](configuration.md) | instance_settings, module_flags, setup_state |
