import { ethers } from "hardhat";
import { env } from "../lib/config";
import { contracts } from "../../typechain-types";
import { getEstimate, getFeeData, getSigners } from "../lib/web3Utility";
import { BigNumber, providers } from "ethers";
import { bulkWithdrawData } from "../lib/bulkWithdrawData/bulkWithdrawData";

async function main(addresses: string[], amounts: BigNumber[]) {
  const [deployer] = await getSigners();
  const manager: contracts.ERC20UtilityManager = await ethers.getContractAt(
    "ERC20UtilityManager",
    env.PROXY_CONTRACT_ADDRESS
  );

  const dataRow: string = await manager.interface.encodeFunctionData(
    "bulkWithdraw",
    [env.TESTTOKEN_CONTRACT_ADDRESS, addresses, amounts]
  );

  const nonce: number = await deployer.getTransactionCount();

  const estimateGas: number = await getEstimate(
    nonce,
    await deployer.getAddress(),
    manager.address,
    dataRow
  );

  const feeData: providers.FeeData = await getFeeData();
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
}

const [addresses, amounts] = bulkWithdrawData();

main(
  addresses.slice(0, env.MAX_BULK_SEND_COUNT),
  amounts.slice(0, env.MAX_BULK_SEND_COUNT)
)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
