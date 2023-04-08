import { ethers } from "hardhat";
import { env } from "../lib/config";
import { ERC20UtilityManagerProxy } from "../../typechain-types";
import {
  getEstimate,
  getFeeData,
  getSigners,
} from "../lib/web3Utility";
import { providers } from "ethers";

async function main(newAddress: string) {
  const [deployer, user1] = await getSigners();
  const proxy: ERC20UtilityManagerProxy = await ethers.getContractAt(
    "ERC20UtilityManagerProxy",
    env.PROXY_CONTRACT_ADDRESS
  );

  const dataRow: string = await proxy.interface.encodeFunctionData(
    "upgradeImplementation",
    [newAddress]
  );

  const nonce: number = await deployer.getTransactionCount();

  const estimateGas: number = await getEstimate(
    nonce,
    await deployer.getAddress(),
    proxy.address,
    dataRow
  );

  const feeData: providers.FeeData = await getFeeData();
  const tx: providers.TransactionResponse = await deployer.sendTransaction({
    from: await deployer.getAddress(),
    to: proxy.address,
    gasLimit: estimateGas,
    nonce: nonce,
    data: dataRow,
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas || 0,
    maxFeePerGas: feeData.maxFeePerGas || 0,
  });

  console.log(tx);
  await tx.wait();
}

const newAddress: string = "0x520d5F728fB308e4aF007D5Ec6cEbf3e2396E9EA";

main(newAddress)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
