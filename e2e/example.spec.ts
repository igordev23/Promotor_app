import { test, expect } from '@playwright/test';

test('A página de login deve carregar corretamente', async ({ page }) => {
  await expect(page.getByText('Promotor app')).toBeVisible();

  await expect(page.getByPlaceholder('exemplo@gmail.com')).toBeVisible();

  await expect(page.getByRole('button', { name: 'Entrar' })).toBeVisible();
});
