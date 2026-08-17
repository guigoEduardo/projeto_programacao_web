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