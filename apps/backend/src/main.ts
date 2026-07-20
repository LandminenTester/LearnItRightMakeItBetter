import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loadEnv } from './common/config/env.config';

/**
 * Bootstrap des API-Modus (docs/architecture/04-backend-architecture.md).
 * Health-Endpoints liegen außerhalb des API-Prefix (FR-PLAT-005).
 */
async function bootstrap(): Promise<void> {
  const env = loadEnv();
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1', {
    exclude: ['healthz', 'readyz', 'metrics'],
  });
  app.enableShutdownHooks(); // Graceful Shutdown (NFR-011)

  await app.listen(env.PORT);
  // eslint-disable-next-line no-console -- Bootstrap-Meldung vor Logger-Initialisierung (Phase 0: pino folgt)
  console.log(`[lir-backend] API bereit auf Port ${env.PORT} (${env.NODE_ENV})`);
}

void bootstrap();
