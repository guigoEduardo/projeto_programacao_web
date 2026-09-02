<template>
  <div class="d-flex justify-content-center align-items-center min-vh-100 bg-light">
    <div class="card shadow-sm p-4" style="width: 100%; max-width: 400px;">
      <h1 class="h4 mb-4 text-center text-brand">Entrar no TravelBuddy</h1>

      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="email" class="form-label">E-mail</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="form-control"
            required
          />
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">Senha</label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="form-control"
            required
          />
        </div>

        <div v-if="errorMessage" class="alert alert-danger py-2">
          {{ errorMessage }}
        </div>

        <button type="submit" class="btn btn-primary w-100" :disabled="loading">
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)

const router = useRouter()
const route = useRoute()

async function handleLogin() {
  errorMessage.value = ''
  loading.value = true

  try {
    const authStore = useAuthStore()
    await authStore.login(email.value, password.value)

    const redirectPath = route.query.redirect || { name: 'feed' }
    router.push(redirectPath)
  } catch (err) {
    errorMessage.value = err.message || 'Não foi possível entrar. Tente novamente.'
  } finally {
    loading.value = false
  }
}
</script>