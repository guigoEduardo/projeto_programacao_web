<template>
  <nav class="navbar navbar-expand navbar-dark">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">TravelBuddy</router-link>

      <div class="navbar-nav">
        <router-link class="nav-link" to="/feed">Feed</router-link>
        <router-link class="nav-link" to="/busca">Busca</router-link>

        <template v-if="!authStore.isAuthenticated">
          <router-link class="nav-link" to="/register">Criar Conta</router-link>
          <router-link class="nav-link" to="/login">Login</router-link>
        </template>

        <template v-else>
          <router-link class="nav-link" to="/perfil">Meu Perfil</router-link>
          <a class="nav-link" href="#" @click.prevent="handleLogout">Sair</a>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const router = useRouter()

async function handleLogout() {
  await authStore.logout()
  router.push({ name: 'login' })
}
</script>