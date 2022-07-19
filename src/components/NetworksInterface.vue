<template>
  <div class="flex font-sans bg-white" v-cloak>
    <NetworkSelect />
    <div class="flex-auto p-4">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import NetworkSelect from "./NetworkSelect.vue";
</script>
