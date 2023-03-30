import { ethers } from "hardhat";
import { env } from "./lib/config";
import { contracts } from "../typechain-types";
import { getEstimate, getFeeData, getSigners } from "./lib/web3Utility";
import { BigNumber, providers, utils } from "ethers";

async function main(to: string[], amount: BigNumber[]) {
  const [deployer, user] = await getSigners();
  const manager: contracts.ERC20UtilityManager = await ethers.getContractAt("ERC20UtilityManager", env.PROXY_CONTRACT_ADDRESS);

  const dataRow: string = await manager.interface.encodeFunctionData(
    "bulkWithdraw",
    [env.TESTTOKEN_CONTRACT_ADDRESS, to, amount]
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

const count = 55
const to: string[] = new Array(count).fill("0x47b43c2f6d87ca769744dbb542ba721908457b89");
const amount: BigNumber[] = new Array(count).fill(utils.parseUnits("0.001", 8));

main(to, amount)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
