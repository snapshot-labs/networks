<template>
  <div class="relative inline-block text-left w-60 shadow-md">
    <div class="py-4 px-4 border-b-2">
      <router-link to="/">
        <img
          class="inline w-8"
          src="https://raw.githubusercontent.com/snapshot-labs/brand/master/icon/icon.svg"
        />
        <h2
          class="inline text-2xl tracking-tight font-bold text-gray-900 ml-3 align-middle"
        >
          Networks
        </h2>
      </router-link>
    </div>
    <ul>
      <li
        class="relative"
        v-for="(item, index) in Object.values(app.networks)"
        :key="index"
      >
        <router-link :to="item.key">
          <div
            :class="`flex hover:bg-purple-500 hover:text-white p-2 pl-2 border-b-2 ${
              $route.params.id === item.key
                ? ' bg-purple-700 text-white'
                : 'text-gray-700'
            }`"
          >
            <div>
              <span
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
              >
                {{ item.key }}
              </span>
            </div>
            <div
              class="px-2 py-1 text-sm"
              role="menuitem"
              tabindex="-1"
              id="menu-item-0"
            >
              {{ item.name }}
            </div>
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useApp } from "../composables/useApp";
const { app } = useApp();
</script>
