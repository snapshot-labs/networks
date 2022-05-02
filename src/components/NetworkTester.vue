<template>
  <div v-if="app.selectedNetwork" class="mt-4">
    <div class="lg:flex lg:items-center lg:justify-between mb-4">
      <div class="flex-1 flex min-w-0">
        <img class="inline-block h-12 w-12 rounded-full ring-2 ring-white p-1" :src="'https://cloudflare-ipfs.com/ipfs/' + app.selectedNetwork.imageIPFS" alt=""/>
        <div class="mt-1">
          <h2 class="text-3xl">
            {{app.selectedNetwork.name}}
            <span v-if="app.selectedNetwork"
              class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 align-middle	">
              {{ app.selectedNetwork.key }}
            </span>
          </h2>
          <div>
            <div class="mt-2 flex items-center text-sm text-gray-500">
              
            </div>
          </div>
        </div>
      </div>
      <div class="flex">
        <button type="button" @click="editNetworkButtonClick"
          class="items-center px-4 py-2 mx-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Edit Network
        </button>
        <button type="button" @click="editNetworksJSONButtonClick"
          class="items-center px-4 py-2 mx-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Edit networks.json
        </button>
        <button type="button" @click="selectNetwork(app.selectedNetwork.key)"
          class="items-center px-4 py-2 mx-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600  hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Refresh
          <img class="inline w-4" alt="svgImg"
            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iMjQiIGhlaWdodD0iMjQiCnZpZXdCb3g9IjAgMCAxNzIgMTcyIgpzdHlsZT0iIGZpbGw6IzAwMDAwMDsiPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIGZvbnQtZmFtaWx5PSJub25lIiBmb250LXdlaWdodD0ibm9uZSIgZm9udC1zaXplPSJub25lIiB0ZXh0LWFuY2hvcj0ibm9uZSIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxwYXRoIGQ9Ik0wLDE3MnYtMTcyaDE3MnYxNzJ6IiBmaWxsPSJub25lIj48L3BhdGg+PGcgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTg2LDBsLTI4LjY2NjY3LDI4LjY2NjY3bDI4LjY2NjY3LDI4LjY2NjY3di0yMS41YzI3LjY1NjE3LDAgNTAuMTY2NjcsMjIuNTAzMzMgNTAuMTY2NjcsNTAuMTY2NjdjMCw2LjMwNjY3IC0xLjIyMzcxLDEyLjMyNzM0IC0zLjM1OTM3LDE3Ljg4ODY3bDEwLjg2MTk4LDEwLjg0Nzk4YzQuMzM1ODMsLTguNjY0NSA2LjgzMDczLC0xOC40MDIzMiA2LjgzMDczLC0yOC43MzY2NmMwLC0zNS41NjEgLTI4LjkzMTgzLC02NC41IC02NC41LC02NC41ek0yOC4zMzA3Myw1Ny4yNjMzNWMtNC4zMzU4Myw4LjY2NDUgLTYuODMwNzMsMTguNDAyMzIgLTYuODMwNzMsMjguNzM2NjVjMCwzNS41NjEgMjguOTMxODMsNjQuNSA2NC41LDY0LjV2MjEuNWwyOC42NjY2NywtMjguNjY2NjdsLTI4LjY2NjY3LC0yOC42NjY2N3YyMS41Yy0yNy42NTYxNywwIC01MC4xNjY2NywtMjIuNTAzMzMgLTUwLjE2NjY3LC01MC4xNjY2N2MwLC02LjMwNjY3IDEuMjIzNzEsLTEyLjMyNzM0IDMuMzU5MzgsLTE3Ljg4ODY3eiI+PC9wYXRoPjwvZz48L2c+PC9zdmc+" />
        </button>
      </div>
    </div>
    <div v-if="app.editNetwork">
      <h3>Edit Network Object</h3>
      <textarea v-model="app.newNetworkObject"
        class="form-textarea mt-1 block w-full input text-left p-2 border border-gray-300 rounded-md" rows="10"
        placeholder="Enter Network"></textarea>
      <button type="button" @click="app.editNetwork = false"
        class="px-4 py-2 my-2 mr-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Cancel
      </button>
      <button type="button" @click="changeNetworksObject"
        class="px-4 py-2 my-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Apply
      </button>
    </div>
    <div v-if="app.error">ERROR: {{ app.error }}</div>
    <div class="flex flex-col mt-2">
      <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr><th scope="col" class="px-6 py-1 pt-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" colspan="5">Number of Nodes - {{app.selectedNetwork.rpc.length}}</th></tr>
            <tr>
              <th scope="col" class="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                RPC 
              </th>
              <th scope="col" class="px-6 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Latest Block
              </th>
              <th scope="col" class="px-6 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Full archive node
              </th>
              <th scope="col" class="px-6 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Multicall Avg. Time
              </th>
              <th scope="col" class="px-6 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Node limit (max 10000 addresses)
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(rpc, index) in app.selectedNetwork.rpcStatus" v-bind:key="index">
              <td class="p-2 border-b-1 border-gray-600">
                <div>
                  <div class="ml-4">
                    <div>
                      <img class="w-4 cursor-pointer inline mr-2" @click="copy(rpc.url)"
                        src="https://img.icons8.com/material-outlined/24/000000/copy.png" />
                      <img class="w-4 cursor-pointer inline mr-2"
                        @click="app.networks[app.selectedNetwork.key].rpc = app.networks[app.selectedNetwork.key].rpc.filter(a => a !== rpc.url);selectNetwork(app.selectedNetwork.key)"
                        src="
                              data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAAZUlEQVRIiWNgGCmggYGB4T8a7iBGIyMWsf8UOgbFTCYKDSMbwIKBYvU09wGxFqC7kGgfDhofjFowasGoBRQAFiLVoRfr2Ip5rGDAgugplEavxXBhZD1EAT8GBoYnJFjwBKpnGAIAUcAmPA1WYN0AAAAASUVORK5CYII=" />
                      <span v-if="rpc.light" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-500 text-white align-middle">Light</span>
                      <h3 class=" text-sm leading-6 font-medium text-gray-900" style="width: 500px;
                                  overflow: hidden;
                                  text-overflow: ellipsis;">
                        {{rpc.url}}
                      </h3>
                    </div>

                  </div>
                </div>
              </td>
              <td v-if="rpc.status.loading" colspan="4" class="p-2 border-b-1 border-gray-600 text-center">
                <div class="animate-pulse flex">
                  <div class="h-4 bg-blue-400 rounded w-5/6"></div>
                </div>
              </td>
              <td class="p-2 border-b-1 border-gray-600 text-center" v-if="!rpc.status.loading">
                <a target="blank" :href="`${app.selectedNetwork.explorer}/block/${rpc.status.latestBlockNumber}`">
                  <h2 class="title-font font-medium text-2xl text-gray-900">
                    {{rpc.status.latestBlockNumber}}
                  </h2>
                </a>
              </td>
              <td class="p-2 border-b-1 border-gray-600 text-center" v-if="!rpc.status.loading">
                <h2 class="title-font font-medium text-gray-900">
                  <div class="relative border-b-2 pb-1">
                  {{rpc.status.fullArchiveNode}} <div class="text-xs text-gray-400"> 1st block </div>
                  </div>
                  <div class="pt-1">
                  {{rpc.status.fullArchiveNodeStart}} <div class="text-xs text-gray-400"> Start block </div>
                  </div>
                </h2>
              </td>
              <td class="p-2 border-b-1 border-gray-600 text-center" v-if="!rpc.status.loading">
                <h2 class="title-font font-medium text-2xl text-gray-900">
                  {{rpc.status.multicall}}
                </h2>
              </td>
              <td class="p-2 border-b-1 border-gray-600 text-center" v-if="!rpc.status.loading">
                <div class="title-font text-xs text-gray-600" v-if="typeof rpc.status.nodeLimit === 'string' && rpc.status.nodeLimit.startsWith('checking')">
                  {{rpc.status.nodeLimit}}
                </div>
                <h2 class="title-font font-medium text-2xl text-gray-900" v-else>
                  {{rpc.status.nodeLimit}}
                </h2>
              </td>
            </tr>
            <AddRPC />
          </tbody>
        </table>
      </div>
      <div class="mt-6 max-w-20">
        <div v-for="(rpc) in app.selectedNetwork.rpcStatus" :key="rpc.index">
          <div class="flex max-w-20 overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800 m-4"
            v-if="rpc.status.errors && rpc.status.errors.length > 0">
            <div class="flex items-center justify-center bg-red-500">
              <svg class="w-6 h-6 text-white fill-current" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z" />
              </svg>
            </div>

            <div class="px-4 py-2 -mx-3 max-w-4xl">
              <div class="mx-3">
                <span class="font-semibold text-red-500 dark:text-red-400">Errors for: {{rpc.url}}</span>
                <p class="text-sm text-gray-600 dark:text-gray-200 py-2" v-for="(error, index) in rpc.status.errors"
                  :key="index">
                  {{ error }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import {
    useApp
  } from '../composables/useApp'
  import copy from 'copy-to-clipboard';
  import AddRPC from './AddRPC.vue';

  const {
    app,
    selectNetwork,
    editNetworkButtonClick,
    editNetworksJSONButtonClick,
    changeNetworksObject
  } = useApp();
</script>