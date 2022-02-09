import { ref, computed, reactive } from 'vue';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { multicall } from '../helpers/utils';

const state = reactive({
  selectedNetwork: null,
  editNetwork: false,
  editNetworkType: '',
  error: false,
  newNetworkObject: '',
  networks: {},
  addresses: [],
  loading: true
});

function editNetworkButtonClick() {
  state.editNetwork = true;
  state.editNetworkType = 'selected';
  if (state.editNetwork) {
    state.newNetworkObject = JSON.stringify(state.networks[state.selectedNetwork.key], null, 2)
  }
}

function editNetworksJSONButtonClick() {
  state.editNetwork = true;
  state.editNetworkType = 'full';
  if (state.editNetwork) {
    state.newNetworkObject = JSON.stringify(state.networks, null, 2)
  }
}

function changeNetworksObject() {
  try {
    if(state.editNetworkType === 'full') {
      state.networks = JSON.parse(state.newNetworkObject)
      selectNetwork(state.selectedNetwork.key);
    } else {
      state.networks[state.selectedNetwork.key] = JSON.parse(state.newNetworkObject)
      selectNetwork(state.selectedNetwork.key);
    }
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
  state.selectedNetwork = JSON.parse(JSON.stringify(state.networks[networkKey]));
  const selectedNetwork = state.selectedNetwork;
  selectedNetwork.rpcStatus = JSON.parse(JSON.stringify(state.selectedNetwork.rpc)).map((rpc,
    index) => ({
    url: rpc,
    index,
    status: {
      loading: true
    }
  }))
  const providers = {}
  for (const rpc of selectedNetwork.rpcStatus) {
    const rpcID = JSON.stringify(rpc.url);
    let provider = null;
    let latestBlockNumber, fullArchiveNode, fullArchiveNodeStart = '...';
    let errors = [];

    try {
      providers[rpcID] = {}
      providers[rpcID].provider = new StaticJsonRpcProvider(rpc.url)
      provider = providers[rpcID].provider;
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
      fullArchiveNode = await provider.getBalance(state.selectedNetwork.multicall, 1);
      // @ts-ignore
      fullArchiveNode = fullArchiveNode >= 0 ? 'Yes' : 'No';
    } catch (error) {
      fullArchiveNode = 'ERROR!';
      errors.push('fullArchiveNode Error: ' + error.message)
      console.log('fullArchiveNode', error);
    }

    // Is archive node (start block)
    try {
      fullArchiveNodeStart = await provider.getBalance(state.selectedNetwork.multicall, state.selectedNetwork.start);
      // @ts-ignore
      fullArchiveNodeStart = fullArchiveNodeStart >= 0 ? 'Yes' : 'No';
    } catch (error) {
      fullArchiveNodeStart = 'ERROR!';
      errors.push('fullArchiveNodeStart Error: ' + error.message)
      console.log('fullArchiveNodeStart', error);
    }
    

    rpc.status = {
      latestBlockNumber,
      fullArchiveNode,
      fullArchiveNodeStart,
      errors,
      multicall: '...',
      nodeLimit: '...',
      loading: false
    }
  }
  // Multicall and node limit check
  for(const rpc of selectedNetwork.rpcStatus) {
    const rpcID = JSON.stringify(rpc.url);
    const provider = providers[rpcID]?.provider;
    const abi = [
      'function getEthBalance(address addr) view returns (uint256 balance)'
    ]

    if(provider) {
      // Multicall
      try {
        const addresses = [selectedNetwork.multicall];
        let multicallAvgTime = 0;
        // Calculate avg. time for three multicalls
        for (const a of [1, 2, 3]) {
          const multicallStart = performance.now();
          const response = await multicall(
            state.networks[selectedNetwork.key],
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
        rpc.status.nodeLimit = 'ERROR!'
        rpc.status.errors.push('multicall Error: ' + error.message)
        console.log('multicall', error);
      }

      // Check node limit
      if(rpc.status.multicall !== 'ERROR!') {
        let numberOfAddress = 3000;
        let nodeLimit = 0;
        while(true) {
          try {
            rpc.status.nodeLimit = 'checking with ' + numberOfAddress + ' addresses'
            const response = await multicall(
              state.networks[selectedNetwork.key],
              provider,
              abi,
              state.addresses.slice(0, numberOfAddress).map((address) => [
                selectedNetwork.multicall,
                'getEthBalance',
                [address]
              ]), {
                blockTag: 'latest'
              }
            );
            nodeLimit = response.length
            break;
          } catch (error) {
            numberOfAddress -= 200;
            if(numberOfAddress <= 0){
              rpc.status.nodeLimit = 'ERROR!'
              break;
            }
          }
        }
        rpc.status.nodeLimit = nodeLimit
      }
    } else {
        rpc.status.multicall = 'ERROR!'
        rpc.status.nodeLimit = 'ERROR!'
    }
  }
}

export function useApp() {
  async function init() {
    await getData();
    state.loading = false;
  }

  async function getData() {
    const [networksObj, addresses]: any = await Promise.all([fetch(
      'https://raw.githubusercontent.com/snapshot-labs/snapshot.js/master/src/networks.json'
    ).then(res => res.json()), fetch(
      'https://raw.githubusercontent.com/snapshot-labs/snapshot-strategies/master/test/addresses.json'
    ).then(res => res.json())]);
    state.networks = networksObj;
    state.addresses = addresses;
  }

  return {
    init,
    selectNetwork,
    editNetworkButtonClick,
    editNetworksJSONButtonClick,
    changeNetworksObject,
    app: computed(() => state)
  };
}
