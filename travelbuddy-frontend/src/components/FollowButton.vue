<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { toggleFollow } from '../services/followService'
import { useAuthenticatedAction } from '../composables/useAuthenticatedAction'
import { runOptimistic } from '../utils/optimistic'

const props = defineProps({ userId: { type: Number, required: true } })
const following = defineModel('following', { type: Boolean, required: true })
const followersCount = defineModel('followersCount', { type: Number, required: true })
const { isAuthenticated } = useAuth()
const router = useRouter()
const route = useRoute()
const { isBusy, run } = useAuthenticatedAction()

async function toggle() {
  if (!isAuthenticated.value) {
    router.push({ name: 'login', query: { redirect: route.fullPath } })
    return
  }
  if (isBusy.value) return
  const previousFollowing = following.value
  const previousCount = followersCount.value
  const nowFollowing = !previousFollowing
  await run(() => runOptimistic({
    apply() { following.value = nowFollowing; followersCount.value = Math.max(0, previousCount + (nowFollowing ? 1 : -1)); return () => { following.value = previousFollowing; followersCount.value = previousCount } },
    request: () => toggleFollow(props.userId),
    confirm(data) { following.value = data.isFollowing; followersCount.value = data.followersCount }
  }), { successMessage: nowFollowing ? 'Você começou a seguir esta pessoa.' : 'Você deixou de seguir esta pessoa.' })
}
</script>

<template>
  <div>
    <button type="button" class="btn" :class="following ? 'btn-outline-success' : 'btn-primary'" :disabled="isBusy" :aria-pressed="following" :aria-busy="isBusy" @click="toggle">
      <i :class="following ? 'bi bi-person-check' : 'bi bi-person-plus'" aria-hidden="true" />
      {{ following ? 'Seguindo' : 'Seguir' }}
    </button>
  </div>
</template>
