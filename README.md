# ToDo List com Arquitetura MVVM, Inversão de Dependências e Testes Automatizados

## 📋 Identificação dos Integrantes do Grupo
- **Francisco Igor Silva Santos** - 2024116TADS0030 
- **Sávyo Francisco Barbosa Nascimento** - 20204116TADS0003  
- **Nome Completo 3** - Matrícula 3  
- **Nome Completo 4** - Matrícula 4
- **Nome Completo 5** - Matrícula 5   

## 📝 Descrição do Projeto
Este projeto é uma aplicação de lista de tarefas (ToDo List) desenvolvida utilizando a arquitetura **MVVM (Model-View-ViewModel)**, com aplicação de **Inversão de Dependências (DI)** e **testes automatizados**. O aplicativo é composto por três telas principais:
1. **Tela de Lista de Tarefas**: Exibe todas as tarefas criadas.
2. **Tela de Criar Tarefa**: Permite criar novas tarefas.
3. **Tela de Detalhes da Tarefa**: Exibe os detalhes de uma tarefa específica, com opções para editar ou excluir.

O objetivo do projeto é demonstrar a aplicação de boas práticas de desenvolvimento, como separação de responsabilidades, organização modular e testes automatizados.

## 🛠️ Tecnologias Utilizadas
- **Expo**: Framework para desenvolvimento de aplicativos React Native.
- **React Navigation**: Biblioteca para navegação entre telas.
- **TypeScript**: Superset do JavaScript para tipagem estática.
- **Jest**: Framework de testes para JavaScript.
- **React Testing Library**: Biblioteca para testes de hooks e componentes React.

---

## 🏗️ Aplicação de MVVM, DI e Testes

### 🔹 Arquitetura MVVM
O projeto foi estruturado seguindo o padrão **MVVM**, com separação clara entre as camadas:
- **Model**: Contém as entidades, repositórios e lógica de negócio.
- **ViewModel**: Gerencia o estado e as ações, servindo como ponte entre o Model e a View.
- **View**: Responsável apenas pela interface visual e interação com o usuário.

### 🔹 Inversão de Dependências (DI)
A aplicação utiliza **Inversão de Dependências** para o serviço de tarefas. O repositório de tarefas é acessado por meio de uma interface (`ITaskRepository`), permitindo a substituição fácil por implementações diferentes (ex.: repositório em memória para testes).

### 🔹 Testes Automatizados
Foram implementados testes automatizados para garantir a qualidade do código:
- **Testes Unitários**: Cobrem a lógica de negócio nas ViewModels.
- **Testes de CRUD**: Validam as operações de criação, leitura, atualização e exclusão de tarefas.
- **Mocks**: Utilização de repositórios em memória para simular o comportamento do serviço de tarefas.

---

## 🚀 Passo a Passo para Executar o App

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/igordev23/ToDo-List-com-Arquitetura-MVVM/tree/main
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

## ✅ Passo a Passo para Executar os Testes

1. **Certifique-se de que as dependências de teste estão instaladas**:
   ```bash
   npm install --save-dev jest @testing-library/react-hooks @testing-library/react-native
   ```

2. **Execute os testes**:
   ```bash
   npm test
   ```

3. **Resultados esperados**:
   - Todos os testes devem passar, validando o funcionamento correto da lógica de negócio e das operações de CRUD.

---

## 📂 Estrutura de Pastas
A estrutura do projeto foi organizada de forma a refletir a arquitetura MVVM:

```bash
src/
├── app/                # Telas do aplicativo
│   ├── createTaskScreen.tsx
│   ├── detailTaskScreen.tsx
│   ├── listTaskScreen.tsx
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

## 🏆 Critérios de Avaliação Atendidos
- **Arquitetura MVVM**: Implementada com separação clara entre camadas.
- **Inversão de Dependências**: Aplicada ao serviço de tarefas.
- **Testes Automatizados**: Incluem testes unitários e de CRUD.
- **Organização do Código**: Estrutura de pastas coerente e modular.
- **Funcionalidades**: CRUD de tarefas e navegação entre telas implementados com sucesso.
- **README.md**: Documentação clara e completa, com identificação dos integrantes e instruções detalhadas.

---
