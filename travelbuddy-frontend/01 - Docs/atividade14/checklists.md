# Atividade 14 — TravelBuddy

## Ficha e alcançabilidade

| Ação | Caminho de clique |
| --- | --- |
| Notificações | Sino na Navbar (somente para conta autenticada) → `/notificacoes`. |
| Marcar como lida | Botão na linha ou clique no texto da notificação. |
| Abrir origem | Curtida/comentário → detalhe do destino; follow → perfil de quem seguiu. |
| Paginação/atualização | “Carregar mais notificações” no fim e “Atualizar” no topo. |
| Denunciar | Detalhe do destino → “Denunciar”; visitante passa pelo login e retorna ao detalhe. O dono não vê o botão. |

Rota `notifications` protegida por autenticação e tela placeholder substituída. A lista não se atualiza sozinha; somente o contador do sino usa polling (decisão de escopo da atividade).

## Parte A — Backend

- [x] Constantes, models Notification/Report, associações e índices declarados.
- [x] Rotas paginadas de notificações, unread-count, marcar como lida e denunciar destino.
- [x] Notificações de curtir, comentar e seguir criadas dentro das transações; curtir/seguir removem ao desfazer; ações próprias não notificam.
- [x] Denúncia valida os cinco motivos, impede autodenúncia e duplicidade (409).
- [x] Exclusão de destino limpa reports e notifications antes do destino.
- [x] CORS registrado antes dos parsers.
- [ ] Reiniciar API e conferir tabelas, ENUMs, índices e ON DELETE no banco.
- [ ] Executar os testes de controle da exclusão e registrar os resultados observados.
- [ ] Executar os onze grupos de testes da Etapa 5 e salvar os prints.

## Parte B — Frontend

- [x] Constantes, services de notificação/denúncia e store de polling implementados.
- [x] Navbar mostra sino e contador; polling inicia com login, para no logout e respeita aba visível.
- [x] Lista paginada, atualização manual, estados de carregamento/erro/vazio e linhas lidas/não lidas.
- [x] Marcação otimista com rollback relativo, bloqueio de clique repetido e contador sincronizado com API.
- [x] Modal com cinco motivos, validação local e erro da API dentro do modal.
- [x] Botão de denúncia oculto para o dono e login com retorno para visitante.
- [x] Logout envia body `undefined` com configuração silenciosa.
- [ ] Executar os nove passos práticos de clique da Etapa 5 e conferir no navegador.
- [x] Gerar os 12 arquivos de evidência `.jpg` da lista de entrega usando Chrome headless; `polling-network.jpg` e `console-logout.jpg` registram eventos reais via CDP, e os três arquivos de banco/controle mostram resultados reais de consultas MySQL renderizados para captura.
- [ ] Capturar no DevTools e no cliente MySQL as telas nativas exigidas pelo roteiro, caso a entrega exija especificamente essas interfaces.

## Entrega

- [x] Respostas conceituais registradas em `respostas.md`.
- [x] Doze capturas headless salvas nesta pasta; a tela extra exploratória `headless-visitante.jpg` não faz parte da lista de entrega.
- [ ] ZIPs backend e frontend gerados sem `node_modules`.
