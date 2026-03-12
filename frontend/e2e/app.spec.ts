import { test, expect } from 'playwright/test';

test('shows the starter screen', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: /react frontend and \.net 10 api scaffold/i }),
  ).toBeVisible();
});
