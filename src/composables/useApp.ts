import { ref, computed, reactive } from 'vue';
import snapshot from '@snapshot-labs/snapshot.js';
import networks from '@snapshot-labs/snapshot.js/src/networks.json'
import { StaticJsonRpcProvider } from '@ethersproject/providers';

const state = reactive({
  selectedNetwork: null,
  editNetwork: false,
  error: false,
  newNetworkObject: '',
  networks
});

function editNetworkButtonClick() {
  state.editNetwork = !state.editNetwork;
  if (state.editNetwork) {
    state.newNetworkObject = JSON.stringify(state.networks[state.selectedNetwork.key], null, 2)
  }
}

function changeNetworksObject() {
  try {
    state.networks[state.selectedNetwork.key] = JSON.parse(state.newNetworkObject)
    selectNetwork(state.selectedNetwork.key);
  } catch (error) {
    console.log(error.message)
    state.error = error.message
  }
}

async function selectNetwork(networkKey) {
  state.selectedNetwork = null;
  state.error = false;
  state.editNetwork = false;
  state.newNetworkObject = '';
  state.selectedNetwork = JSON.parse(JSON.stringify(networks[networkKey]));
  const selectedNetwork = state.selectedNetwork;
  selectedNetwork.rpcStatus = JSON.parse(JSON.stringify(state.selectedNetwork.rpc)).map((rpc,
    index) => ({
    url: rpc,
    index,
    status: {
      loading: true
    }
  }))
  for (const rpc of selectedNetwork.rpcStatus) {
    let provider = null;
    let latestBlockNumber, fullArchiveNode = '...';
    let errors = [];

    try {
      // provider = snapshot.utils.getProvider(selectedNetwork.key, rpc.index)
      provider = new StaticJsonRpcProvider(rpc.url)
    } catch (error) {
      errors.push('Provider Error: ' + error.message)
      console.log('Provider Error', error)
    }

    // Latest Block
    try {
      latestBlockNumber = await provider.getBlockNumber();
    } catch (error) {
      latestBlockNumber = 'ERROR!';
      errors.push('getBlockNumber Error: ' + error.message)
      console.log('getBlockNumber Error', error)
    }

    // Is archive node
    try {
      fullArchiveNode = await provider.getBalance(state.selectedNetwork.multicall, 0);
      // @ts-ignore
      fullArchiveNode = fullArchiveNode >= 0 ? 'Yes' : 'No';
    } catch (error) {
      fullArchiveNode = 'ERROR!';
      errors.push('fullArchiveNode Error: ' + error.message)
      console.log('fullArchiveNode', error);
    }

    rpc.status = {
      latestBlockNumber,
      fullArchiveNode,
      errors,
      multicall: '...',
      loading: false
    }

    try {
      const abi = [
        'function aggregate(tuple(address target, bytes callData)[] calls) view returns (uint256 blockNumber, bytes[] returnData)',
        'function getEthBalance(address addr) view returns (uint256 balance)'
      ]
      const addresses = [selectedNetwork.multicall];
      let multicallAvgTime = 0;

      // Calculate avg. time for three multicalls
      for (const a of [1, 2, 3]) {
        const multicallStart = performance.now();
        const response = await snapshot.utils.multicall(
          selectedNetwork.key,
          provider,
          abi,
          addresses.map((address) => [
            selectedNetwork.multicall,
            'getEthBalance',
            [address]
          ]), {
            blockTag: 'latest'
          }
        );
        const multicallEnd = performance.now();
        multicallAvgTime += (multicallEnd - multicallStart);
      }

      rpc.status.multicall = (multicallAvgTime / 3).toFixed(2) + " ms"
    } catch (error) {
      rpc.status.multicall = 'ERROR!'
      rpc.status.errors.push('multicall Error: ' + error.message)
      console.log('multicall', error);
    }
  }
}

export function useApp() {
  return {
    selectNetwork,
    editNetworkButtonClick,
    changeNetworksObject,
    app: computed(() => state)
  };
}
