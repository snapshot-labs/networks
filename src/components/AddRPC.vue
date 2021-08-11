<template>
  <tr>
    <td colspan="4" class="p-4 border-b-1 border-gray-600 cursor-pointer"
      v-if="!app.selectedNetwork.addRPCInput" @click="app.selectedNetwork.addRPCInput = true">
      <img class="inline pr-2"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAABbUlEQVRIid2UTU7DMBCFP1I1G8oVOEDhDpQFLFGpUK9QUSF+LoEqzgArfg6D2FAQlAJbOEBY0AUNixkTq9hx3GWfNHLimXnPmcwYFh0p0AVugBHwpTYCrtWXzkveAd6BPGBvwG4McQKcWQT3wCHQBJbV1oAjYGjFDTQ3CEP+DfQCSQmwr7FGpBQdi3yjymkULUuk7QtKKWre88SYcrjQV98rUHcFdClq7itLmUANeFD/ntm0iUwnnANTD0kZfoALfXaW6UXVmyUkZV8A0l05Mif/kKmz4SAMmcGKvmdmo1LfRmBJ178S2wIfuq7OJNgW2je5ny6BO123Ik9tY1vXW5fTtOmQ+dv0kZk2tZEiF1eOjH+swIH6xngGDWQWzFXR8gU5sAlMkJ+7EwoeWCJ95NN9qCEnn2jOaZXTJJZIjoz/MTJEDbV14ISi5lMlj2r7NnJxhYZsTIWy+FBHOuIKeEYmNAOegEv1eX/oYuAXIGV8V8ESsxoAAAAASUVORK5CYII=" />
      Add RPC
    </td>
    <td colspan="4" class="p-4 border-b-1 border-gray-600" v-if="app.selectedNetwork.addRPCInput">
      <input type="text"
        class="form-control p-3 my-3 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        v-model="app.selectedNetwork.newRPC" placeholder="Enter RPC URL" />
      <button
        @click="app.networks[app.selectedNetwork.key].rpc.push(app.selectedNetwork.newRPC);selectNetwork(app.selectedNetwork.key)"
        class="items-center px-4 py-2 mx-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Add</button>
      <button @click="app.selectedNetwork.addRPCInput = false"
        class="items-center px-4 py-2 mx-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Cancel</button>
    </td>
  </tr>
</template>

<script setup>
  import { useApp } from '../composables/useApp'
  const { app, selectNetwork } = useApp();
  
</script>