# Atividade 11 — Seguir pessoas no TravelBuddy

1. **Apelidos das associações.** Follow aponta duas vezes para User: Follower é quem segue, e Following é quem é seguido. Os apelidos permitem ao Sequelize escolher a relação correta. Em getFollowers(B), filtro followingId = B e leio Follower: pessoas que seguem B. Em getFollowing(A), filtro followerId = A e leio Following: pessoas que A segue.

2. **Ordem dos índices.** O índice único (follower_id, following_id) impede repetir o mesmo par e atende buscas pelo prefixo follower_id. Ele não oferece a mesma eficiência para buscar apenas following_id. O índice simples nessa coluna atende a lista de seguidores de uma pessoa.

3. **Conversão de id.** req.params.userId chega como string, enquanto o id autenticado é número. Assim, 1 === '1' é false, mesmo representando a mesma pessoa. parseUserId converte e valida o parâmetro no controller, na borda da API, antes de chamar o service e verificar a tentativa de seguir a si mesmo.

4. **Estado compartilhado.** Uso v-model/defineModel quando botão e perfil precisam compartilhar a mesma fonte de verdade: o estado de seguir e o contador de seguidores. Um estado próprio inicializado por prop serve quando o componente controla sua apresentação local, mas exige sincronização explícita; aqui o cartão deve reagir junto com o botão.

5. **Leitura após atribuir.** Com o modelo controlado pelo pai, atribuir ao defineModel emite a atualização, e a nova prop chega no ciclo de atualização do Vue. Uma leitura imediatamente depois pode ainda devolver o valor anterior. Calculo nowFollowing em uma variável local e uso essa variável tanto na atribuição do estado quanto no cálculo do contador; em erro, restauro o estado anterior.

6. **Feed vazio cedo.** Sem pessoas seguidas não existe autor elegível. Devolver [] antes da consulta de destinos economiza trabalho e deixa explícito que o feed filtrado não deve se transformar no feed geral. Quando existem relações, Op.in restringe os autores, com paginação e ordenação estável.
