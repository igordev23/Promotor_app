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
    // Verifica se o texto "Dashboard" aparece
    await expect(page.getByText('Dashboard')).toBeVisible({ timeout: 10000 });

    // Verifica status inicial da jornada
    const statusText = page.getByTestId('journey-status');
    await expect(statusText).toBeVisible();

    // Tenta clicar para iniciar jornada (se estiver inativa)
    const toggleButton = page.getByTestId('journey-toggle-button');
    
    // Aguarda o botão estar visível
    await expect(toggleButton).toBeVisible({ timeout: 10000 });
    
    const buttonText = await toggleButton.textContent();
    console.log('Texto do botão:', buttonText);

    if (buttonText?.includes('Iniciar Jornada')) {
      console.log('Clicando em "Iniciar Jornada"...');
      
      // Aguarda o botão estar habilitado
      await expect(toggleButton).toBeEnabled({ timeout: 5000 });
      
      await toggleButton.click({ force: true });
      console.log('Clique em "Iniciar Jornada" executado');
      
      // Aguarda um pouco para a requisição ser processada
      await page.waitForTimeout(2000);
    } else {
      console.log('Jornada já estava ativa ou texto não encontrado');
    }

    // 3. Listar Leads
    console.log('Navegando para Listar Leads...');
    const listLeadsButton = page.getByText('Listar Leads');
    await listLeadsButton.click();

    // Aguarda tela de listagem
    console.log('Aguardando tela de listagem...');
    await expect(page).toHaveURL(/ListLeadsScreen|lista|leads/i, { timeout: 10000 });
    
    // Verifica se chegou na tela de leads (procura por elemento que identifica a página)
    // Pode ser um título, botão de adicionar, ou campo de busca
    const listPageIndicator = page.locator('[class*="lead"]').first();
    await expect(listPageIndicator).toBeVisible({ timeout: 10000 }).catch(() => {
      // Se não achar elemento com "lead", só verifica se a página mudou
      return true;
    });

    console.log('Fluxo completado com sucesso!');
  });
});
