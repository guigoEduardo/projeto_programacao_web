<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { toggleDestinationLike } from '../services/likeService'
import { useAuthenticatedAction } from '../composables/useAuthenticatedAction'
import { runOptimistic } from '../utils/optimistic'

const props = defineProps({ destinationId: { type: [Number, String], required: true }, modelValue: { type: Boolean, default: false }, count: { type: Number, default: 0 } })
const emit = defineEmits(['update:modelValue', 'update:count'])
const router = useRouter()
const { isAuthenticated } = useAuth()
const { isBusy, run } = useAuthenticatedAction()
watch(() => props.modelValue, (value) => { liked.value = value })
watch(() => props.count, (value) => { likesCount.value = value })
const liked = ref(props.modelValue)
const likesCount = ref(props.count)

async function toggle() {
  if (!isAuthenticated.value) {
    router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } })
    return
  }
  if (isBusy.value) return
  const previousLiked = liked.value
  const previousCount = likesCount.value
  await run(() => runOptimistic({
    apply() { liked.value = !previousLiked; likesCount.value = Math.max(0, previousCount + (liked.value ? 1 : -1)); emit('update:modelValue', liked.value); emit('update:count', likesCount.value); return () => { liked.value = previousLiked; likesCount.value = previousCount; emit('update:modelValue', liked.value); emit('update:count', likesCount.value) } },
    request: () => toggleDestinationLike(props.destinationId),
    confirm(data) { liked.value = data.liked; likesCount.value = data.likesCount; emit('update:modelValue', liked.value); emit('update:count', likesCount.value) }
  }), { successMessage: liked.value ? 'Destino curtido.' : 'Curtida removida.' })
}
</script>

<template>
  <button type="button" class="like-button" :class="{ liked }" :disabled="isBusy" :aria-pressed="liked" @click="toggle">
    <i :class="liked ? 'bi bi-heart-fill' : 'bi bi-heart'" aria-hidden="true" />
    <span>{{ likesCount }}</span>
    <span class="visually-hidden">{{ liked ? 'Descurtir' : 'Curtir' }}</span>
  </button>
</template>
