import { test, expect } from '@playwright/test';

test.describe('Fluxo Principal do Promotor', () => {
  // Credenciais de teste
  const TEST_EMAIL = "promotor2@test.com";
  const TEST_PASSWORD = "12345678";

  test.beforeEach(async ({ page }) => {
    // Acessa a página inicial
    await page.goto('/');
  });

  test('Deve realizar login, iniciar jornada e listar leads', async ({ page }) => {
    // 1. Login
    console.log('Iniciando Login...');
    const emailInput = page.getByTestId('email-input');
    const passwordInput = page.getByTestId('password-input');
    const loginButton = page.getByTestId('login-button');

    // Aguarda elementos estarem visíveis
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();

    // Preenche credenciais
    await emailInput.fill(TEST_EMAIL);
    await passwordInput.fill(TEST_PASSWORD);

    // Clica em entrar
    await loginButton.click();

    // 2. Dashboard - Iniciar Jornada
    console.log('Acessando Dashboard...');
    
    // Aguarda redirecionamento para o Dashboard
    // Verifica se o texto "Dashboard" ou "Olá" aparece
    await expect(page.getByText('Dashboard')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Olá,')).toBeVisible();

    // Verifica status inicial da jornada
    const statusText = page.getByTestId('journey-status');
    await expect(statusText).toBeVisible();

    // Clica para iniciar jornada (se estiver inativa)
    const toggleButton = page.getByTestId('journey-toggle-button');
    const buttonText = await toggleButton.textContent();

    if (buttonText?.includes('Iniciar Jornada')) {
      console.log('Iniciando Jornada...');
      await toggleButton.click();
      
      // Aguarda mudança de status para Ativa
      await expect(statusText).toContainText('Ativa');
      await expect(toggleButton).toContainText('Encerrar Jornada');
    } else {
      console.log('Jornada já estava ativa.');
    }

    // Verifica se o timer está rodando (opcional, verifica se não é 00:00:00 após um tempo)
    // await page.waitForTimeout(2000);
    // const timerCard = page.getByText('Tempo Ativo').locator('..').locator('text=/:/');
    // await expect(timerCard).toBeVisible();

    // 3. Listar Leads
    console.log('Navegando para Listar Leads...');
    const listLeadsButton = page.getByTestId('list-leads-button');
    await listLeadsButton.click();

    // Aguarda tela de listagem
    await expect(page.getByTestId('search-leads-input')).toBeVisible();
    
    // Tenta buscar um lead (opcional)
    // const searchInput = page.getByTestId('search-leads-input');
    // await searchInput.fill('Teste');

    // Verifica se a lista carregou (pode estar vazia, mas a tela deve estar lá)
    // await expect(page.getByText('Leads encontrados')).toBeVisible();

    console.log('Fluxo completado com sucesso!');
  });
});
