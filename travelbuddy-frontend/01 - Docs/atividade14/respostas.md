# Atividade 14 — Respostas

1. **Transação da notificação.** Curtida/comentário/seguida e aviso representam o mesmo evento; a transação confirma ou reverte tudo junto. Se `createNotification` não receber `t`, a gravação usa outra conexão. A checagem da chave estrangeira pode esperar o lock que a transação original mantém enquanto aguarda essa gravação, e a requisição termina em `Lock wait timeout exceeded` (500).

2. **Notificação verdadeira.** Ações sobre si mesmo não geram aviso porque não há outra pessoa a informar. Descurtir e deixar de seguir removem o aviso correspondente, pois a relação deixou de existir. Comentários não têm desfazer pela API, então o aviso permanece.

3. **Contagem e índices.** `unread-count` permite atualizar o selo do sino sem baixar a lista paginada e suas associações. O índice `(user_id, is_read)` acelera a contagem de não lidas por destinatário; o índice `destination_id` ajuda consultas e limpeza ligadas a um destino.

4. **Duplicidade de denúncia.** Denunciar duas vezes responde 409 porque a segunda ação é um conflito com uma denúncia já existente, e não uma inclusão idempotente numa coleção. O índice único `(user_id, destination_id)` impede duplicatas também sob cliques/requisições simultâneas; `findOrCreate` transforma esse caso em conflito da aplicação.

5. **Motivo e rótulo.** O validator rejeita entradas inválidas com mensagem compreensível; o ENUM protege a integridade mesmo se a validação da aplicação for contornada. O banco guarda chaves estáveis como `spam`, e a interface apresenta rótulos legíveis em português.

6. **Chaves estrangeiras na exclusão.** `CASCADE` apaga registros dependentes; `NO ACTION` impede excluir o pai enquanto houver denúncia; `SET NULL` preserva a notificação, mas desvincula o destino. No controle SQL direto, o `DELETE` de um destino com denúncia falhou com erro 1451 citando `reports`; ao excluir um destino com notificação após limpar a curtida, a linha permaneceu com `destination_id = NULL`. O fluxo normal apaga reports e notifications na transação antes do destroy. Esse controle confirmou as regras das FKs; não substitui a repetição do roteiro comentando temporariamente os `destroy` do service.

7. **Polling.** O intervalo de 30 segundos reduz chamadas mantendo o selo razoavelmente atual. A Navbar inicia o timer quando autentica e encerra no logout/desmontagem. `timerId !== null` evita intervalos duplicados; `visibilitychange` só consulta com a aba visível, fazendo uma atualização ao retornar.

8. **Corrida do contador.** Uma resposta antiga do polling pode chegar depois de uma marcação otimista e sobrescrever o número novo. Cada refresh guarda seu identificador; `setUnreadCount` também incrementa `lastRefreshId`, invalidando respostas iniciadas antes da atualização local ou da confirmação da API.

9. **Quarto caso otimista.** `runOptimistic` não muda: `apply` atualiza a linha e subtrai do sino, `request` chama a API, `confirm` usa o contador confirmado e o undo reverte a linha e soma 1 ao valor atual. A soma relativa preserva outras mudanças simultâneas; restaurar um número antigo poderia apagar os efeitos de outra linha.

10. **CORS no logout.** O Axios enviava `null` como corpo JSON; o parser podia rejeitar o corpo com 400 antes que o middleware CORS acrescentasse os cabeçalhos, e o navegador reportava o erro como CORS. Registrar CORS antes de `express.json()` garante os cabeçalhos também para essa resposta de erro; o logout agora envia `undefined`.
