<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'
import { createDestinationComment, getDestinationComments } from '../services/commentService'
import { formatDate } from '../utils/format'
import { getProfilePictureUrl } from '../utils/media'

const props = defineProps({ destinationId: { type: [Number, String], required: true }, initialCount: { type: Number, default: 0 } })
const emit = defineEmits(['update:count'])
const { isAuthenticated } = useAuth()
const comments = ref([])
const content = ref('')
const loading = ref(true)
const submitting = ref(false)
const errorMessage = ref('')
const validationMessage = ref('')

async function loadComments() {
  loading.value = true
  errorMessage.value = ''
  try {
    const response = await getDestinationComments(props.destinationId)
    comments.value = response.data
    emit('update:count', comments.value.length)
  } catch (error) { errorMessage.value = error.message || 'Não foi possível carregar os comentários.' }
  finally { loading.value = false }
}

async function submitComment() {
  const trimmed = content.value.trim()
  if (!trimmed) { validationMessage.value = 'Escreva um comentário antes de publicar.'; return }
  if (trimmed.length > 500) { validationMessage.value = 'O comentário deve ter no máximo 500 caracteres.'; return }
  validationMessage.value = ''
  submitting.value = true
  try {
    const response = await createDestinationComment(props.destinationId, trimmed)
    comments.value.unshift(response.data)
    content.value = ''
    emit('update:count', comments.value.length)
  } catch (error) { validationMessage.value = error.message || 'Não foi possível publicar o comentário.' }
  finally { submitting.value = false }
}

onMounted(loadComments)
</script>

<template>
  <section class="comment-section mt-4" aria-labelledby="comments-heading">
    <h2 id="comments-heading" class="h4 mb-3">Comentários <span class="count-pill">{{ comments.length }}</span></h2>
    <form v-if="isAuthenticated" class="comment-form mb-4" @submit.prevent="submitComment">
      <label class="visually-hidden" for="new-comment">Escreva um comentário</label>
      <textarea id="new-comment" v-model="content" class="form-control" rows="3" maxlength="500" placeholder="Compartilhe sua experiência..." />
      <div class="d-flex justify-content-between align-items-center mt-2"><span class="small text-muted">{{ content.trim().length }}/500</span><button class="btn btn-primary" type="submit" :disabled="submitting">{{ submitting ? 'Publicando...' : 'Comentar' }}</button></div>
      <p v-if="validationMessage" class="text-danger small mt-2 mb-0" role="alert">{{ validationMessage }}</p>
    </form>
    <p v-else class="text-muted">Entre para participar da conversa.</p>
    <p v-if="loading" class="text-muted">Carregando comentários...</p>
    <p v-else-if="errorMessage" class="alert alert-danger">{{ errorMessage }} <button class="btn btn-link p-0" @click="loadComments">Tentar novamente</button></p>
    <p v-else-if="!comments.length" class="text-muted">Ainda não há comentários.</p>
    <article v-for="comment in comments" :key="comment.id" class="comment-item">
      <img :src="getProfilePictureUrl(comment.User?.profilePicture)" alt="" class="rounded-circle" width="38" height="38" />
      <div class="flex-grow-1"><div class="d-flex gap-2 align-items-center"><strong>@{{ comment.User?.username || 'viajante' }}</strong><time class="small text-muted">{{ formatDate(comment.createdAt) }}</time></div><p class="comment-content mb-0">{{ comment.content }}</p></div>
    </article>
  </section>
</template>
