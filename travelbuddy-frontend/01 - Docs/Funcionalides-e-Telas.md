# Funcionalidades e Telas - TravelBuddy

| Funcionalidade típica | Tela equivalente | Vale para o meu projeto? |
|---|---|---|
| Landing / página inicial | LandingView.vue | Sempre |
| Cadastro e autenticação | auth/LoginView.vue, auth/RegisterView.vue | Sempre |
| Exploração do conteúdo por categoria (Feed) | FeedView.vue (feed geral por categoria/destino) | Sim |
| Feed "Seguindo" | FeedFollowingView.vue | Sim (o projeto tem feed seguindo e feed geral) |
| Upload/criação do conteúdo principal | UploadView.vue (upload de fotos e relato de viagem) | Sim |
| Detalhe de um item do conteúdo principal | RelatoDetailView.vue | Sim |
| Edição de um item do conteúdo principal | EditRelatoView.vue | Sim (usuário pode editar o próprio relato) |
| "Meus itens" (conteúdo publicado pelo próprio usuário) | MyRelatosView.vue | Sim |
| Perfil próprio / perfil público | profile/MyProfileView.vue, profile/PublicProfileView.vue | Sim (tem seguir outros usuários) |
| Listas/favoritos personalizados | MyFavoritesView.vue, MyItinerariesView.vue | Sim (favoritar dicas e criar roteiros) |
| Busca | SearchView.vue | Sim (busca por destinos) |
| Notificações | - | Não descrito no projeto, não vou fazer |
| Dashboard administrativo | admin/AdminDashboardView.vue | Sempre |
| Denúncias / moderação | admin/AdminReportsView.vue | Sim (moderação de conteúdos e usuários) |
| Gerenciamento de usuários (admin) | admin/AdminUsersView.vue | Sempre |
| Gerenciamento do conteúdo principal (admin) | admin/AdminDestinosView.vue, admin/AdminCategoriasView.vue | Sim (cadastro de destinos e categorias) |
| Rota não encontrada | NotFoundView.vue | Sempre |

## Observações

- Entidade principal do projeto: destino (substitui o "vídeo" do Shortz-App).
- Relato de viagem e categoria são entidades auxiliares, associadas a um destino.
- Curtir/descurtir relatos e fotos, avaliação e comentários vão ficar dentro da tela de detalhe do relato (RelatoDetailView.vue), não precisam de tela própria.
- Nome do campo de busca da entidade principal (plural, camelCase): **destinations**.