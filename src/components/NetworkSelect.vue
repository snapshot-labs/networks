<template>
  <div class="relative inline-block text-left">
    <div
      class="mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none"
      role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
      <a href="#"
        class="flex hover:bg-purple-700 focus-within:bg-purple-700 hover:text-white focus-within:text-white p-1 text-gray-700"
        role="none" v-for="(item, index) in Object.values(app.networks)" :key="index" @click="selectNetwork(item.key)">
        <div>
          <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            {{ item.key }}
          </span>
        </div>
        <div class=" px-2 py-1 text-sm " role="menuitem" tabindex="-1" id="menu-item-0">{{item.name}}
        </div>
      </a>
    </div>
  </div>
</template>

<script setup>
  import { useApp } from '../composables/useApp'
  const { app, selectNetwork } = useApp();
  
</script>