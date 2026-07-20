import 'dotenv/config';
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loadEnv } from './common/config/env.config';

/**
 * Bootstrap des Worker-Modus: gleiches Modul-Set, keine HTTP-Listener —
 * BullMQ-Prozessoren registrieren sich hier (docs/architecture/04 §6).
 * Queues (mail, search-index, media, repo-sync, maintenance) folgen mit den Fachmodulen.
 */
async function bootstrapWorker(): Promise<void> {
  const env = loadEnv();
  const app = await NestFactory.createApplicationContext(AppModule);
  app.enableShutdownHooks();

  console.log(`[lir-worker] Worker-Modus bereit (${env.NODE_ENV}) — Queues folgen in Phase 1.`);

  const shutdown = async (): Promise<void> => {
    await app.close();
    process.exit(0);
  };
  process.on('SIGTERM', () => void shutdown());
  process.on('SIGINT', () => void shutdown());
}

void bootstrapWorker();
