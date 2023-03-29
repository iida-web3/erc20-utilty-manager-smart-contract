import { BigNumber, providers, Wallet, utils } from "ethers";
import { ethers } from "hardhat";
import { env } from "./lib/config";
import { contracts } from "../typechain-types";

async function main() {
  const [deployer, user] = await ethers.getSigners();
  const HTTPSProvider = new providers.JsonRpcProvider(env.NODE_URL);
  const manager: contracts.ERC20UtiltyManager = await ethers.getContractAt("ERC20UtiltyManager", env.PROXY_CONTRACT_ADDRESS);
  const amount: BigNumber = utils.parseUnits("100", "ether");

  const dataRow: string = await manager.interface.encodeFunctionData(
    "initialize",
    [await user.getAddress(), amount]
  );

  const feeData: providers.FeeData = await HTTPSProvider.getFeeData();
  const nonce: number = await deployer.getTransactionCount();

  const tx = await deployer.sendTransaction({
    from: await deployer.getAddress(),
    to: manager.address,
    gasLimit: 230000,
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
