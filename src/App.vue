<template>
  <h2 class="text-2xl tracking-tight font-extrabold text-gray-900">
    <span><img class="inline w-6 pr-1"
        src="https://raw.githubusercontent.com/snapshot-labs/brand/master/icon/icon.svg" /> </span>
    <span>Network</span>
    <span class="text-indigo-600">Tester</span>
  </h2>
  <NetworksInterface />
</template>

<script setup>
  import NetworksInterface from './components/NetworksInterface.vue'
</script>

<style>
  #app {
    margin: 10px;
  }
</style>