<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import { useClickOutside } from '../../composables/useClickOutside'
import { getProfilePictureUrl } from '../../utils/media'

const { isAuthenticated, user, logout } = useAuth()
const router = useRouter()
const menuRoot = ref(null)
const menuOpen = ref(false)
useClickOutside(menuRoot, () => { menuOpen.value = false })
async function handleLogout() {
  menuOpen.value = false
  await logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <nav class="navbar navbar-expand navbar-dark app-navbar">
    <div class="container-fluid navbar-inner">
      <RouterLink class="navbar-brand" to="/"><span class="brand-mark"><i class="bi bi-compass-fill" /></span>TravelBuddy</RouterLink>
      <div class="navbar-nav nav-main">
        <RouterLink class="nav-link" to="/feed">Feed</RouterLink>
        <RouterLink class="nav-link" to="/busca">Busca</RouterLink>
        <RouterLink v-if="isAuthenticated" class="nav-link" to="/relatos/novo">Novo destino</RouterLink>
      </div>
      <div v-if="!isAuthenticated" class="navbar-nav nav-account">
        <RouterLink class="nav-link" to="/login">Entrar</RouterLink>
        <RouterLink class="btn btn-light btn-sm rounded-pill px-3" to="/register">Criar conta</RouterLink>
      </div>
      <div v-else ref="menuRoot" class="avatar-menu-root">
        <button class="avatar-menu-trigger" type="button" :aria-expanded="menuOpen" aria-label="Abrir menu da conta" @click="menuOpen = !menuOpen">
          <img :src="getProfilePictureUrl(user?.profilePicture)" :alt="''" class="avatar-menu-image" />
          <span class="avatar-menu-name">{{ user?.username }}</span><i class="bi bi-chevron-down small" />
        </button>
        <Transition name="menu-pop">
          <div v-if="menuOpen" class="avatar-menu-dropdown" role="menu">
            <RouterLink class="avatar-menu-item" :to="{ name: 'my-profile' }" role="menuitem" @click="menuOpen = false"><i class="bi bi-person-gear" />Editar Perfil</RouterLink>
            <RouterLink class="avatar-menu-item" :to="{ name: 'public-profile', params: { username: user?.username } }" role="menuitem" @click="menuOpen = false"><i class="bi bi-person-vcard" />Ver Perfil</RouterLink>
            <RouterLink class="avatar-menu-item" :to="{ name: 'my-relatos' }" role="menuitem" @click="menuOpen = false"><i class="bi bi-images" />Meus Itens</RouterLink>
            <RouterLink class="avatar-menu-item" :to="{ name: 'liked-destinations' }" role="menuitem" @click="menuOpen = false"><i class="bi bi-heart" />Curtidos</RouterLink>
            <div class="dropdown-divider my-2" />
            <button class="avatar-menu-item text-danger" role="menuitem" @click="handleLogout"><i class="bi bi-box-arrow-right" />Sair</button>
          </div>
        </Transition>
      </div>
    </div>
  </nav>
</template>
