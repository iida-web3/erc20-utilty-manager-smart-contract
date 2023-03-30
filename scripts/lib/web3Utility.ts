import { env } from "./config";
import Web3 from "web3";
import { BigNumber, providers, Signer} from "ethers";
import { ethers } from "hardhat";
import { fireblocksSigner } from "./fireblocksUtility";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

export const web3: Web3 = new Web3(new Web3.providers.HttpProvider(env.NODE_URL));
export const HTTPSProvider: providers.JsonRpcProvider = new providers.JsonRpcProvider(env.NODE_URL);

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
): Promise<number> {

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

export async function getSigners(): Promise<Signer[]>{
  const [deployer, user1, user2, user3] = await ethers.getSigners();

  if (env.USE_FIREBLOCKS === "true") {
    const signer: Signer = await fireblocksSigner();
    console.log("[signer, user1, user2, user3]", [await signer.getAddress(), await user1.getAddress(), await user2.getAddress(), await user3.getAddress()])
    return [signer, user1, user2, user3];
  }

  console.log("[deployer, user1, user2, user3]", [await deployer.getAddress(), await user1.getAddress(), await user2.getAddress(), await user3.getAddress()])
  return [deployer, user1, user2, user3];
}
