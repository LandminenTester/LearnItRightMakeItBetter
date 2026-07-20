import { expect, test } from '@playwright/test';

// Erster Smoke — die Kern-Suite (@core) entsteht entlang der Szenariokataloge
// (docs/testing/scenarios/), beginnend mit WL-01 in Phase 1.
test.describe('Smoke @core', () => {
  test('Startseite rendert mit Titel und Design-System-Button', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Learn it right/);
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('button').first()).toBeVisible();
  });

  test('Backend-Health antwortet', async ({ request }) => {
    const apiBase = process.env.E2E_API_URL ?? 'http://localhost:3001';
    const response = await request.get(`${apiBase}/healthz`);
    expect(response.ok()).toBeTruthy();
    expect(await response.json()).toEqual({ status: 'ok' });
  });
});
