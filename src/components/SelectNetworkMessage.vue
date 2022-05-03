<template>
  <h3 class="p-4 text-2xl font-blod" v-if="!app.selectedNetwork">
    Select a network from menu
  </h3>
</template>

<script setup>
import { useApp } from "../composables/useApp";
const { app } = useApp();
</script>
