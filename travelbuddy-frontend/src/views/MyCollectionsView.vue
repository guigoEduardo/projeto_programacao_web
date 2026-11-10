<script setup>
import { ref, computed } from 'vue'
import { useAsyncData } from '../composables/useAsyncData'
import { getMyCollections, deleteCollection } from '../services/collectionService'
import { useToast } from '../composables/useToast'
import CreateCollectionModal from '../components/collection/CreateCollectionModal.vue'
import BaseModal from '../components/base/BaseModal.vue'
const toast=useToast(), creating=ref(false), deleting=ref(null), deletingBusy=ref(false)
const deleteOpen=computed({get:()=>Boolean(deleting.value),set:v=>{if(!v)deleting.value=null}})
const {data:collections,loading,errorMessage,execute}=useAsyncData(()=>getMyCollections(),{initialValue:[],immediate:true})
function created(item){ collections.value=[item,...collections.value]; creating.value=false; toast.success('Coleção criada.') }
async function confirmDelete(){ if(!deleting.value)return; deletingBusy.value=true; try{ await deleteCollection(deleting.value.id); collections.value=collections.value.filter(c=>c.id!==deleting.value.id); deleting.value=null; toast.success('Coleção excluída.') }finally{deletingBusy.value=false} }
</script>
<template><section class="container py-4"><div class="d-flex justify-content-between align-items-center mb-4"><div><h1>Minhas Coleções</h1><p class="text-muted mb-0">Organize seus destinos favoritos.</p></div><button class="btn btn-primary" @click="creating=true"><i class="bi bi-plus-lg me-1"/>Criar coleção</button></div><p v-if="loading">Carregando coleções…</p><div v-else-if="errorMessage" class="alert alert-danger">{{errorMessage}} <button class="btn btn-link" @click="execute().catch(()=>{})">Tentar novamente</button></div><div v-else-if="!collections.length" class="alert alert-light">Você ainda não tem coleções. Crie uma para salvar destinos.</div><div v-else class="row g-3"><div v-for="c in collections" :key="c.id" class="col-md-6 col-lg-4"><article class="card h-100 position-relative"><div class="card-body"><RouterLink class="stretched-link text-decoration-none" :to="{name:'collection-detail',params:{id:c.id}}"><h2 class="h5">{{c.title}}</h2></RouterLink><span class="badge" :class="c.isPublic?'bg-success':'bg-secondary'">{{c.isPublic?'Pública':'Privada'}}</span><p class="text-muted mt-2 mb-3">{{c.destinationsCount}} {{c.destinationsCount===1?'destino':'destinos'}}</p><button class="btn btn-sm btn-outline-danger position-relative" style="z-index:2" @click="deleting=c">Excluir</button></div></article></div></div><CreateCollectionModal v-if="creating" :open="creating" @close="creating=false" @created="created"/><BaseModal v-model="deleteOpen" title="Excluir coleção" :busy="deletingBusy" @confirm="confirmDelete"><p>Excluir “{{deleting?.title}}”?</p></BaseModal></section></template>
