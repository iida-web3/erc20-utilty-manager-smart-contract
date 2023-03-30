import { env } from "./config";
import Web3 from "web3";
import { BigNumber, providers} from "ethers";

export const web3 = new Web3(new Web3.providers.HttpProvider(env.NODE_URL));
export const HTTPSProvider = new providers.JsonRpcProvider(env.NODE_URL);

export async function getFeeData(): Promise<providers.FeeData> {
  return await HTTPSProvider.getFeeData();
}

export async function getEstimate(
  nonce: number,
  from: string,
  to: string,
  data: string,
  coefficient: number = 1.05,
  value: string | number | undefined = "0x0",
) {

  const estimateGas = await web3.eth.estimateGas({
    nonce: nonce,
    from: from,
    to: to,
    value: value,
    data: data,
    // chainId: env.CHAIN_ID
  });

  return Math.floor(estimateGas * coefficient);
}
