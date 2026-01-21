import { test, expect } from '@playwright/test';

test('A página de login deve carregar corretamente', async ({ page }) => {
  await expect(page.getByText('Promotor app')).toBeVisible();

  // Verifica se o campo de e-mail está visível
  await expect(page.getByPlaceholder('exemplo@gmail.com')).toBeVisible();

  // Verifica se o botão de login está visível
  await expect(page.getByRole('button', { name: 'Entrar' })).toBeVisible();
});

