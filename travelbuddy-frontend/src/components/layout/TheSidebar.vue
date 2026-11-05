<template>
  <aside class="sidebar">
    <router-link to="/perfil">Meu Perfil</router-link>
    <router-link to="/feed">Feed</router-link>
    <router-link to="/feed/seguindo">Seguindo</router-link>
    <router-link to="/busca">Busca</router-link>
  </aside>
</template>

<style scoped>
.sidebar { display: flex; flex-wrap: wrap; gap: 1rem; padding: 0.8rem 1.5rem; border-bottom: 1px solid #dce7e3; background: white; }
.sidebar a { color: #246653; text-decoration: none; }
.sidebar a.router-link-exact-active { font-weight: 700; text-decoration: underline; text-underline-offset: 0.3rem; }
</style>
