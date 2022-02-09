<template>
  <div class="flex" v-cloak>
    <NetworkSelect />
    <div class="flex-auto p-4">
      <h3 class="text-xl font-blod" v-if="!app.selectedNetwork">
        Select a network from menu
      </h3>
      <NetworkTester />
    </div>
  </div>
</template>

<script setup>
  import { useApp } from '../composables/useApp'
  import NetworkSelect from './NetworkSelect.vue'
  import NetworkTester from './NetworkTester.vue'

  const { app  } = useApp();
</script>