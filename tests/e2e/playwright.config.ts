import { defineConfig, devices } from '@playwright/test';

// Setup & Konventionen: docs/testing/04-e2e-testing.md.
// Voraussetzung: laufender Stack (pnpm infra:up + pnpm dev bzw. compose.e2e in CI, Phase 1).
export default defineConfig({
  testDir: './specs',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0, // max. 1 Auto-Retry (Flake-Politik testing/01 §5)
  reporter: process.env.CI ? [['html', { open: 'never' }], ['github']] : 'list',
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium-desktop', use: { ...devices['Desktop Chrome'] } },
    // Nightly-Matrix (Firefox, WebKit, Mobile 375px) folgt mit der Voll-Suite (testing/04 §1)
  ],
});
