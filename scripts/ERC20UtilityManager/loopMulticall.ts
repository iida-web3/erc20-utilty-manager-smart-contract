import { ethers } from "hardhat";
import { env } from "../lib/config";
import { contracts } from "../../typechain-types";
import {
  generateBulkWithdraw,
  getEstimate,
  getFeeData,
  getSigners,
} from "../lib/web3Utility";
import { BigNumber, providers } from "ethers";
import { bulkWithdrawData } from "../lib/bulkWithdrawData/bulkWithdrawData";

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
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas || 0,
      maxFeePerGas: feeData.maxFeePerGas || 0,
    });

    console.log(tx);
    await tx.wait();
  } catch (error) {
    console.error(error);
  }
}

async function runMain(addresses: string[], amounts: BigNumber[]) {
  let arraycount = 3;
  let multicallForCount =
    addresses.length / env.MAX_BULK_SEND_COUNT / arraycount;
  let dumpAddress = addresses;
  let dumpAmounts = amounts;

  for (let i = 0; i < multicallForCount; i++) {
    // make multicallData
    const multicallData: string[] = new Array();
    for (let i = 0; i < arraycount; i++) {
      const inAddress = dumpAddress.slice(0, env.MAX_BULK_SEND_COUNT);
      const inAmounts = dumpAmounts.slice(0, env.MAX_BULK_SEND_COUNT);

      const data: string = await generateBulkWithdraw(inAddress, inAmounts);

      if (dumpAddress.length >= env.MAX_BULK_SEND_COUNT) {
        dumpAddress = dumpAddress.slice(env.MAX_BULK_SEND_COUNT);
        dumpAmounts = dumpAmounts.slice(env.MAX_BULK_SEND_COUNT);
      }

      multicallData.push(data);
    }

    console.log("送金人数", arraycount * env.MAX_BULK_SEND_COUNT);
    console.log("残り送金人数", dumpAddress.length);
    await multicall(multicallData);
  }
}

const [addresses, amounts] = bulkWithdrawData();

runMain(addresses, amounts)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
