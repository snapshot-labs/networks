<template>
  <div class="relative inline-block text-left w-60 shadow-md">
    <div>
      <div class="py-5 flex justify-center border-b">
        <router-link to="/">
          <img
            class="inline w-6"
            src="https://raw.githubusercontent.com/snapshot-labs/brand/master/icon/icon.svg"
          />
          <h2
            class="inline text-xl tracking-tight font-semi-bold text-gray-900 ml-2 align-middle"
          >
            Networks
          </h2>
        </router-link>
      </div>
      <!-- <input
        type="text"
        placeholder="Search Network"
        class="p-2 w-full border border-l-0 border-r-0"
        @input="searchInput"
      /> -->
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
import { ref } from "vue";
import { useApp } from "../composables/useApp";
const { app } = useApp();
// const search = ref("");

// const searchInput = (e) => {
//   const input = e.target.value;
//   search.value = input;
// };
</script>
