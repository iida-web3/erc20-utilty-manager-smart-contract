import { ethers } from "hardhat";
import { env } from "../lib/config";
import { contracts } from "../../typechain-types";
import { getEstimate, getFeeData, getSigners } from "../lib/web3Utility";
import { providers } from "ethers";
import { generateBulkWithdraw } from "./generateBulkWithdraw";

import { walletAddresses } from "../lib/bulkWithdrawData/walletAddresses";
import { amounts } from "../lib/bulkWithdrawData/amounts";

async function makeData() {
  console.log("makeData()");
  const data = await generateBulkWithdraw(walletAddresses, amounts);

  return new Array(13)
    .fill(data)
    .concat(
      await generateBulkWithdraw(
        walletAddresses.slice(0, 250),
        amounts.slice(0, 250)
      )
    );
}

async function multicall(data: string[]) {
  const [deployer] = await getSigners();
  const manager: contracts.ERC20UtilityManager = await ethers.getContractAt(
    "ERC20UtilityManager",
    env.PROXY_CONTRACT_ADDRESS
  );

  try {
    const dataRow: string = await manager.interface.encodeFunctionData(
      "multicall",
      [data]
    );

    const nonce: number = await deployer.getTransactionCount();

    const estimateGas: number = await getEstimate(
      nonce,
      await deployer.getAddress(),
      manager.address,
      dataRow
    );

    const feeData: providers.FeeData = await getFeeData();

    console.log(estimateGas);

    const tx: providers.TransactionResponse = await deployer.sendTransaction({
      from: await deployer.getAddress(),
      to: manager.address,
      gasLimit: estimateGas,
      nonce: nonce,
      data: dataRow,
      // maxPriorityFeePerGas: feeData.maxPriorityFeePerGas || 0,
      // maxFeePerGas: feeData.maxFeePerGas || 0,
    });

    console.log(tx);
    await tx.wait();
  } catch (error) {
    console.error(error);
  }
}

async function runMain() {
  let arraycount = 13;
  for (let index = 0; index < 3; index++) {
    const data = await generateBulkWithdraw(walletAddresses, amounts);
    const arrayData = new Array(arraycount).fill(data);
    console.log(walletAddresses.length * arraycount);

    await multicall(arrayData);
    arraycount = 10;
  }
}

runMain()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
