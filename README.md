# Desafio-TechFlow-Solutions
# 📋 Lista de Tarefas - Desafio TechFlow Solutions

Este projeto implementa uma aplicação completa de Lista de Tarefas (To-Do List) com uma API RESTful em Node.js e um frontend interativo em HTML, CSS e JavaScript puro.

## 🚀 Funcionalidades

A aplicação permite o gerenciamento completo de tarefas, incluindo as seguintes funcionalidades:

*   **Criação de Tarefas:** Adicionar novas tarefas com título, descrição e prioridade.
*   **Visualização de Tarefas:** Listar todas as tarefas existentes.
*   **Edição de Tarefas:** Atualizar o título, descrição, status e prioridade de uma tarefa existente.
*   **Exclusão de Tarefas:** Remover tarefas da lista.
*   **Filtros:** Filtrar tarefas por status: "Todas", "A Fazer", "Em Progresso" e "Concluída".
*   **Prioridades:** Classificação de tarefas em "Baixa", "Média" e "Alta".

## 🛠️ Tecnologias Utilizadas

O projeto é dividido em duas partes principais: Backend (API) e Frontend (Interface do Usuário).

### Backend (API RESTful)

| Tecnologia | Descrição |
| :--- | :--- |
| **Node.js** | Ambiente de execução JavaScript. |
| **Express.js** | Framework web para construção da API. |
| **JavaScript (CommonJS)** | Linguagem de programação. |
| **Dados em Memória** | Utilização de um array em `src/banco.js` para simular um banco de dados (dados não persistentes). |

### Frontend (Interface do Usuário)

| Tecnologia | Descrição |
| :--- | :--- |
| **HTML5** | Estrutura semântica da aplicação. |
| **CSS3** | Estilização moderna e responsiva (`styles.css`). |
| **JavaScript (Vanilla JS)** | Lógica de interação com a API e manipulação do DOM (`script.js`). |

## 📂 Estrutura do Projeto

A estrutura de pastas segue uma organização clara para separar a lógica do servidor da interface do usuário:

```
TechFlows/
├── public/             # Frontend (Arquivos estáticos)
│   ├── index.html      # Estrutura da página
│   ├── styles.css      # Estilos CSS
│   └── script.js       # Lógica do frontend (Comunicação com a API)
├── src/                # Backend (Lógica do servidor)
│   ├── app.js          # Configuração do Express e rotas da API
│   ├── banco.js        # Lógica de manipulação dos dados (in-memory)
│   └── index.js        # Inicialização do servidor
├── package.json        # Dependências e scripts do projeto
└── README.md           # Documentação do projeto
```

## ⚙️ Rotas da API

A API expõe as seguintes rotas para o gerenciamento de tarefas:

| Método | Rota | Descrição | Corpo da Requisição (Exemplo) |
| :--- | :--- | :--- | :--- |
| `GET` | `/tasks` | Lista todas as tarefas. | N/A |
| `POST` | `/tasks` | Cria uma nova tarefa. | `{ "title": "Nova Tarefa", "description": "Detalhes", "priority": "Alta" }` |
| `PUT` | `/tasks/:id` | Atualiza uma tarefa específica. | `{ "status": "Concluída" }` |
| `DELETE` | `/tasks/:id` | Exclui uma tarefa específica. | N/A |

## 💻 Como Rodar Localmente

Siga os passos abaixo para configurar e executar o projeto em sua máquina local.

### Pré-requisitos

Você precisa ter o **Node.js** e o **npm** (ou yarn/pnpm) instalados em seu sistema.

### 1. Instalação das Dependências

Navegue até o diretório raiz do projeto e instale as dependências do Node.js:

```bash
npm install
```

### 2. Inicialização do Servidor

Execute o script de inicialização para subir o servidor Express na porta `3000`:

```bash
npm start
# O servidor estará rodando em: http://localhost:3000
```

### 3. Acesso ao Frontend

Com o servidor rodando, o frontend estático é servido automaticamente.

Abra seu navegador e acesse:

```
http://localhost:3000/index.html
```

Você poderá interagir com a aplicação de Lista de Tarefas, que se comunicará com a API do backend rodando na mesma porta.

---
### 4. Mudança de Escopo 

Após a entrega o cliente solicitou que a função de "Prioridades" fosse removida pois era desnecessária. 