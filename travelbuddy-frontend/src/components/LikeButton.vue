<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { toggleDestinationLike } from '../services/likeService'

const props = defineProps({ destinationId: { type: [Number, String], required: true }, modelValue: { type: Boolean, default: false }, count: { type: Number, default: 0 } })
const emit = defineEmits(['update:modelValue', 'update:count', 'error'])
const router = useRouter()
const { isAuthenticated } = useAuth()
const isBusy = ref(false)
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
  liked.value = !previousLiked
  likesCount.value = Math.max(0, previousCount + (liked.value ? 1 : -1))
  emit('update:modelValue', liked.value)
  emit('update:count', likesCount.value)
  isBusy.value = true
  try {
    const response = await toggleDestinationLike(props.destinationId)
    liked.value = response.data.liked
    likesCount.value = response.data.likesCount
    emit('update:modelValue', liked.value)
    emit('update:count', likesCount.value)
  } catch (error) {
    liked.value = previousLiked
    likesCount.value = previousCount
    emit('update:modelValue', liked.value)
    emit('update:count', likesCount.value)
    emit('error', error.message || 'Não foi possível atualizar a curtida.')
  } finally { isBusy.value = false }
}
</script>

<template>
  <button type="button" class="like-button" :class="{ liked }" :disabled="isBusy" :aria-pressed="liked" @click="toggle">
    <i :class="liked ? 'bi bi-heart-fill' : 'bi bi-heart'" aria-hidden="true" />
    <span>{{ likesCount }}</span>
    <span class="visually-hidden">{{ liked ? 'Descurtir' : 'Curtir' }}</span>
  </button>
</template>
