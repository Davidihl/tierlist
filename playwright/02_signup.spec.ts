import { expect, test } from '@playwright/test';

test('signup test', async ({ page }) => {
  // Open webpage
  await page.goto('http://localhost:3000/');

  // Click on CTA
  await page.getByRole('link', { name: 'Login Login' }).click();

  // Check heading
  await expect(
    page.getByRole('heading', {
      name: 'Login',
    }),
  ).toBeVisible();

  // Click on sign up
  await page
    .getByRole('link', { name: 'No account yet? Sign up here instead!' })
    .click();

  // Check heading
  await expect(
    page.getByRole('heading', {
      name: 'Sign up',
    }),
  ).toBeVisible();

  // Fill out form
  await page.getByPlaceholder('Username').fill('Playwright');
  await page.getByPlaceholder('Password', { exact: true }).fill('password1!');
  await page.getByPlaceholder('Repeat password').fill('password1!');
  await page.getByPlaceholder('Gamertag').fill('Playwright');

  // Sign up
  await page.getByRole('button', { name: 'Sign up' }).click();

  // Check heading
  await expect(
    page.getByRole('heading', {
      name: 'Playwright',
    }),
  ).toBeVisible();

  // Click on edit
  await page.getByRole('button').nth(2).click();
  await expect(
    page.getByRole('heading', { name: 'Edit Profile' }),
  ).toBeVisible();

  // Click on delete
  await page.getByRole('button', { name: 'Delete Account' }).click();

  // Check heading
  // Check heading
  await expect(
    page.getByRole('heading', {
      name: 'Connecting Talent. Amplifying Recognition. Shaping Esports.',
    }),
  ).toBeVisible();
});
