# Teste Técnico

Aplicação full-stack para gerenciamento de tarefas, composta por uma API REST em Node.js e uma interface web em Next.js.

## Tecnologias

**Backend**

- Node.js + TypeScript
- Express 5
- Banco de dados em memória (array)
- Jest + ts-jest (testes)

**Frontend**

- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4
- Vitest + Testing Library (testes)

## Estrutura do projeto

```
teste_tecnico/
├── backend/     # API REST
└── frontend/    # Interface web
```

## Pré-requisitos

- Node.js 20+
- npm 9+

## Instalação

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

## Variáveis de ambiente

### Backend

Nenhuma variável obrigatória. A porta padrão é `3001`.

### Frontend

Crie um arquivo `.env` na pasta `frontend`:

```env
# URL do backend (usada nas Route Handlers do Next.js)
API_URL=http://localhost:3001

```

## Rodando o projeto

### Backend

```bash
cd backend
npm run dev
```

A API estará disponível em `http://localhost:3001`.

### Frontend

Em outro terminal:

```bash
cd frontend
npm run dev
```

A interface estará disponível em `http://localhost:3000`.

## Endpoints da API

| Método | Rota       | Descrição     |
| ------ | ---------- | ------------- |
| GET    | /items     | Listar todas  |
| GET    | /items/:id | Buscar por ID |
| POST   | /items     | Criar         |
| PUT    | /items/:id | Atualizar     |
| DELETE | /items/:id | Remover       |

### Exemplo de corpo para criação/atualização

```json
{
  "title": "Minha tarefa",
  "description": "Descrição opcional"
}
```

### Formato de resposta

```json
{
  "success": true,
  "data": { ... }
}
```

## Decisões Técnicas

### Controllers separados por responsabilidade

Cada operação (`GetItemsController`, `CreateItemController`, etc.) foi isolada em seu próprio arquivo em vez de agrupar tudo em um único controller. Isso facilita a leitura, os testes e a manutenção individual de cada endpoint sem risco de quebrar os demais.

### Instância única do serviço (Singleton)

O `ItemService` é instanciado uma única vez em `src/services/index.ts` e importado por todos os controllers. Isso evita a criação de múltiplos objetos desnecessários e garante que toda a aplicação opere sobre o mesmo estado em memória. O construtor do serviço também aceita o repositório como parâmetro com valor padrão, permitindo injeção de dependência nos testes sem alterar o comportamento em produção.

### SSR com separação de contextos

A busca inicial de tarefas é feita server-side via `lib/api.server.ts`, que acessa o backend diretamente usando `API_URL` (variável de servidor). As operações do cliente (criar, editar, deletar) passam pelas Route Handlers do Next.js em `app/api/tasks/`, que atuam como proxy. Essa separação evita expor a URL interna do backend ao browser e mantém explícito o que roda no servidor versus no cliente.

### Pontos de melhoria

- Utilizar um banco real
- Criar autenticação de usuários

## Testes

### Backend

```bash
cd backend
npm test
```

### Frontend

```bash
cd frontend
npm test
```

Para rodar uma única vez (sem watch):

```bash
npm test -- --run
```
