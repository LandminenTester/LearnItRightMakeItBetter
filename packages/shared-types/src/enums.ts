import { z } from 'zod';

// Statuswerte und Typen gemäß docs/requirements/07-glossary.md und den Schema-Referenzen
// (docs/database/schemas/). Erweiterungen nur zusammen mit Schema + Doku im selben PR.

export const ArticleType = z.enum([
  'learning_basic',
  'best_practice',
  'how_to',
  'troubleshooting',
  'oss_knowledge',
]);
export type ArticleType = z.infer<typeof ArticleType>;

export const ContentStatus = z.enum(['draft', 'in_review', 'published', 'archived']);
export type ContentStatus = z.infer<typeof ContentStatus>;

export const TranslationStatus = z.enum([
  'draft',
  'in_review',
  'published',
  'outdated',
  'archived',
]);
export type TranslationStatus = z.infer<typeof TranslationStatus>;

export const SpaceVisibility = z.enum(['public', 'internal', 'organization', 'private']);
export type SpaceVisibility = z.infer<typeof SpaceVisibility>;

export const UserStatus = z.enum(['active', 'suspended', 'deactivated', 'deleted']);
export type UserStatus = z.infer<typeof UserStatus>;

export const ScopeType = z.enum(['global', 'organization', 'space', 'language']);
export type ScopeType = z.infer<typeof ScopeType>;

export const ReviewDecision = z.enum(['approved', 'changes_requested']);
export type ReviewDecision = z.infer<typeof ReviewDecision>;

export const MediaStatus = z.enum(['processing', 'ready', 'failed', 'quarantined']);
export type MediaStatus = z.infer<typeof MediaStatus>;

/** Per Instanzkonfiguration deaktivierbare Module (FR-CONF-004). */
export const ToggleableModule = z.enum([
  'organization',
  'translation',
  'repository',
  'comments',
  'achievements',
]);
export type ToggleableModule = z.infer<typeof ToggleableModule>;

/** BCP-47-Locale, z. B. "de", "en", "pt-BR" (NFR-060). */
export const Locale = z
  .string()
  .regex(/^[a-z]{2,3}(-[A-Za-z0-9]{2,8})*$/, 'Locale muss BCP-47-konform sein');
export type Locale = z.infer<typeof Locale>;
