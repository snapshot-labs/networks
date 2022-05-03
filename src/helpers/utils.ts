import { Contract } from "@ethersproject/contracts";
import { Interface } from "@ethersproject/abi";

export async function multicall(
  network,
  provider,
  abi: any[],
  calls: any[],
  options?
) {
  const multicallAbi = [
    "function aggregate(tuple(address target, bytes callData)[] calls) view returns (uint256 blockNumber, bytes[] returnData)",
  ];
  const multi = new Contract(network.multicall, multicallAbi, provider);
  const itf = new Interface(abi);
  try {
    const [, res] = await multi.aggregate(
      calls.map((call) => [
        call[0].toLowerCase(),
        itf.encodeFunctionData(call[1], call[2]),
      ]),
      options || {}
    );
    return res.map((call, i) => itf.decodeFunctionResult(calls[i][1], call));
  } catch (e) {
    return Promise.reject(e);
  }
}
