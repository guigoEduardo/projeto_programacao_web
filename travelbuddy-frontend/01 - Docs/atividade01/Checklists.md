# Checklists - Atividade 1

## Parte A - Backend

### Etapa 1
- [x] node -v e npm -v conferidos
- [x] Pasta travelbuddy-backend criada, separada da pasta do front
- [x] package.json gerado com npm init -y

### Etapa 2
- [x] express, cors, dotenv, morgan instalados como dependências
- [x] nodemon instalado como devDependency
- [x] Scripts start e dev configurados no package.json

### Etapa 3
- [x] Pastas bin/, config/, middlewares/, modules/, routes/ criadas
- [x] .gitignore criado com node_modules/ e .env

### Etapa 4
- [x] middlewares/apiResponse.js criado com as funções success e error

### Etapa 5
- [x] routes/index.js criado, com name/message adaptados ao nome do projeto
- [x] Campo data.status escrito exatamente assim (minúsculo, sem variação)

### Etapa 6
- [x] .env criado com PORT e CORS_ORIGIN corretos para o projeto

### Etapa 7
- [x] app.js criado, montando indexRouter sob o prefixo /api
- [x] bin/www criado
- [x] npm run dev sobe o servidor sem erros, exibindo a mensagem de confirmação

### Etapa 8
- [x] curl http://localhost:3000/api responde o JSON esperado, com o nome do projeto

## Parte B - Frontend

### Etapa 1
- [x] curl confirmou que a API (Parte A) está respondendo
- [x] npm run dev abriu a página padrão do Vite + Vue em http://localhost:5173

### Etapa 2
- [x] Estrutura de pastas criada
- [x] HelloWorld.vue removido e style.css limpo
- [x] .env criado com a VITE_API_URL apontando para a API
- [x] .gitignore configurado

### Etapa 3
- [x] Tabela de tradução "funcionalidade → tela" preenchida para o projeto
- [x] Uma tela placeholder criada para cada linha da tabela
- [x] src/router/index.js criado com todas as rotas do sistema
- [x] Router registrado em main.js
- [x] Navegando manualmente pela URL, cada rota carrega a tela correspondente

### Etapa 4
- [x] TheNavbar.vue, TheSidebar.vue e TheFooter.vue criados, com links para as rotas do projeto
- [x] Layout montado em App.vue, com router-view no lugar certo
- [x] Ao navegar entre rotas, Navbar/Sidebar/Footer permanecem fixos e só o conteúdo central troca

### Etapa 5
- [x] Landing Page exibindo "Status da API: online" com dados reais da API
- [x] Erro de CORS reproduzido intencionalmente e depois corrigido, com prints/anotações do que apareceu no Console e no Network do DevTools, e também do que apareceu (ou não) no terminal da API

---

# Ficha de preparação

| Dado | Valor |
|---|---|
| Nome do projeto | TravelBuddy |
| Entidade principal | Destino (destination) |
| Porta da API | 3000 |
| Porta do front | 5173 |
| Nome do campo de busca da entidade principal (plural, camelCase) | destinations |

---

# Checklists - Atividade 2

## Parte A - Backend

### Etapa 1
- [x] Pasta modules/search/ criada
- [x] searchService.js criado, com o nome da sua entidade no plural (destinations)

### Etapa 2
- [x] searchController.js criado, usando exports.search = ...
- [x] O objeto retornado usa o nome da sua entidade no plural, igual ao definido no service

### Etapa 3
- [x] searchRoutes.js criado, com router.get('/search', searchController.search)

### Etapa 4
- [x] searchRoutes importado no topo de app.js
- [x] app.use('/api', searchRoutes) adicionado
- [x] API reiniciou sem erros

### Etapa 5
- [x] curl .../api/search?q=teste responde no formato esperado, com o nome certo do campo
- [x] curl .../api/search (sem q) responde com query: ""
- [x] curl .../api continua respondendo normalmente

## Parte B - Frontend

### Etapa 1
- [x] src/services/api.js criado com axios.create(...) usando VITE_API_URL

### Etapa 2
- [x] Interceptor de resposta adicionado a api.js
- [x] Comentário no topo do arquivo, com minhas palavras, explicando os quatro cenários

### Etapa 3
- [x] authService.js criado com register, login, logout (ainda sem uso)
- [x] searchService.js criado, usando params: { q: query }
- [x] systemService.js criado

### Etapa 4
- [x] LandingView.vue usando getApiStatus() em vez de fetch
- [x] Página ainda mostra "Status da API: online"

### Etapa 5
- [x] Console mostrou Busca OK: com o objeto esperado, usando o nome certo da entidade (destinations)
- [x] Erro de rede provocado de propósito caiu na mensagem amigável do interceptor, não num erro técnico
- [x] Bloco de teste removido da Landing Page ao final