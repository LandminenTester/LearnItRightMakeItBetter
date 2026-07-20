// Zentraler Permission-Katalog — die einzige Quelle der Wahrheit (Regel A-2,
// docs/services/authorization-service.md). Ein Startup-Sync legt die Keys in der DB an.
// Schema: <modul>.<ressource>.<aktion>; Beschreibungen deutsch für die Admin-UI.

export interface PermissionDefinition {
  key: string;
  module: string;
  description: string;
}

/** Erlaubter Verbkatalog (Regel A-1). */
export const PERMISSION_ACTIONS = [
  'read',
  'create',
  'update',
  'delete',
  'submit',
  'review',
  'publish',
  'archive',
  'manage',
  'moderate',
  'assign',
  'export',
] as const;

export const PERMISSION_KEY_PATTERN =
  /^[a-z]+\.[a-z_]+\.(read|create|update|delete|submit|review|publish|archive|manage|moderate|assign|export)$/;

// Startbestand (wächst mit den Modulen — jede Ergänzung: Katalog + Nutzung + Doku im selben PR).
export const PERMISSION_CATALOG: readonly PermissionDefinition[] = [
  // knowledge
  {
    key: 'knowledge.space.create',
    module: 'knowledge',
    description: 'Wissensbereiche (Spaces) anlegen',
  },
  {
    key: 'knowledge.space.manage',
    module: 'knowledge',
    description: 'Space-Einstellungen und Sichtbarkeit verwalten',
  },
  {
    key: 'knowledge.category.manage',
    module: 'knowledge',
    description: 'Kategorien eines Space verwalten',
  },
  {
    key: 'knowledge.article.read',
    module: 'knowledge',
    description: 'Artikel lesen (nicht-öffentliche Sichtbarkeiten)',
  },
  {
    key: 'knowledge.article.create',
    module: 'knowledge',
    description: 'Artikel-Entwürfe erstellen',
  },
  {
    key: 'knowledge.article.update',
    module: 'knowledge',
    description: 'Artikel bearbeiten (neue Versionen anlegen)',
  },
  {
    key: 'knowledge.article.submit',
    module: 'knowledge',
    description: 'Artikel zur Prüfung einreichen',
  },
  { key: 'knowledge.article.publish', module: 'knowledge', description: 'Artikel publizieren' },
  {
    key: 'knowledge.article.archive',
    module: 'knowledge',
    description: 'Artikel archivieren/reaktivieren',
  },
  {
    key: 'knowledge.article.manage',
    module: 'knowledge',
    description: 'Artikel vollständig verwalten (inkl. fremder)',
  },
  {
    key: 'knowledge.article.moderate',
    module: 'knowledge',
    description: 'Artikel moderativ depublizieren',
  },
  {
    key: 'knowledge.review.review',
    module: 'knowledge',
    description: 'Artikel-Reviews durchführen',
  },
  { key: 'knowledge.comment.create', module: 'knowledge', description: 'Kommentare schreiben' },
  {
    key: 'knowledge.comment.moderate',
    module: 'knowledge',
    description: 'Kommentare moderieren/löschen',
  },
  { key: 'knowledge.tag.manage', module: 'knowledge', description: 'Tags kuratieren' },
  // translation
  {
    key: 'translation.translation.create',
    module: 'translation',
    description: 'Übersetzungen beginnen',
  },
  {
    key: 'translation.translation.manage',
    module: 'translation',
    description: 'Übersetzungen einer Sprache verwalten und publizieren',
  },
  {
    key: 'translation.review.review',
    module: 'translation',
    description: 'Übersetzungs-Reviews durchführen',
  },
  {
    key: 'translation.language.manage',
    module: 'translation',
    description: 'Content-Sprachen aktivieren/deaktivieren',
  },
  // identity
  { key: 'identity.user.read', module: 'identity', description: 'Benutzerkonten einsehen (Admin)' },
  {
    key: 'identity.user.manage',
    module: 'identity',
    description: 'Benutzerkonten verwalten (sperren, Sessions beenden)',
  },
  {
    key: 'identity.provider.manage',
    module: 'identity',
    description: 'Auth-Provider konfigurieren',
  },
  { key: 'identity.invitation.manage', module: 'identity', description: 'Einladungen verwalten' },
  // authorization
  {
    key: 'authorization.role.read',
    module: 'authorization',
    description: 'Rollen und Permission-Katalog einsehen',
  },
  {
    key: 'authorization.role.manage',
    module: 'authorization',
    description: 'Rollen erstellen und ändern',
  },
  {
    key: 'authorization.assignment.read',
    module: 'authorization',
    description: 'Rollenzuweisungen einsehen',
  },
  {
    key: 'authorization.assignment.assign',
    module: 'authorization',
    description: 'Rollen im eigenen Scope zuweisen/entziehen',
  },
  { key: 'authorization.group.read', module: 'authorization', description: 'Gruppen einsehen' },
  {
    key: 'authorization.group.manage',
    module: 'authorization',
    description: 'Gruppen und Mitgliedschaften verwalten',
  },
  {
    key: 'authorization.policy.read',
    module: 'authorization',
    description: 'ABAC-Policies einsehen',
  },
  {
    key: 'authorization.policy.manage',
    module: 'authorization',
    description: 'ABAC-Policies verwalten',
  },
  // organization
  {
    key: 'organization.organization.create',
    module: 'organization',
    description: 'Organisationen gründen',
  },
  {
    key: 'organization.organization.manage',
    module: 'organization',
    description: 'Organisation verwalten (Profil, Einstellungen)',
  },
  {
    key: 'organization.member.manage',
    module: 'organization',
    description: 'Mitglieder und Einladungen verwalten',
  },
  { key: 'organization.team.manage', module: 'organization', description: 'Teams verwalten' },
  {
    key: 'organization.space.read',
    module: 'organization',
    description: 'Organisations-Inhalte lesen',
  },
  // profile
  { key: 'profile.profile.moderate', module: 'profile', description: 'Profile moderieren' },
  {
    key: 'profile.reputation.manage',
    module: 'profile',
    description: 'Reputations-Korrekturen und Rebuilds',
  },
  {
    key: 'profile.achievement.manage',
    module: 'profile',
    description: 'Achievement-Katalog verwalten',
  },
  // repository
  { key: 'repository.project.create', module: 'repository', description: 'Projekte anlegen' },
  {
    key: 'repository.project.manage',
    module: 'repository',
    description: 'Fremde Projekte verwalten',
  },
  {
    key: 'repository.project.moderate',
    module: 'repository',
    description: 'Projekte moderieren (Verknüpfungen lösen)',
  },
  {
    key: 'repository.settings.manage',
    module: 'repository',
    description: 'Instanzweite Repository-Einstellungen (Token, Intervall)',
  },
  // media
  { key: 'media.object.create', module: 'media', description: 'Medien hochladen' },
  { key: 'media.object.manage', module: 'media', description: 'Fremde Medien verwalten/löschen' },
  {
    key: 'media.settings.manage',
    module: 'media',
    description: 'Media-Limits und Quotas verwalten',
  },
  // search
  {
    key: 'search.index.manage',
    module: 'search',
    description: 'Suchindizes verwalten (Reindex, Status)',
  },
  // audit
  { key: 'audit.event.read', module: 'audit', description: 'Audit-Log einsehen' },
  { key: 'audit.event.export', module: 'audit', description: 'Audit-Log exportieren' },
  // configuration
  {
    key: 'configuration.settings.read',
    module: 'configuration',
    description: 'Instanzeinstellungen einsehen',
  },
  {
    key: 'configuration.settings.manage',
    module: 'configuration',
    description: 'Instanzeinstellungen und Module verwalten',
  },
  {
    key: 'configuration.branding.manage',
    module: 'configuration',
    description: 'Branding-Assets verwalten',
  },
] as const;

export type PermissionKey = (typeof PERMISSION_CATALOG)[number]['key'];
