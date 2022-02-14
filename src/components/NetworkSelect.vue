<template>
  <div class="relative inline-block text-left w-60 shadow-md bg-white">
    <div class="py-4 px-3 border-b-2">
      <a href="#!">
        <h2 class="text-2xl tracking-tight font-bold text-gray-900">
          <span><img class="inline w-6 pr-2"
              src="https://raw.githubusercontent.com/snapshot-labs/brand/master/icon/icon.svg" /> </span>
          <span>Network</span>
          <span class="text-indigo-600"> Tester</span>
        </h2>
      </a>
    </div>
    <ul>
        <li class="relative"  v-for="(item, index) in Object.values(app.networks)" :key="index" @click="selectNetwork(item.key)">
          <a href="#"
            class="flex hover:bg-purple-700 focus-within:bg-purple-700 hover:text-white focus-within:text-white p-1 pl-2 text-gray-700"
            role="none">
              <div>
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  {{ item.key }}
                </span>
              </div>
              <div class=" px-2 py-1 text-sm " role="menuitem" tabindex="-1" id="menu-item-0">{{item.name}}
              </div>
          </a>
        </li>
    </ul>
  </div>
</template>

<script setup>
  import { useApp } from '../composables/useApp'
  const { app, selectNetwork } = useApp();
  
</script>