# Atividade 09 — Respostas

Um `401` indica que a requisição não foi autenticada, geralmente porque o token está ausente ou inválido; `403` indica que a pessoa foi autenticada, mas não tem permissão para aquele item; e `404` indica que o recurso não existe. Por isso, a API primeiro procura o destino e só depois verifica se pertence ao usuário, distinguindo um ID inexistente de um item de outra pessoa. Ao trocar ou excluir uma imagem, primeiro salvo a alteração ou removo o registro no banco e só depois apago o arquivo: se o disco fosse alterado antes e a operação no banco falhasse, o registro poderia apontar para uma imagem que já não existe; na ordem adotada, uma falha ao remover o arquivo pode deixar um arquivo órfão, que é recuperável e pode ser limpo. No projeto, um arquivo órfão pode surgir se o Multer salvar uma imagem e a validação do título rejeitar a edição, ou se uma criação falhar depois do upload; a validação e o `errorHandler` removem esses uploads que falharam. O botão Excluir não fica dentro do link do card porque são ações interativas diferentes: aninhá-las pode fazer o clique em Excluir também navegar para o detalhe e prejudica a semântica e a acessibilidade; o modal fica fora do card para que o backdrop, o clique fora e a tecla Esc funcionem sem interferência do link. Por fim, esconder Editar na interface só melhora a experiência: qualquer pessoa ainda poderia tentar chamar a API diretamente, então o servidor exige autenticação e confirma a existência e a propriedade do destino antes de permitir edição ou exclusão.

# Atividade 10 — Respostas

O índice único composto em `userId` e `destinationId` garante no banco que a mesma pessoa não curta duas vezes o mesmo destino. A validação feita só no código não cobre duas requisições concorrentes nem gravações vindas de outro cliente.

O contador calculado conta as linhas de curtidas ou comentários em cada consulta; isso mantém o valor derivado correto, mas pode custar mais. O contador guardado é mais rápido de ler, porém pode divergir se não for atualizado junto com as linhas. A transação grava ou desfaz ambas as alterações em conjunto.

Se uma operação esquecer `{ transaction: t }`, ela é executada fora da transação. Assim, uma escrita pode permanecer mesmo se a outra falhar e for revertida, deixando o contador inconsistente com as curtidas ou os comentários.

Atualização otimista muda a interface imediatamente, envia a requisição e restaura o estado anterior com uma mensagem se houver falha. Ela funciona bem para ações rápidas e reversíveis como curtir; deve ser evitada para ações irreversíveis ou em que um estado temporariamente incorreto possa causar dano, como pagamentos.

A interpolação Vue `{{ }}` exibe o comentário como texto escapado. `v-html` interpreta o conteúdo como HTML e pode executar markup malicioso, por isso não deve ser usado para texto enviado por usuários.

`.trim()` deve vir antes de `.notEmpty()` para remover espaços antes da validação. Assim, um comentário composto apenas por espaços é reconhecido como vazio e rejeitado.
