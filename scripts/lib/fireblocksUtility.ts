import { env } from "./config";
import Web3 from "web3";
import { BigNumber, providers } from "ethers";
const fs = require("fs");
import {
  FireblocksWeb3Provider,
  ChainId,
  Asset,
  ASSETS,
  RawMessageType,
} from "@fireblocks/fireblocks-web3-provider";

export const web3 = new Web3(new Web3.providers.HttpProvider(env.NODE_URL));
export const HTTPSProvider = new providers.JsonRpcProvider(env.NODE_URL);

export async function fireblocksWeb3Provider() {
  return await new FireblocksWeb3Provider({
    privateKey: fs.readFileSync("scripts/lib/private.key", "utf-8"),
    apiKey: env.FIREBLOCKS_APIKEY,
    vaultAccountIds: env.VAULT_ACCOUNTIDS,
    chainId: env.CHAIN_ID,
    note: "ERC20UtilityManager Deploy",
  });
}

export async function fireblocksSigner(): Promise<providers.JsonRpcSigner> {
  const eip1193Provider = await fireblocksWeb3Provider();
  const provider: providers.Web3Provider = await new providers.Web3Provider(
    eip1193Provider
  );
  return await provider.getSigner();
}
