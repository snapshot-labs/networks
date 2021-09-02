import { ref, computed, reactive } from 'vue';
import { Contract } from '@ethersproject/contracts';
import { Interface } from '@ethersproject/abi';
import { StaticJsonRpcProvider } from '@ethersproject/providers';

const state = reactive({
  selectedNetwork: null,
  editNetwork: false,
  editNetworkType: '',
  error: false,
  newNetworkObject: '',
  networks: {},
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

async function multicall(
  network: string,
  provider,
  abi: any[],
  calls: any[],
  options?
) {
  const multicallAbi = [
    'function aggregate(tuple(address target, bytes callData)[] calls) view returns (uint256 blockNumber, bytes[] returnData)'
  ];
  const multi = new Contract(
    state.networks[network].multicall,
    multicallAbi,
    provider
  );
  const itf = new Interface(abi);
  try {
    const [, res] = await multi.aggregate(
      calls.map((call) => [
        call[0].toLowerCase(),
        itf.encodeFunctionData(call[1], call[2])
      ]),
      options || {}
    );
    return res.map((call, i) => itf.decodeFunctionResult(calls[i][1], call));
  } catch (e) {
    return Promise.reject(e);
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
  for (const rpc of selectedNetwork.rpcStatus) {
    let provider = null;
    let latestBlockNumber, fullArchiveNode = '...';
    let errors = [];

    try {
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
        const response = await multicall(
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
  async function init() {
    await getNetworks();
    state.loading = false;
  }

  async function getNetworks() {
    const networksObj: any = await fetch(
      'https://raw.githubusercontent.com/snapshot-labs/snapshot.js/master/src/networks.json'
    ).then(res => res.json());
    state.networks = networksObj;
    return networksObj;
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
