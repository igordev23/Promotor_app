# Aplicativo de Controle de Promotores de Campo

## 📋 Identificação dos Integrantes do Grupo
- **Francisco Igor Silva Santos** - 2024116TADS0030
- **Sávyo Francisco Barbosa Nascimento** - 20204116TADS0003
- **Mardone Silva Pereira** - 2024116TADS0034
- **Ikaro Herbert Vasconcelos Gomes** - 2024116TADS0032
- **Carlos André Sampaio do Nascimento** - 2024116TADS0026

---

## 📝 Introdução
O presente projeto visa desenvolver um aplicativo móvel para controle e acompanhamento de promotores de campo. Atualmente, o processo é manual e dependente de registros em papel, o que causa retrabalho e falta de controle sobre as atividades realizadas. O sistema proposto busca automatizar e digitalizar esse processo, aumentando a eficiência e a confiabilidade das informações.

---

## 🎯 Objetivo Geral
Desenvolver um aplicativo que automatize o processo de controle de promotores, possibilitando o registro digital de leads, rastreamento de localização e acompanhamento de jornada de trabalho em tempo real.

---

## 🎯 Objetivos Específicos
- Eliminar o uso de papel nos registros de leads.
- Aumentar a produtividade e reduzir o tempo de digitação manual.
- Permitir que o supervisor acompanhe os promotores em tempo real.
- Garantir a confiabilidade dos dados registrados em campo.
- Gerar exportações de dados em formato Excel.

---

## 📋 Justificativa
O processo manual atual consome tempo, gera custos com papel e depende exclusivamente da confiança nos promotores. A digitalização proporcionará maior transparência, controle e eficiência, beneficiando tanto os gestores quanto os colaboradores.

---

## 🛠️ Tecnologias Utilizadas
- **Expo**: Framework para desenvolvimento de aplicativos React Native.
- **React Navigation**: Biblioteca para navegação entre telas.
- **TypeScript**: Superset do JavaScript para tipagem estática.
- **React Native Paper**: Componentes de UI para React Native.
- **Tailwind CSS**: Utilizado para estilização.
- **Axios**: Para integração com APIs.
- **Jest**: Framework de testes para JavaScript.
- **React Testing Library**: Biblioteca para testes de hooks e componentes React.

---

## 📂 Estrutura de Pastas
A estrutura do projeto foi organizada de forma a refletir a arquitetura MVVM:

```bash
src/
├── app/                # Telas do aplicativo
│   ├── RegisterLeadScreen.tsx
│   ├── ListLeadsScreen.tsx
│   ├── DashboardScreen.tsx
│   ├── loginScreen.tsx
│   └── _layout.tsx
├── model/              # Camada de Model
│   ├── entities/       # Entidades do domínio
│   ├── repositories/   # Repositórios de dados
│   └── services/       # Serviços auxiliares
├── view/               # Componentes visuais
│   └── components/
├── viewmodel/          # Hooks da camada ViewModel
├── __tests__/          # Testes automatizados
│   ├── repository/     # Testes dos repositórios
│   └── viewmodel/      # Testes das ViewModels
└── utils/              # Funções utilitárias
```

---

## 🏗️ Funcionalidades Implementadas
### Escopo Funcional
- **Registro digital de leads**: Nome, contato, cpf.

### Escopo Não Funcional
- **Aplicativo híbrido**: Desenvolvido com Expo e React Native.
- **Interface intuitiva**: Focada na usabilidade.
- **Armazenamento seguro**: Informações protegidas (Supabase).
- **Desempenho otimizado**: Funciona mesmo com conexão limitada.
- **Conformidade com LGPD**: Garantindo sigilo e uso adequado dos dados.
---

## 🚀 Passo a Passo para Executar o App

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/igordev23/Promotor_app.git
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento**:
   ```bash
   npx expo start
   ```

4. **Abra o aplicativo**:
   - Escaneie o QR Code no terminal com o aplicativo **Expo Go** no seu dispositivo móvel.
   - Ou pressione `a` para abrir no emulador Android ou `i` para abrir no emulador iOS.

---

## 🧪 Estratégia Geral de Testes

A estratégia de testes adotada no projeto segue uma **abordagem em camadas**, respeitando a arquitetura do sistema:

```
ViewModel → UseCase → Repository
```

Foram utilizados dois níveis principais de teste:

### ✔️ Testes Unitários

* Focados na **camada de UseCase**
* Validação de regras de negócio, fluxos e comportamentos isolados
* Uso de **mocks** para os repositórios (`ILeadRepository`)

### ✔️ Testes de Integração

* Validação da comunicação entre **ViewModel e UseCase**
* Garantia de que as ações do ViewModel refletem corretamente no estado da aplicação

---

## 📊 Distribuição e Cobertura de Testes

A distribuição de cobertura foi definida conforme os requisitos da disciplina:

### 🧩 Testes Unitários (mínimo 70%)

* Aplicados às classes que contêm **lógica de negócio**
* Priorizam:

  * Validações
  * Regras de domínio
  * Comportamentos independentes da interface gráfica

### 🔗 Testes de Integração (mínimo 30%)

* Aplicados aos **fluxos principais do aplicativo**
* Validam a integração entre:

  * ViewModel ↔ UseCase

---

## 🔁 Uso de Test-Driven Development (TDD)

Duas funcionalidades do sistema foram **desenvolvidas obrigatoriamente com TDD**, seguindo rigorosamente o ciclo:

```
RED → GREEN → REFACTOR
```

### 🟥 RED

* Criação dos testes **antes da implementação**
* Os testes falham porque os métodos ainda não existem

### 🟩 GREEN

* Implementação mínima do código necessário para fazer os testes passarem

### 🔵 REFACTOR

* Refatoração do código para melhorar clareza e organização
* Garantia de que todos os testes continuam passando

O histórico de commits evidencia claramente cada uma dessas etapas.

---

## 🧠 Funcionalidades Desenvolvidas com TDD

### 1️⃣ Remover Lead

**Problema resolvido:**
Permitir a exclusão de um lead do sistema de forma segura, garantindo que a regra de negócio seja respeitada.

**Processo TDD:**

* Teste criado para o método `removeLead(id)` no `LeadUseCase`
* O método não existia inicialmente (RED)
* Implementação delegando a chamada para `repository.delete(id)` (GREEN)
* Refatoração para validações e clareza do código (REFACTOR)

**Testes aplicados:**

* Teste unitário do `LeadUseCase`
* Teste de integração validando o fluxo ViewModel ↔ UseCase

---

### 2️⃣ Editar Lead

**Problema resolvido:**
Permitir a edição dos dados de um lead existente, respeitando as regras de validação do domínio.

**Processo TDD:**

* Teste criado para o método `editLead(id, data)` no `LeadUseCase`
* Método inexistente no início (RED)
* Implementação mínima delegando para `repository.update(id, data)` (GREEN)
* Refatoração mantendo regras de validação e organização (REFACTOR)

**Testes aplicados:**

* Teste unitário do `LeadUseCase`

---

## 🔗 Testes de Integração

Os testes de integração validam se os **ViewModels consomem corretamente os UseCases**, garantindo a coerência entre as camadas.

### Exemplo validado:

* `useListLeadsViewModel` chamando corretamente:

  * `leadUseCase.removeLead(id)`
* Atualização correta do estado interno após a remoção

Esses testes asseguram que o fluxo principal do aplicativo funciona conforme o esperado.

---

## 🎭 Testes E2E (End-to-End) com Playwright

Testes automatizados que validam os fluxos completos da aplicação do ponto de vista do usuário, simulando interações reais com a interface gráfica.

### 📝 Escopo dos Testes E2E

O teste automatizado `core-flow.spec.ts` valida o **fluxo principal do promotor**:

1. **Autenticação**: Login com credenciais válidas
2. **Dashboard**: Acesso à tela principal após login
3. **Iniciar Jornada**: Tentativa de ativar a jornada de trabalho
4. **Navegação**: Acesso à tela de listagem de leads

### 🛠️ Configuração do Playwright

O projeto utiliza **Playwright** para testes E2E com as seguintes configurações:

```typescript
// playwright.config.ts
{
  testDir: './e2e',           // Diretório de testes
  baseURL: 'http://localhost:8081',  // URL da aplicação
  fullyParallel: true,        // Testes executados em paralelo
  retries: 0,                 // Sem retentativas padrão
  workers: undefined,         // Usa limite padrão
  reporter: 'html',           // Relatório em HTML
  webServer: {
    command: 'npm run web',   // Inicia servidor automaticamente
    url: 'http://localhost:8081',
    timeout: 120 * 1000,      // 2 minutos para iniciar
  }
}
```

### 📊 Estrutura dos Testes

```
e2e/
├── core-flow.spec.ts        # Teste do fluxo principal
```

### 🔍 Detalhes do Teste Principal

**Arquivo**: `e2e/core-flow.spec.ts`

**Descrição**: Valida o fluxo completo desde o login até a navegação para listagem de leads.

**Passos executados**:

1. **Login**:
   - Preenche campo de email: `promotor2@test.com`
   - Preenche campo de senha: `12345678`
   - Clica em "Entrar"

2. **Dashboard**:
   - Verifica carregamento da tela do Dashboard
   - Valida visibilidade do status da jornada
   - Clica em "Iniciar Jornada" (se disponível)
   - Aguarda processamento da requisição

3. **Navegação**:
   - Clica em "Listar Leads"
   - Verifica se a página de listagem foi carregada

**Timeout padrão**: 10 segundos por ação

**Aguardo de requisições**: 2-3 segundos para processar mudanças de estado

---

## ▶️ Como Executar os Testes

### Testes Unitários e de Integração (Jest)

#### Executar todos os testes:

```bash
npm test
```

#### Executar apenas testes de integração:

```bash
npm test integration
```

#### Executar testes com relatório de cobertura:

```bash
npm test -- --coverage
```

### Testes E2E (Playwright)

#### Executar todos os testes E2E:

```bash
npx playwright test
```

#### Executar em modo de visualização interativo:

```bash
npx playwright test --ui
```

#### Executar testes E2E com modo debug:

```bash
npx playwright test --debug
```

#### Executar um arquivo de teste específico:

```bash
npx playwright test e2e/core-flow.spec.ts
```

#### Executar um teste específico por nome:

```bash
npx playwright test -g "Deve realizar login"
```

#### Ver relatório HTML dos testes:

```bash
npx playwright show-report
```

#### Visualizar vídeos de teste gravados:

Os vídeos dos testes são salvos em `test-results/` quando um teste falha. Acesse através do relatório HTML.

---

## 📋 Guia para Adicionar Novos Testes E2E

### Estrutura Básica de um Teste

```typescript
import { test, expect } from '@playwright/test';

test.describe('Descrição da funcionalidade', () => {
  test.beforeEach(async ({ page }) => {
    // Setup: Executado antes de cada teste
    await page.goto('/');
  });

  test('Deve descrever o comportamento esperado', async ({ page }) => {
    // Arrange: Preparar dados
    const input = page.getByTestId('my-input');

    // Act: Executar ações
    await input.fill('texto');
    await page.getByRole('button', { name: /submit/i }).click();

    // Assert: Verificar resultado
    await expect(page.getByText('sucesso')).toBeVisible();
  });
});
```

### Seletores Recomendados (em ordem de preferência)

1. **Test IDs** (mais confiável):
   ```typescript
   page.getByTestId('element-id')
   ```

2. **Texto visível**:
   ```typescript
   page.getByText('Texto exato')
   page.getByRole('button', { name: /regex/i })
   ```

3. **Placeholder (para inputs)**:
   ```typescript
   page.getByPlaceholder('Digite seu email')
   ```

4. **CSS Selector** (último recurso):
   ```typescript
   page.locator('selector')
   ```

### Boas Práticas para Testes E2E

✅ **Faça**:
- Aguarde elementos estarem visíveis antes de interagir
- Use timeouts apropriados (10s para navegação, 5s para ações)
- Escreva testes legíveis com descrições claras
- Teste fluxos completos do usuário, não apenas componentes isolados
- Use `test.beforeEach()` para setup comum
- Adicione logs com `console.log()` para debug

❌ **Evite**:
- Timeouts muito curtos que causam flakiness
- Testes que dependem um do outro
- Seletores frágeis (classes dinâmicas, IDs sem testID)
- Testes muito longos (divida em múltiplos testes)
- Dados hardcoded (use arquivos de configuração)

### Configurar testID em Componentes React

Para melhorar a robustez dos testes, adicione `testID` aos componentes:

```typescript
// Exemplo com React Native Paper Button
<Button
  testID="submit-button"
  mode="contained"
  onPress={handleSubmit}
>
  Enviar
</Button>
```

### Debugging de Testes

Se um teste falhar:

1. **Verifique o erro no relatório HTML**:
   ```bash
   npx playwright show-report
   ```

2. **Execute em modo debug**:
   ```bash
   npx playwright test --debug --headed
   ```

3. **Verifique o vídeo da falha**:
   - Disponível em `test-results/` para testes falhados

4. **Aumente o timeout temporariamente**:
   ```typescript
   await expect(element).toBeVisible({ timeout: 30000 });
   ```

---

## 🏆 Critérios de Avaliação Atendidos

**Arquitetura MVVM**
Implementação correta do padrão MVVM, com separação clara entre as camadas View, ViewModel, UseCase e Repository, facilitando manutenção, testes e evolução do sistema.

**Testes Automatizados**
Aplicação consistente de testes unitários, testes de integração e testes E2E, garantindo:
- Validação das regras de negócio
- Operações de CRUD funcionando corretamente
- Comunicação entre as camadas do sistema
- Fluxos completos do usuário simulados através de testes E2E

**Uso de Test-Driven Development (TDD)**
Desenvolvimento de funcionalidades seguindo o ciclo RED → GREEN → REFACTOR, com evidências no histórico de commits e testes criados antes da implementação.

**Cobertura de Testes**
Distribuição de testes conforme os requisitos da disciplina, com foco em:

- Testes unitários para lógica de negócio
- Testes de integração para fluxos principais da aplicação
- Testes E2E para validar fluxos completos do usuário

**Organização e Qualidade do Código**
Estrutura de pastas modular, padronizada e coerente com a arquitetura proposta, favorecendo legibilidade, reutilização e boas práticas de engenharia de software.

**Documentação Técnica**
README completo e bem estruturado, contendo:
- Descrição do projeto e objetivos
- Tecnologias utilizadas
- Estratégia de testes (unitários, integração e E2E)
- Instruções de execução
- Guia para adicionar novos testes
- Identificação dos integrantes do grupo

---

## 📚 Considerações Finais
O desenvolvimento deste aplicativo permitiu a aplicação prática dos conceitos abordados nas disciplinas de Programação para Dispositivos Móveis (PDM) e Engenharia de Software III, com ênfase na qualidade do software e na adoção de boas práticas de engenharia.

A utilização de testes automatizados em múltiplas camadas (unitários, integração e E2E), aliada à estratégia em camadas e ao uso de Test-Driven Development (TDD), contribuiu para a construção de um sistema mais confiável, organizado e preparado para evolução futura.

Além de atender plenamente aos requisitos acadêmicos, o projeto apresenta uma solução funcional e realista para o controle de promotores de campo, demonstrando a integração eficaz entre teoria e prática no desenvolvimento de aplicações mobile.

