# Atividade 12 — Respostas e evidências

Projeto: TravelBuddy. As imagens desta pasta foram capturadas em navegador Chromium headless com Playwright; os endpoints foram consultados contra a API local ligada ao MySQL.

## Parte A — Backend

- Paginação compartilhada: `travelbuddy-backend/utils/pagination.js` interpreta `page` e `limit`, aplica página padrão 1, limite padrão 12 e teto de 50. Os feeds geral e de pessoas seguidas usam o utilitário. Isso evita consultas enormes e mantém respostas consistentes.
- IDs de rota inválidos agora falham na borda do controller com HTTP 400. Conferidos destino, comentários e status de curtida; antes os caminhos chegavam a respostas 404/500 inconsistentes.
- A criação do destino já executava `Destination.create` e incremento de `User.destinationsCount` no mesmo `sequelize.transaction`. A transação garante atomicidade: se uma das gravações falhar, ambas são revertidas e a contagem não se descola dos dados.
- As respostas reais dos principais fluxos estão em `api-01` a `api-11`: perfil, feed, filtro, seguir, seguidores, seguindo, curtir, curtidos, comentar, comentários e itens do usuário.
- Padrão de erros HTTP: ocorrências de criação de `Error`, atribuição de `status` e `throw` foram localizadas nos services, validação e middleware. Os services de comentário/curtida usam o helper `httpError`; destino/usuário mantêm algumas construções locais. Centralizar todos os status HTTP como constantes não melhora por si só a semântica, então mantive os status próximos às regras que os originam.

## Parte B — Frontend

1. `useAsyncData` recebe uma função para controlar o início da chamada, estado de carregamento, erro, repetição e cancelamento no mesmo ciclo de vida. Receber uma Promise pronta iniciaria a chamada antes de o composable poder administrá-la.
2. Respostas fora de ordem são prevenidas com `AbortController` e `requestId`: a solicitação anterior é cancelada e somente a resposta atual pode atualizar dados, erro e loading.
3. A camada de API mostra toast em falhas de ações comuns. Requisições de leitura e formulários são `silent`, permitindo que páginas mostrem estado de erro e que formulários mantenham a mensagem junto aos campos sem toast duplicado.
4. `useToast` guarda a fila em um `ref` singleton no escopo do módulo; qualquer tela pode adicionar ou dispensar mensagens, e o container global sobrevive à troca de rota. Pinia seria uma camada adicional sem necessidade de persistência ou regras complexas para essa fila.
5. `page` e `limit` vêm da query string e chegam como texto. O parser converte para inteiros positivos e substitui ausências/valores inválidos pelos padrões; `Math.min` limita páginas de tamanho a 50 mesmo que o cliente envie um número muito grande.
6. Ações otimistas são mantidas localmente em curtir e seguir: cada fluxo tem regra visual e reversão próprias. `useAuthenticatedAction` compartilha autenticação, estado ocupado e tratamento de exceção. A regra de três recomenda esperar um terceiro caso estável antes de generalizar mais comportamentos específicos.
7. Sem transação, o destino poderia ser inserido e o incremento do contador falhar, ou o contador mudar sem a inserção. A transação agrupa as operações e mantém banco e contadores coerentes.

### Evidência de regressão

- `toast-erro.jpg`: falha offline e estado de curtida revertido.
- `toast-sucesso.jpg`: toast após exclusão bem-sucedida.
- `toast-modal.jpg`: notificação legível acima do modal de confirmação.
- `uma-requisicao.jpg`: estado da ação após três cliques rápidos; o monitoramento de rede do Playwright/CDP contou uma única chamada com perfil Slow 3G.
- `formulario-sem-toast.jpg`: erro de credenciais dentro do formulário sem toast global.
- `paginacao-antes.jpg` e `paginacao-depois.jpg`: páginas consecutivas dos feeds geral e seguido, sem repetição ou salto (7 itens por página no ensaio).
- Os IDs inválidos retornaram `[400, 400, 400]`; o build de produção do frontend terminou sem erros.

### ADR-013 — reflexão sobre código existente

| Padrão observado | Decisão nesta atividade | Situação |
| --- | --- | --- |
| Feedback global duplicado quando o interceptor e a ação exibiam a mesma falha | Mantive o toast na camada de API e evitei duplicá-lo no helper da ação | Resolvido e capturado em `toast-erro.jpg` |
| Regras de paginação repetidas e limites numéricos dispersos | Centralizei defaults e teto em constantes e no parser reutilizado | Resolvido nesta atividade |
| Tratamento otimista de curtir e seguir tem diferenças reais de domínio | Compartilhei apenas autenticação/ocupação/erro; mantive rollback específico por ação | Sem pendência de refatoração |

## Checklist de capturas

- [x] Toast de erro e rollback.
- [x] Toast de sucesso após exclusão.
- [x] Toast acima do modal.
- [x] Uma chamada durante cliques rápidos em Slow 3G (contagem Playwright/CDP: 1).
- [x] Erro inline no login sem toast.
- [x] Paginação anterior e seguinte dos dois feeds.
- [x] Capturas das onze respostas de API listadas acima.
