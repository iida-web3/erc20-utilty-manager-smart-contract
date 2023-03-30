import { ethers } from "hardhat";
import { env } from "./lib/config";
import { contracts } from "../typechain-types";
import { getEstimate, getFeeData } from "./lib/web3Utility";
import { providers } from "ethers";

async function main() {
  const [deployer, user] = await ethers.getSigners();
  const manager: contracts.ERC20UtilityManager = await ethers.getContractAt("ERC20UtilityManager", env.PROXY_CONTRACT_ADDRESS);
  const bulkRole = await manager.BULK_ROLE();

  const dataRow: string = await manager.interface.encodeFunctionData(
    "setupRole",
    [bulkRole, await user.getAddress()]
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

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
