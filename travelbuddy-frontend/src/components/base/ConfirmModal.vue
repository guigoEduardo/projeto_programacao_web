<script setup>
import BaseModal from './BaseModal.vue'
defineProps({modelValue:Boolean,title:{type:String,default:'Confirmar ação'},busy:Boolean,confirmLabel:{type:String,default:'Confirmar'}})
const emit=defineEmits(['update:modelValue','confirm'])
</script>
<template><BaseModal :model-value="modelValue" :title="title" :busy="busy" :confirm-label="confirmLabel" @update:model-value="emit('update:modelValue',$event)" @confirm="emit('confirm')"><slot/></BaseModal></template>
