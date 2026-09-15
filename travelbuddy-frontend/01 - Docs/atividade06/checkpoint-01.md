# Checkpoint 01 - Consistência de Camadas (Atividade 06)

## Alguma rota (*Routes.js) contém lógica de negócio?
Não. As rotas declaram apenas verbo + caminho + middlewares + controller. Nenhuma lógica de negócio foi identificada nos arquivos de rota.

## Algum Controller consulta o Model diretamente, sem passar pelo Service?
Não. Todos os controllers delegam as operações de banco ao Service correspondente.

## Algum Service faz referência a req/res?
Não. Os Services recebem apenas dados puros e retornam dados puros, sem conhecimento do contexto HTTP.

## Todo Controller usa success()/error() de apiResponse.js?
Sim. Todas as respostas dos controllers passam pelos helpers success() e error() de apiResponse.js.

## Toda rota que chama uma função async está envolvida em asyncHandler?
Sim. O asyncHandler é aplicado em todas as rotas que utilizam funções assíncronas.

## Toda validação de entrada usa express-validator, sem nenhum if manual escondido?
Sim. As validações estão centralizadas via express-validator, sem validações manuais nos controllers ou services.

## config/constants.js não tem nenhuma constante solta sem uso?
Não há constantes sem uso. Todas as constantes definidas são referenciadas nos módulos correspondentes.

## A constante de limite da bio (Aula 05) é usada exatamente uma vez, no lugar certo?
Sim. BIO_MAX é definida em config/constants.js e utilizada exclusivamente no profileController (ou service de perfil), que é o único local onde essa validação deve ocorrer.