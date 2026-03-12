import { test, expect } from 'playwright/test';

test('shows the starter screen', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: /what would you like to know\?/i }),
  ).toBeVisible();
});
