<template>
    <div class="mt-6 max-w-20">
        <div v-for="rpc in rpcStatus" :key="rpc.index">
          <div
            class="flex max-w-20 overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800 m-4"
            v-if="rpc.status.errors && rpc.status.errors.length > 0"
          >
            <div class="flex items-center justify-center bg-red-500">
              <svg
                class="w-6 h-6 text-white fill-current"
                viewBox="0 0 40 40"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z"
                />
              </svg>
            </div>

            <div class="px-4 py-2 -mx-3 max-w-4xl">
              <div class="mx-3">
                <span class="font-semibold text-red-500 dark:text-red-400"
                  >Errors for: {{ rpc.url }}</span
                >
                <p
                  class="text-sm text-gray-600 dark:text-gray-200 py-2"
                  v-for="(error, index) in rpc.status.errors"
                  :key="index"
                >
                  {{ error }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
</template>
<script>
export default {
  props: ['rpcStatus']
}
</script>
