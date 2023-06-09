import { BigNumber, providers } from "ethers";
import { ethers } from "hardhat";
import { env } from "../lib/config";
import { contracts } from "../../typechain-types";
import {
  getEstimate,
  getFeeData,
  getSigners,
  parseUseErc20,
} from "../lib/web3Utility";

async function main() {
  const [deployer] = await getSigners();
  const erc20: contracts.TestToken = await ethers.getContractAt(
    "TestToken",
    env.TESTTOKEN_CONTRACT_ADDRESS
  );
  const amount: BigNumber = parseUseErc20("1000");

  const dataRow: string = await erc20.interface.encodeFunctionData("transfer", [
    env.PROXY_CONTRACT_ADDRESS,
    amount,
  ]);

  const nonce: number = await deployer.getTransactionCount();

  const estimateGas: number = await getEstimate(
    nonce,
    await deployer.getAddress(),
    erc20.address,
    dataRow
  );

  const feeData: providers.FeeData = await getFeeData();
  const tx: providers.TransactionResponse = await deployer.sendTransaction({
    from: await deployer.getAddress(),
    to: erc20.address,
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
