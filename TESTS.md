# 📱 Trabalho Interdisciplinar – Testes de Software em Aplicações Mobile

Este repositório contém a implementação e a documentação da **estratégia de testes de software** aplicada ao aplicativo desenvolvido na disciplina de **Programação para Dispositivos Móveis (PDM)**, atendendo integralmente aos requisitos da disciplina de **Engenharia de Software III**.

---

## 🎯 Objetivo do Trabalho

Aplicar, de forma prática, os conceitos de:

* Testes automatizados
* Qualidade de software
* **Test-Driven Development (TDD)**

Os testes foram integrados a uma aplicação mobile real já em desenvolvimento, garantindo qualidade, confiabilidade e evolução segura do código.

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

## 📝 Critérios de Avaliação Atendidos

✔️ Adequação da estratégia de testes
✔️ Qualidade e clareza dos testes unitários
✔️ Correta implementação dos testes de integração
✔️ Uso consistente de TDD
✔️ Organização e clareza da documentação
✔️ Coerência entre testes, código e arquitetura

---

## ✅ Conclusão

A estratégia de testes adotada garante:

* Qualidade do software
* Segurança na evolução do código
* Aderência total aos requisitos da disciplina de Engenharia de Software III

O uso de **Test-Driven Development** e testes de integração reforça boas práticas de engenharia de software aplicadas a aplicações mobile reais.