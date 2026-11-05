<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { toggleFollow } from '../services/followService'

const props = defineProps({ userId: { type: Number, required: true } })
const following = defineModel('following', { type: Boolean, required: true })
const followersCount = defineModel('followersCount', { type: Number, required: true })
const { isAuthenticated } = useAuth()
const router = useRouter()
const route = useRoute()
const isBusy = ref(false)
const errorMessage = ref('')

async function toggle() {
  if (!isAuthenticated.value) {
    router.push({ name: 'login', query: { redirect: route.fullPath } })
    return
  }
  if (isBusy.value) return
  const previousFollowing = following.value
  const previousCount = followersCount.value
  const nowFollowing = !previousFollowing
  errorMessage.value = ''
  isBusy.value = true
  following.value = nowFollowing
  followersCount.value = Math.max(0, previousCount + (nowFollowing ? 1 : -1))
  try {
    const response = await toggleFollow(props.userId)
    following.value = response.data.isFollowing
    followersCount.value = response.data.followersCount
  } catch (error) {
    following.value = previousFollowing
    followersCount.value = previousCount
    errorMessage.value = error.message || 'Não foi possível atualizar. A alteração foi desfeita.'
  } finally { isBusy.value = false }
}
</script>

<template>
  <div>
    <button type="button" class="btn" :class="following ? 'btn-outline-success' : 'btn-primary'" :disabled="isBusy" :aria-pressed="following" :aria-busy="isBusy" @click="toggle">
      <i :class="following ? 'bi bi-person-check' : 'bi bi-person-plus'" aria-hidden="true" />
      {{ following ? 'Seguindo' : 'Seguir' }}
    </button>
    <p v-if="errorMessage" class="alert alert-danger mt-2 mb-0" role="alert">{{ errorMessage }}</p>
  </div>
</template>
