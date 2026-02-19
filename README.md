# Escola Conecta Saber - App Mobile

Este é o repositório da aplicação mobile do projeto **Escola Conecta Saber**, desenvolvida com **React Native** e **Expo**. A aplicação visa facilitar a comunicação entre professores e alunos, permitindo o gerenciamento de postagens, usuários e visualização de conteúdos educacionais.

---

## 🚀 Setup Inicial

Para rodar este projeto em seu ambiente de desenvolvimento, siga os passos abaixo:

### Pré-requisitos
- **Node.js**: v18 ou superior.
- **npm** ou **yarn**: Gerenciador de pacotes.
- **Expo Go**: Aplicativo instalado no seu dispositivo móvel (disponível na App Store/Play Store) ou um emulador Android/iOS configurado.

### Passos para Instalação

1.  **Clone o repositório**:
    ```bash
    git clone https://github.com/JasminePinheiro/escola_conectar_saber_app.git
    ```

2.  **Entre no diretório do projeto**:
    ```bash
    cd escola_conectar_saber_app
    ```

3.  **Instale as dependências**:
    ```bash
    npm install
    ```

4.  **Inicie o servidor de desenvolvimento**:
    ```bash
    npm run start
    ```

5.  **Abrir o App**:
    - No seu celular, abra o aplicativo **Expo Go** e escaneie o QR Code exibido no terminal.
    - Se usar emulador, pressione `a` para Android ou `i` para iOS.

---

## 🏗️ Arquitetura da Aplicação

O projeto utiliza uma estrutura modular, organizada para escalabilidade e fácil manutenção dentro do diretório `src/`:

- **`src/screens/`**: Contém as telas da aplicação organizadas por contexto (auth, admin, posts). Cada tela tem sua lógica em um arquivo `.tsx` e seus estilos isolados em um arquivo `.styles.ts`.
- **`src/components/`**: Componentes de UI modulares e reutilizáveis, como botões customizados, alertas e campos de input.
- **`src/context/`**: Gerenciamento de estado global. O `AuthContext` centraliza o estado do usuário, login, registro e persistência de dados.
- **`src/navigation/`**: Define a hierarquia de rotas usando `React Navigation`, separando fluxos de autenticação de fluxos autenticados.
- **`src/services/`**: Camada de integração com o Backend. O `apiClient.ts` (baseado em Axios) gerencia base URL, headers e interceptadores de token JWT.
- **`src/theme/`**: Arquivo `colors.ts` que centraliza o guia de estilos e cores globais da marca.
- **`src/types/`**: Definições globais de interfaces TypeScript para garantir tipagem em toda a aplicação.

### 🔐 Segurança e Dados
- **Persistência**: O token de autenticação e os dados do usuário são salvos de forma segura no dispositivo via `@react-native-async-storage/async-storage`.
- **Interceptors**: Todas as chamadas à API anexam automaticamente o token JWT no header das requisições.

---

## 📖 Guia de Uso

### 1. Sistema de Usuários
- **Login e Registro**: Fluxo completo para criação de conta e acesso ao sistema.
- **Níveis de Acesso**: O app identifica se o usuário é Aluno ou Professor, adaptando as funcionalidades do menu lateral e dashboard.

### 2. Gestão de Conteúdo (Área do Professor/Admin)
- **Dashboard**: Visualização rápida de métricas (total de alunos, professores e posts).
- **Gerenciar Posts**: Lista completa com funcionalidades de Criação (CRUD), Edição e Exclusão de postagens.
- **Pesquisa Dinâmica**: Filtros em tempo real por título ou autor para facilitar a localização de conteúdos.

### 3. Perfil e Customização
- **Foto de Perfil**: Integração com a câmera e galeria do celular via `expo-image-picker`.
- **Redefinição de Senha**: Funcionalidade interna para segurança do usuário.

---

## 🛠️ Tecnologias Principais
- **React Native**: Core da aplicação.
- **Expo SDK 54**: Facilitador de desenvolvimento e acesso a APIs nativas.
- **Axios**: Consumo de APIs REST.
- **Lucide Icons**: Biblioteca de ícones moderna e leve.
- **TypeScript**: Garantia de qualidade e segurança do código.

---
