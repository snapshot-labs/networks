import { computed, reactive } from "vue";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { multicall } from "../helpers/utils";
import exampleAddresses from "../assets/addresses.json";

const abi = [
  "function getEthBalance(address addr) view returns (uint256 balance)",
];

const state = reactive({
  selectedNetwork: null,
  editNetwork: false,
  editNetworkType: "",
  error: false,
  newNetworkObject: "",
  networks: {},
  addresses: [],
  loading: true,
});

function editNetworkButtonClick() {
  state.editNetwork = true;
  state.editNetworkType = "selected";
  if (state.editNetwork) {
    state.newNetworkObject = JSON.stringify(
      state.networks[state.selectedNetwork.key],
      null,
      2
    );
  }
}

function editNetworksJSONButtonClick() {
  state.editNetwork = true;
  state.editNetworkType = "full";
  if (state.editNetwork) {
    state.newNetworkObject = JSON.stringify(state.networks, null, 2);
  }
}

const checkBlockAndArchiveNode: any = async (selectedNetwork) => {
  const providers = {};
  for (const rpc of selectedNetwork.rpcStatus) {
    if (selectedNetwork.chainId !== state.selectedNetwork.chainId) continue;
    const rpcID = JSON.stringify(rpc.url);
    let provider = null;
    let latestBlockNumber,
      fullArchiveNode,
      fullArchiveNodeStart = "...";
    const errors = [];

    try {
      providers[rpcID] = {};
      const connectionInfo =
        typeof rpc.url === "object"
          ? { ...rpc.url, timeout: 25000, allowGzip: true }
          : { url: rpc.url, timeout: 25000, allowGzip: true };
      providers[rpcID].provider = new StaticJsonRpcProvider(connectionInfo);
      // providers[rpcID].provider = new StaticJsonRpcProvider(rpc.url)
      provider = providers[rpcID].provider;
    } catch (error) {
      errors.push("Provider Error: " + error.message);
      console.log("Provider Error", error);
    }

    // Latest Block
    try {
      latestBlockNumber = await provider.getBlockNumber();
    } catch (error) {
      latestBlockNumber = "ERROR!";
      errors.push("getBlockNumber Error: " + error.message);
      console.log("getBlockNumber Error", error);
    }

    // Is archive node
    try {
      fullArchiveNode = await provider.getBalance(
        state.selectedNetwork.multicall,
        1
      );
      fullArchiveNode = parseFloat(fullArchiveNode) >= 0 ? "Yes" : "No";
    } catch (error) {
      fullArchiveNode = "ERROR!";
      errors.push("fullArchiveNode Error: " + error.message);
      console.log("fullArchiveNode", error);
    }

    // Is archive node (start block)
    try {
      fullArchiveNodeStart = await provider.getBalance(
        state.selectedNetwork.multicall,
        state.selectedNetwork.start
      );
      fullArchiveNodeStart =
        parseFloat(fullArchiveNodeStart) >= 0 ? "Yes" : "No";
    } catch (error) {
      fullArchiveNodeStart = "ERROR!";
      errors.push("fullArchiveNodeStart Error: " + error.message);
      console.log("fullArchiveNodeStart", error);
    }

    rpc.status = {
      latestBlockNumber,
      fullArchiveNode,
      fullArchiveNodeStart,
      errors,
      multicall: "...",
      nodeLimit: "...",
      loading: false,
    };
  }
  return providers;
};

const checkMulticallForAll = async (selectedNetwork, providers) => {
  for (const rpc of selectedNetwork.rpcStatus) {
    if (selectedNetwork.chainId !== state.selectedNetwork.chainId) continue;

    const rpcID = JSON.stringify(rpc.url);
    const provider = providers[rpcID]?.provider;

    if (provider) {
      // Multicall
      try {
        const addresses = [selectedNetwork.multicall];
        let multicallAvgTime = 0;
        // Calculate avg. time for three multicalls
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const _a of [1, 2, 3]) {
          const multicallStart = performance.now();
          await multicall(
            state.networks[selectedNetwork.key],
            provider,
            abi,
            addresses.map((address) => [
              selectedNetwork.multicall,
              "getEthBalance",
              [address],
            ]),
            {
              blockTag: "latest",
            }
          );
          const multicallEnd = performance.now();
          multicallAvgTime += multicallEnd - multicallStart;
        }
        rpc.status.multicall = (multicallAvgTime / 3).toFixed(2) + " ms";
      } catch (error) {
        rpc.status.multicall = "ERROR!";
        rpc.status.nodeLimit = "ERROR!";
        rpc.status.errors.push("multicall Error: " + error.message);
        console.log("multicall", error);
      }
    } else {
      rpc.status.multicall = "ERROR!";
      rpc.status.nodeLimit = "ERROR!";
    }
  }
};

const checkNodeLimitForAll = async (selectedNetwork, providers) => {
  // Un comment this to run all node limit at once
  // selectedNetwork.rpcStatus.forEach(async (rpc) => {
  for (const rpc of selectedNetwork.rpcStatus) {
    if (selectedNetwork.chainId !== state.selectedNetwork.chainId) continue;

    const rpcID = JSON.stringify(rpc.url);
    const provider = providers[rpcID]?.provider;

    // Check node limit
    if (
      rpc.status.multicall !== "ERROR!" &&
      rpc.status.nodeLimit !== "ERROR!"
    ) {
      let upperLimit = 10000;
      let lowerLimit = 0;
      let nodeLimit = 0;
      // eslint-disable-next-line no-constant-condition
      while (true) {
        if (selectedNetwork.chainId !== state.selectedNetwork.chainId) break;
        const checkWith = Math.ceil((upperLimit + lowerLimit) / 2);
        console.log(rpc, upperLimit, lowerLimit, checkWith);
        rpc.status.nodeLimit = "checking with " + checkWith + " addresses";
        try {
          const response = await multicall(
            state.networks[selectedNetwork.key],
            provider,
            abi,
            exampleAddresses
              .slice(0, checkWith)
              .map((address) => [
                selectedNetwork.multicall,
                "getEthBalance",
                [address],
              ]),
            {
              blockTag: "latest",
            }
          );
          if (response.length === checkWith) {
            if (response.length === 10000 || upperLimit - lowerLimit <= 100) {
              nodeLimit = response.length;
              break;
            }
            lowerLimit = checkWith;
          } else {
            nodeLimit = response.length;
            break;
          }
        } catch (error) {
          console.log(error);
          upperLimit = checkWith;
        }
      }
      rpc.status.nodeLimit = "~" + nodeLimit;
    }
  }
};

function changeNetworksObject() {
  try {
    if (state.editNetworkType === "full") {
      state.networks = JSON.parse(state.newNetworkObject);
      selectNetwork(state.selectedNetwork.key);
    } else {
      state.networks[state.selectedNetwork.key] = JSON.parse(
        state.newNetworkObject
      );
      selectNetwork(state.selectedNetwork.key);
    }
  } catch (error) {
    console.log(error.message);
    state.error = error.message;
  }
}

async function selectNetwork(networkKey) {
  state.selectedNetwork = null;
  state.error = false;
  state.editNetwork = false;
  state.newNetworkObject = "";
  state.selectedNetwork = JSON.parse(
    JSON.stringify(state.networks[networkKey])
  );
  const selectedNetwork = state.selectedNetwork;
  selectedNetwork.rpcStatus = [];
  selectedNetwork.rpcStatus.push(
    ...selectedNetwork.rpc.map((rpc, index) => ({
      url: rpc,
      index,
      status: {
        loading: true,
      },
    }))
  );
  let providers = {};

  // Check block and archive node
  providers = await checkBlockAndArchiveNode(selectedNetwork);

  // Multicall
  await checkMulticallForAll(selectedNetwork, providers);

  // Check node limit
  await checkNodeLimitForAll(selectedNetwork, providers);
}

export function useApp() {
  async function init() {
    await getData();
    state.loading = false;
  }

  async function getData() {
    const networksObj: any = await fetch(
      "https://raw.githubusercontent.com/snapshot-labs/snapshot.js/master/src/networks.json"
    ).then((res) => res.json());

    Object.keys(networksObj).forEach((key) => {
      if (!networksObj[key])
        networksObj[key] = {
          key,
          name: key,
          shortName: key,
          chainId: Number(key),
          network: key,
          multicall: "",
          rpc: [],
          explorer: {
            url: "",
          },
          start: 0,
          logo: "",
        };
    });
    state.networks = networksObj;
  }

  return {
    init,
    selectNetwork,
    editNetworkButtonClick,
    editNetworksJSONButtonClick,
    changeNetworksObject,
    app: computed(() => state),
  };
}
