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
- **Registro digital de leads**: Nome, contato, endereço, observações, etc.

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

## 🏆 Critérios de Avaliação Atendidos
- **Arquitetura MVVM**: Implementada com separação clara entre camadas.
- **Inversão de Dependências**: Aplicada ao serviço de tarefas.
- **Testes Automatizados**: Incluem testes unitários e de CRUD.
- **Organização do Código**: Estrutura de pastas coerente e modular.
- **Funcionalidades**: Controle de jornada, registro de leads e rastreamento implementados com sucesso.
- **README.md**: Documentação clara e completa, com identificação dos integrantes e instruções detalhadas.

---

## 📊 Relatórios e Exportações
- **Exportação de Leads**: Geração de relatórios em formato Excel (.xlsx).
- **Painel do Supervisor**: Visualização em tempo real do status dos promotores.

---

## 📚 Considerações Finais
Este projeto demonstra a aplicação de boas práticas de desenvolvimento, como separação de responsabilidades, organização modular e testes automatizados, além de atender às exigências acadêmicas para o desenvolvimento de um aplicativo híbrido com Expo.

