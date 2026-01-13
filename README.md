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
- **Armazenamento seguro**: Informações protegidas (Firebase ou SQLite).
- **Desempenho otimizado**: Funciona mesmo com conexão limitada.
- **Conformidade com LGPD**: Garantindo sigilo e uso adequado dos dados.
- **Offline**: Sincronização posterior (planejado para futuro aprimoramento).

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

## ▶️ Como Executar os Testes

### Executar todos os testes:

```bash
npm test
```

### Executar apenas testes de integração:

```bash
npm test integration
```

### Executar testes com relatório de cobertura:

```bash
npm test -- --coverage
```
---

## 🏆 Critérios de Avaliação Atendidos
**Arquitetura MVVM**
Implementação correta do padrão MVVM, com separação clara entre as camadas View, ViewModel, UseCase e Repository, facilitando manutenção, testes e evolução do sistema.

**Testes Automatizados**
Aplicação consistente de testes unitários e testes de integração, garantindo a validação das regras de negócio, operações de CRUD e a comunicação entre as camadas do sistema.

**Uso de Test-Driven Development (TDD)**
Desenvolvimento de funcionalidades seguindo o ciclo RED → GREEN → REFACTOR, com evidências no histórico de commits e testes criados antes da implementação.

**Cobertura de Testes**
Distribuição de testes conforme os requisitos da disciplina, com foco em:

Testes unitários para lógica de negócio

Testes de integração para fluxos principais da aplicação

**Organização e Qualidade do Código**
Estrutura de pastas modular, padronizada e coerente com a arquitetura proposta, favorecendo legibilidade, reutilização e boas práticas de engenharia de software.

**Documentação Técnica**
README completo e bem estruturado, contendo descrição do projeto, objetivos, tecnologias, estratégia de testes, instruções de execução e identificação dos integrantes do grupo.

---

## 📚 Considerações Finais
O desenvolvimento deste aplicativo permitiu a aplicação prática dos conceitos abordados nas disciplinas de Programação para Dispositivos Móveis (PDM) e Engenharia de Software III, com ênfase na qualidade do software e na adoção de boas práticas de engenharia.

A utilização de testes automatizados, aliada à estratégia em camadas e ao uso de Test-Driven Development (TDD), contribuiu para a construção de um sistema mais confiável, organizado e preparado para evolução futura.

Além de atender plenamente aos requisitos acadêmicos, o projeto apresenta uma solução funcional e realista para o controle de promotores de campo, demonstrando a integração eficaz entre teoria e prática no desenvolvimento de aplicações mobile.

