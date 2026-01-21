import { test, expect } from '@playwright/test';

test.describe('Fluxo de Login', () => {
  test.beforeEach(async ({ page }) => {
    // Navega para a página inicial antes de cada teste
    await page.goto('/');
  });

  test('deve permitir que um usuário faça login e seja redirecionado para o dashboard', async ({ page }) => {
    // Encontra o campo de e-mail pelo seu placeholder e o preenche
    await page.getByPlaceholder('exemplo@gmail.com').fill('promotor2@test.com');

    // Encontra o campo de senha pelo seu placeholder e o preenche
    await page.getByPlaceholder('********').fill('12345678');

    // Clica no botão de login
    await page.getByRole('button', { name: 'Entrar' }).click();

    // Aguarda a navegação e verifica se a URL é a do dashboard
    await expect(page).toHaveURL('/DashboardScreen');
  });

   test('deve exibir uma mensagem de erro com credenciais inválidas', async ({ page }) => {
    // Preenche o formulário com credenciais incorretas
    await page.getByPlaceholder('exemplo@gmail.com').fill('email@errado.com');
    await page.getByPlaceholder('********').fill('senhaerrada');

    // Clica no botão de login
    await page.getByRole('button', { name: 'Entrar' }).click();
// ... existing code ...
  });
});
