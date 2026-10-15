<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { deleteDestination, getMyDestinations } from '../services/destinationService'
import DestinationCard from '../components/DestinationCard.vue'
import BaseModal from '../components/base/BaseModal.vue'
import BaseButton from '../components/base/BaseButton.vue'

const destinations = ref([])
const loading = ref(true)
const deleting = ref(false)
const errorMessage = ref('')
const modalOpen = ref(false)
const selected = ref(null)
async function load() {
  loading.value = true
  try { destinations.value = (await getMyDestinations()).data }
  catch (error) { errorMessage.value = error.message }
  finally { loading.value = false }
}
function askDelete(item) { selected.value = item; modalOpen.value = true }
async function confirmDelete() {
  if (!selected.value || deleting.value) return
  deleting.value = true
  errorMessage.value = ''
  try {
    await deleteDestination(selected.value.id)
    destinations.value = destinations.value.filter(item => item.id !== selected.value.id)
    modalOpen.value = false
    selected.value = null
  } catch (error) { errorMessage.value = error.message }
  finally { deleting.value = false }
}
onMounted(load)
</script>

<template>
  <section class="container py-4 page-shell">
    <div class="page-heading">
      <div><p class="eyebrow">SUA COLEÇÃO</p><h1>Meus destinos</h1><p class="text-muted mb-0">Gerencie os lugares que você compartilhou.</p></div>
      <RouterLink class="btn btn-primary" :to="{ name: 'upload' }"><i class="bi bi-plus-lg me-2" />Novo destino</RouterLink>
    </div>
    <div v-if="errorMessage" class="alert alert-danger mt-4">{{ errorMessage }}</div>
    <div v-if="loading" class="empty-state mt-4">Carregando seus destinos...</div>
    <div v-else-if="!destinations.length" class="empty-state mt-4"><i class="bi bi-map" /><h2>Nenhum destino por aqui ainda</h2><p>Compartilhe seu primeiro lugar favorito.</p><RouterLink class="btn btn-primary" :to="{ name: 'upload' }">Publicar destino</RouterLink></div>
    <div v-else class="row g-4 mt-1">
      <div v-for="destination in destinations" :key="destination.id" class="col-12 col-sm-6 col-xl-4">
        <DestinationCard :destination="destination">
          <template #actions>
            <div class="d-flex gap-2">
              <RouterLink :to="{ name: 'relato-edit', params: { id: destination.id } }" class="btn btn-sm btn-outline-success" :aria-label="`Editar ${destination.title}`"><i class="bi bi-pencil" /></RouterLink>
              <button class="btn btn-sm btn-outline-danger" :aria-label="`Excluir ${destination.title}`" @click="askDelete(destination)"><i class="bi bi-trash" /></button>
            </div>
          </template>
        </DestinationCard>
      </div>
    </div>
    <BaseModal v-model="modalOpen" title="Excluir destino" :busy="deleting" @confirm="confirmDelete">
      <p class="mb-0">Tem certeza de que deseja excluir <strong>{{ selected?.title }}</strong>? A imagem também será removida. Essa ação não pode ser desfeita.</p>
    </BaseModal>
  </section>
</template>
