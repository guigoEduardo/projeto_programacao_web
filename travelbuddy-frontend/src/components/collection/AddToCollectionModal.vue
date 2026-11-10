<script setup>
import { ref, watch } from 'vue'
import { useAsyncData } from '../../composables/useAsyncData'
import { getDestinationCollectionsStatus, addDestinationToCollection, removeDestinationFromCollection } from '../../services/collectionService'
import { runOptimistic } from '../../utils/optimistic'
import BaseModal from '../base/BaseModal.vue'
const props=defineProps({open:Boolean,destinationId:{type:Number,required:true}}),emit=defineEmits(['close'])
const locked=ref(new Set())
const {data:rows,loading,errorMessage,execute}=useAsyncData(()=>getDestinationCollectionsStatus(props.destinationId),{initialValue:[]})
watch(()=>props.open,v=>{if(v)execute().catch(()=>{})})
async function toggle(row){if(locked.value.has(row.id))return;locked.value=new Set(locked.value).add(row.id);const was=row.hasDestination;try{await runOptimistic({apply(){row.hasDestination=!was;row.destinationsCount=Math.max(0,row.destinationsCount+(was?-1:1));return()=>{row.hasDestination=was;row.destinationsCount=Math.max(0,row.destinationsCount+(was?1:-1))}},request:()=>was?removeDestinationFromCollection(row.id,props.destinationId):addDestinationToCollection(row.id,props.destinationId),confirm(data){if(data?.destinationsCount!==undefined)row.destinationsCount=data.destinationsCount}})}catch{}finally{const next=new Set(locked.value);next.delete(row.id);locked.value=next}}
</script>
<template><BaseModal :model-value="open" title="Salvar em uma coleção" confirm-label="Fechar" @update:model-value="v=>!v&&emit('close')" @confirm="emit('close')"><p v-if="loading">Carregando coleções…</p><p v-else-if="errorMessage" class="alert alert-danger">{{errorMessage}}</p><div v-else-if="!rows.length" class="alert alert-light">Você ainda não tem coleções. <RouterLink :to="{name:'my-collections'}" @click="emit('close')">Criar a primeira</RouterLink>.</div><div v-else class="list-group"><label v-for="row in rows" :key="row.id" class="list-group-item d-flex align-items-center gap-2"><input type="checkbox" class="form-check-input mt-0" :checked="row.hasDestination" :disabled="locked.has(row.id)" @change="toggle(row)"/><span class="flex-grow-1">{{row.title}}</span><i v-if="!row.isPublic" class="bi bi-lock-fill text-muted" title="Privada"/><span class="badge bg-secondary">{{row.destinationsCount}}</span></label></div><template #footer><button type="button" class="btn btn-secondary" @click="emit('close')">Fechar</button></template></BaseModal></template>
