<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import FormCard from '../../components/base/FormCard.vue'
import BaseInput from '../../components/base/BaseInput.vue'
import BaseButton from '../../components/base/BaseButton.vue'

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

<template>
  <FormCard title="Entrar no TravelBuddy">
    <form @submit.prevent="handleLogin">
      <BaseInput id="email" label="E-mail" type="email" v-model="email" />
      <BaseInput id="password" label="Senha" type="password" v-model="password" />

      <div v-if="errorMessage" class="alert alert-danger py-2">{{ errorMessage }}</div>

      <BaseButton :loading="loading" loading-text="Entrando...">
        Entrar
      </BaseButton>
    </form>

    <p class="text-center mt-3 mb-0 small">
      Não tem conta? <router-link to="/register">Criar Conta</router-link>
    </p>
  </FormCard>
</template>