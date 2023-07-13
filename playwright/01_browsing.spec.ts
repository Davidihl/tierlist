import { expect, test } from '@playwright/test';

test('navigation test', async ({ page }) => {
  // Open webpage
  await page.goto('http://localhost:3000/');

  // Check heading
  await expect(
    page.getByRole('heading', {
      name: 'Connecting Talent. Amplifying Recognition. Shaping Esports.',
    }),
  ).toBeVisible();

  // Click on CTA
  await page.getByRole('link', { name: 'Browser Players' }).click();

  // Check heading
  await expect(
    page.getByRole('heading', {
      name: 'Players',
    }),
  ).toBeVisible();

  // Click on Player
  await page.getByRole('link', { name: 'Chaoslordi' }).click();
  await expect(page.getByRole('heading', { name: 'Chaoslordi' })).toBeVisible();

  // Click on Menu
  await page
    .locator('button')
    .filter({ hasText: 'Browser playersORBrowser organisations' })
    .click();
  await expect(
    page.getByRole('link', { name: 'Browser organisations' }),
  ).toBeVisible();

  // Click on Organisations
  await page.getByRole('link', { name: 'Browser organisations' }).click();

  // Check heading
  await expect(
    page.getByRole('heading', {
      name: 'Organisations',
    }),
  ).toBeVisible();

  // Click on Organisation
  await page.getByRole('link', { name: 'Austrian Force' }).click();
  await expect(
    page.getByRole('heading', {
      name: 'Austrian Force',
      exact: true,
    }),
  ).toBeVisible();

  // Click on Logo
  await page.getByRole('link', { name: 'ESVÖ Logo' }).click();
  await expect(
    page.getByRole('heading', {
      name: 'Connecting Talent. Amplifying Recognition. Shaping Esports.',
    }),
  ).toBeVisible();
});
