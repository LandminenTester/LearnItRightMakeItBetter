import { Module } from '@nestjs/common';
import { HealthController } from './common/health/health.controller';
import { IdentityModule } from './modules/identity';
import { AuthorizationModule } from './modules/authorization';
import { ProfileModule } from './modules/profile';
import { KnowledgeModule } from './modules/knowledge';
import { TranslationModule } from './modules/translation';
import { OrganizationModule } from './modules/organization';
import { SearchModule } from './modules/search';
import { RepositoryModule } from './modules/repository';
import { MediaModule } from './modules/media';
import { NotificationModule } from './modules/notification';
import { AuditModule } from './modules/audit';
import { ConfigurationModule } from './modules/configuration';

/**
 * Wurzelmodul des modularen Monolithen — die 12 Fachmodule gemäß
 * docs/architecture/02-module-boundaries.md.
 */
@Module({
  imports: [
    IdentityModule,
    AuthorizationModule,
    ProfileModule,
    KnowledgeModule,
    TranslationModule,
    OrganizationModule,
    SearchModule,
    RepositoryModule,
    MediaModule,
    NotificationModule,
    AuditModule,
    ConfigurationModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
