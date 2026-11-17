# Atividade 15 — Checklist

## Parte A — API
- [x] `REPORT.STATUS`, status `pending/reviewed`, `reviewedAt` e índice declarados no model e confirmados no MySQL.
- [x] Autenticação consulta o usuário no banco; bloqueio, papel administrativo e login bloqueado implementados.
- [x] `utils/escapeLike.js` compartilhado com as buscas pública e administrativa.
- [x] `scripts/setAdmin.js` promove e rebaixa usuários.
- [x] Módulo admin com dashboard de sete contagens, denúncias, revisão, usuários, bloqueio, destinos e exclusão.
- [x] 68 chamadas da Etapa 5 executadas com `curl.exe`; cada comando e resposta tem JPG próprio em `atividade15/`.
- [x] Capturas de controle registram HTTP 401 para token bloqueado e HTTP 403 para usuário comum.

## Parte B — Frontend
- [x] `AdminLayout`, quatro abas aninhadas e guarda por papel.
- [x] `usePaginatedList` reage a filtro/busca e descarta respostas antigas.
- [x] Dashboard, denúncias, usuários e destinos carregam e usam os endpoints administrativos.
- [x] Revisão, bloqueio e exclusão aguardam resposta; bloqueio/exclusão têm confirmação.
- [x] As 13 capturas pedidas foram geradas em Chromium headless. Busca e 403 incluem os dados de rede reais registrados pelo navegador; o esquema/contagem vem de consultas reais ao MySQL.
- [x] O teste de paginação foi repetido temporariamente com duas linhas por página; o valor original foi restaurado.
- [ ] Exercitar falhas offline, cancelamentos e regressão visual completa no navegador.

ZIPs não foram regenerados, conforme pedido. As capturas foram geradas em headless, sem janelas nativas do DevTools ou de um cliente MySQL.

A paginação usa offset: uma mudança numa página anterior pode deslocar os resultados e omitir um item até atualizar a lista; cursor fica para a Aula 18.
