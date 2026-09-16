# Checklist de Alcançabilidade — Atividade 07

1. Fiz login → cliquei em "Novo Destino" na Navbar → a URL mudou para /relatos/novo sem recarregar a página. ✅

2. Tentei enviar o formulário vazio → os erros de campo obrigatório (título, categoria, imagem) foram exibidos na tela. ✅

3. (Grupo B — não se aplica o teste de arquivo faltando o segundo.) ✅

4. Selecionei a imagem → a prévia apareceu imediatamente, sem nenhuma chamada de rede. ✅

5. Enviei o formulário → a barra de progresso avançou → a mensagem "Destino publicado com sucesso!" foi exibida. ✅

6. Na aba Network do DevTools → confirmei Content-Type: multipart/form-data; boundary=... na requisição. ✅

7. Confirmei no banco (DESCRIBE users) que destinations_count subiu para o usuário autenticado. ✅