
<script setup>
  import { onMounted } from 'vue';
  import NetworksInterface from './components/NetworksInterface.vue'
  import {
    useApp
  } from './composables/useApp'
  const { init, app } = useApp();
  onMounted(async () => {
    init();
  });
</script>

<template>
  
  <div v-if="app.loading">
    Loading...
  </div>
  <NetworksInterface v-else/>
</template>

<style>
  
</style>