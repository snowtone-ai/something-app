import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('full core loop: add → burn → slay → rescue → persist', async ({ page }) => {
  await expect(page.getByText('Zenny the egg')).toBeVisible();
  await expect(page.getByText(/nothing tracked yet/i)).toBeVisible();

  // add via preset
  await page.getByRole('button', { name: 'Add subscription' }).click();
  const dialog = page.getByRole('dialog', { name: 'New subscription' });
  await dialog.getByLabel('Preset').selectOption('Adobe Creative Cloud');
  await expect(dialog.getByLabel('Name')).toHaveValue('Adobe Creative Cloud');
  await expect(dialog.getByLabel(/price/i)).toHaveValue('59.99');
  await dialog.getByRole('button', { name: 'Save' }).click();

  // burn totals update
  await expect(page.getByLabel('Monthly burn')).toContainText('$59.99');
  await expect(page.getByLabel('Yearly burn')).toContainText('$719.88');

  // weekly check-in appears; answer "No" → zombie badge
  await expect(page.getByLabel('Weekly check-in')).toContainText('Adobe Creative Cloud');
  await page.getByLabel('Weekly check-in').getByRole('button', { name: 'No', exact: true }).click();
  await expect(page.getByText('🧟 zombie')).toBeVisible();

  // slay it
  await page.getByRole('button', { name: 'Slay Adobe Creative Cloud' }).click();
  await expect(page.getByLabel('Trophy shelf')).toContainText('Adobe Creative Cloud');
  await expect(page.getByText('Zenny the dragon')).toBeVisible();
  await expect(page.getByText('Lv. 5')).toBeVisible();
  await expect(page.getByLabel('Monthly burn')).toContainText('$0.00');
  await page.screenshot({ path: 'test-results/dragon.png', fullPage: true });

  // share card renders and offers a PNG download
  await page.getByRole('button', { name: 'Share victory' }).click();
  const share = page.getByRole('dialog', { name: 'Share your victory' });
  await expect(share.getByRole('link', { name: 'Download image' })).toHaveAttribute(
    'href',
    /^data:image\/png/
  );
  await share.getByRole('button', { name: 'Close' }).click();

  // persists across reload
  await page.reload();
  await expect(page.getByLabel('Trophy shelf')).toContainText('Adobe Creative Cloud');
  await expect(page.getByText('Zenny the dragon')).toBeVisible();
});

test('manual entry, editing and currency switching', async ({ page }) => {
  await page.getByRole('button', { name: 'Add subscription' }).click();
  const dialog = page.getByRole('dialog', { name: 'New subscription' });
  await dialog.getByLabel('Name').fill('My Gym');
  await dialog.getByLabel(/price/i).fill('40');
  await dialog.getByLabel('Billing cycle').selectOption('monthly');
  await dialog.getByRole('button', { name: 'Save' }).click();

  await expect(page.getByLabel('Monthly burn')).toContainText('$40.00');

  // edit the price
  await page.getByRole('button', { name: 'Edit My Gym' }).click();
  const edit = page.getByRole('dialog', { name: 'Edit subscription' });
  await edit.getByLabel(/price/i).fill('45');
  await edit.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByLabel('Monthly burn')).toContainText('$45.00');

  // currency switch reformats
  await page.getByLabel('Currency').selectOption('JPY');
  await expect(page.getByLabel('Monthly burn')).toContainText('¥');
});

test('layout integrity on mobile viewport (no horizontal overflow)', async ({ page }) => {
  await page.getByRole('button', { name: 'Add subscription' }).click();
  const dialog = page.getByRole('dialog', { name: 'New subscription' });
  await dialog.getByLabel('Preset').selectOption('Netflix');
  await dialog.getByRole('button', { name: 'Save' }).click();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow).toBeLessThanOrEqual(0);

  await page.screenshot({ path: 'test-results/dashboard.png', fullPage: true });
});
