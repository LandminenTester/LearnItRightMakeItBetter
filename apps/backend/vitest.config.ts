import { defineConfig } from 'vitest/config';
import swc from 'unplugin-swc';

// SWC-Plugin: NestJS-Decorators (emitDecoratorMetadata) funktionieren in Tests
// (docs/testing/02-backend-testing.md).
export default defineConfig({
  plugins: [
    swc.vite({
      jsc: {
        parser: { syntax: 'typescript', decorators: true },
        transform: { decoratorMetadata: true, legacyDecorator: true },
        target: 'es2022',
      },
    }),
  ],
  test: {
    environment: 'node',
    include: ['src/**/*.spec.ts'],
  },
});
