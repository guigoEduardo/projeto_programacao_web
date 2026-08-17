import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'landing', component: () => import('../views/LandingView.vue') },
  { path: '/login', name: 'login', component: () => import('../views/auth/LoginView.vue') },
  { path: '/register', name: 'register', component: () => import('../views/auth/RegisterView.vue') },
  { path: '/feed', name: 'feed', component: () => import('../views/FeedView.vue'), meta: { requiresAuth: true } },
  { path: '/feed/seguindo', name: 'feed-following', component: () => import('../views/FeedFollowingView.vue'), meta: { requiresAuth: true } },
  { path: '/relatos/novo', name: 'upload', component: () => import('../views/UploadView.vue'), meta: { requiresAuth: true } },
  { path: '/relatos/:id', name: 'relato-detail', component: () => import('../views/RelatoDetailView.vue') },
  { path: '/relatos/:id/editar', name: 'relato-edit', component: () => import('../views/EditRelatoView.vue'), meta: { requiresAuth: true } },
  { path: '/meus-relatos', name: 'my-relatos', component: () => import('../views/MyRelatosView.vue'), meta: { requiresAuth: true } },
  { path: '/perfil', name: 'my-profile', component: () => import('../views/profile/MyProfileView.vue'), meta: { requiresAuth: true } },
  { path: '/perfil/:id', name: 'public-profile', component: () => import('../views/profile/PublicProfileView.vue') },
  { path: '/favoritos', name: 'favorites', component: () => import('../views/MyFavoritesView.vue'), meta: { requiresAuth: true } },
  { path: '/roteiros', name: 'itineraries', component: () => import('../views/MyItinerariesView.vue'), meta: { requiresAuth: true } },
  { path: '/busca', name: 'search', component: () => import('../views/SearchView.vue') },
  { path: '/admin', name: 'admin-dashboard', component: () => import('../views/admin/AdminDashboardView.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/denuncias', name: 'admin-reports', component: () => import('../views/admin/AdminReportsView.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/usuarios', name: 'admin-users', component: () => import('../views/admin/AdminUsersView.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/destinos', name: 'admin-destinos', component: () => import('../views/admin/AdminDestinosView.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/categorias', name: 'admin-categorias', component: () => import('../views/admin/AdminCategoriasView.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../views/NotFoundView.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router