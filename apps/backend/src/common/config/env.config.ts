import { z } from 'zod';

/**
 * Typisiertes ENV-Loading mit Fail-fast-Validierung
 * (docs/architecture/04-backend-architecture.md §5). Vollständiger Katalog:
 * docs/deployment/04-configuration-reference.md — Pflichtfelder werden mit dem
 * jeweiligen Modul scharf geschaltet (Skeleton: Infrastruktur-Werte optional).
 */
export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  APP_URL: z.string().url().default('http://localhost:3000'),
  PORT: z.coerce.number().int().positive().default(3001),
  WORKER: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
  TRUST_PROXY: z.coerce.number().int().min(0).default(1),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  MAINTENANCE_MODE: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),

  DATABASE_URL: z.string().min(1).optional(),
  DATABASE_POOL_SIZE: z.coerce.number().int().positive().default(10),
  REDIS_URL: z.string().min(1).optional(),
  MEILI_HOST: z.string().url().optional(),
  MEILI_MASTER_KEY: z.string().optional(),

  STORAGE_DRIVER: z.enum(['filesystem', 's3', 'azure-blob', 'gcs']).default('filesystem'),
  STORAGE_FS_PATH: z.string().default('./data/media'),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Parst und validiert die Umgebung; bricht mit verständlicher Meldung ab (fail-fast).
 */
export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  const result = envSchema.safeParse(source);
  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    throw new Error(`Ungültige Umgebungskonfiguration:\n${details}`);
  }
  return result.data;
}
