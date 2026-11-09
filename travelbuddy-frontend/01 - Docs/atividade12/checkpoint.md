# Checkpoint — leitura guiada da API

A atividade pede uma leitura guiada do módulo. O roteiro abaixo acompanha o código presente neste repositório.

1. **Rotas e middleware:** `travelbuddy-backend/modules/destination/destinationRoutes.js` declara caminhos e ordem dos middlewares; rotas autenticadas passam por `isAuthenticated`, e detalhes públicos usam `optionalAuth`.
2. **Controller:** `destinationController.js` lê parâmetros e dados HTTP, valida IDs com `parsePositiveId` e delega regras ao service. A resposta de sucesso usa `middlewares/apiResponse.js`.
3. **Validação:** `destinationValidator.js` valida título, descrição e categoria com limites de `config/constants.js`; erros são devolvidos antes de executar o service.
4. **Service e persistência:** `destinationService.js` concentra regras de destino. `createDestination` cria destino e atualiza o contador do usuário dentro de uma transação Sequelize.
5. **Modelo e banco:** `destinationModel.js` declara os campos e limites; `config/database.js` cria a conexão Sequelize usando variáveis de ambiente. O modelo de usuário mantém o contador relacionado.
6. **Erros e segurança:** `middlewares/auth.js` trata token ausente/inválido. `parsePositiveId` responde 400 para identificadores malformados; services produzem erros de domínio e o middleware de erro converte-os em resposta HTTP.

## Perguntas adicionais

1. **Por que validar o ID no controller e verificar a existência no service?** O controller valida a forma do dado de rota; o service valida o estado e a regra de negócio. Isso permite rejeitar cedo a entrada malformada e também proteger o service quando usado por outros fluxos.
2. **Por que incluir o incremento do contador na transação?** O contador só pode refletir um destino efetivamente criado. A transação faz as duas gravações terem sucesso ou serem revertidas em conjunto.
3. **Por que a senha e o token não devem ser incluídos nas capturas de API ou no ZIP?** São credenciais. Os arquivos `.env` e dados temporários de autenticação são locais e excluídos das entregas versionadas/compactadas.
