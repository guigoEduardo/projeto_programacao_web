# Atividade 13 - Respostas

Projeto: TravelBuddy. A entidade principal e Destino; a colecao pessoal foi implementada como Colecao. As respostas HTTP, capturas de interface, consultas ao MySQL e o controle do contador estao na pasta atividade13.

1. **Tabela de juncao e indices.** A relacao e muitos-para-muitos porque uma colecao pode ter varios destinos e um destino pode estar em varias colecoes. A tabela collection_destinations armazena cada par. O indice unico composto por collection_id e destination_id impede duplicatas e acelera a consulta por colecao; o indice simples por destination_id acelera a consulta reversa, incluindo status e limpeza quando um destino e excluido.

2. **Idempotencia.** Uma acao e idempotente quando repetir a mesma solicitacao deixa o mesmo estado final. Adicionar um destino repetido nao cria outra linha nem incrementa o contador, por isso retorna 200 com added false. Remover uma relacao ausente nao muda o estado e informa 404 porque o destino nao esta na colecao.

3. **Cascade e contador.** ON DELETE CASCADE apaga as linhas da tabela de juncao, mas nao atualiza destinations_count na colecao. Esse contador e um dado derivado, armazenado para leitura rapida; precisa ser ajustado explicitamente na mesma transacao da exclusao. No teste de controle, a linha de juncao desapareceu e o contador ficou em 1. Com a limpeza no service, o contador voltou a 0.

4. **Ordem 400, 404 e 403.** A rota valida primeiro a forma do identificador e responde 400 se for malformado. Com o ID valido, procura a colecao e responde 404 se ela nao existe. So depois compara a dona e responde 403 para uma pessoa autenticada sem permissao. Para a leitura de colecao privada de outra pessoa, este projeto escolhe 403.

5. **Escape da busca e tipo da query.** No SQL LIKE, percentual e sublinhado sao curingas; por isso dois percentuais podiam combinar com qualquer texto. A funcao escapeLike escapa barra invertida, percentual e sublinhado antes de montar o padrao. O controller tambem verifica typeof req.query.q === string: queries repetidas ou estruturadas podem chegar como array ou objeto e viram uma busca vazia, sem erro 500.

6. **Atualizacao otimista e undo.** Curtir, seguir e marcar uma colecao aplicam a mudanca visual antes da resposta da API e confirmam os valores retornados pelo servidor. Cada acao atualiza dados diferentes: curtida e contador de curtidas, seguimento e contador de seguidores, ou caixa e contador da colecao. apply devolve a funcao de desfazer para que o erro restaure exatamente o estado anterior daquela operacao; runOptimistic nao decide a regra especifica de cada acao.

7. **Debounce e lastCallId.** O debounce espera 400 ms sem digitacao antes de enviar a busca, reduzindo requisicoes por tecla. O controle de chamada mais recente em useAsyncData cancela ou ignora respostas antigas, impedindo que uma busca lenta substitua os resultados do termo atual. Um controla quando requisitar; o outro controla qual resposta pode atualizar a tela.

8. **Remocao pessimista e caixa otimista.** Ao remover um destino do detalhe da colecao, o card fica visivel ate a API confirmar; se falhar, nao ha estado temporario incorreto. A caixa do modal pode mudar imediatamente porque a operacao e reversivel; em caso de erro ela volta ao valor anterior e o interceptor mostra o toast. Uma trava por linha evita requisicoes simultaneas para a mesma colecao.

## Teste de controle

A evidencia contador-controle.jpg mostra o valor derivado obsoleto depois que a linha da juncao foi apagada por cascade. A evidencia contador-certo.jpg mostra o valor 0 apos a exclusao pelo service, com o decremento na transacao. As duas consultas e o DDL do banco estao em colecoes-banco.jpg.
