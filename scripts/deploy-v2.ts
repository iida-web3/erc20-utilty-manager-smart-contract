import { ethers } from "hardhat";
import { env } from "./lib/config";
import { getSigners } from "./lib/web3Utility";
import {
  ERC20UtilityManager,
  ERC20UtilityManagerProxy,
  ERC20UtilityManagerProxy__factory,
  ERC20UtilityManager__factory,
  TestToken,
  TestToken__factory,
} from "../typechain-types";

async function main() {
  const [deployer] = await getSigners();

  const erc20UtilityManager: ERC20UtilityManager__factory =
    await ethers.getContractFactory("ERC20UtilityManager");
  const deployERC20UtilityManager: ERC20UtilityManager =
    await erc20UtilityManager.connect(deployer).deploy();
  const erc20UtilityManagerTx: ERC20UtilityManager =
    await deployERC20UtilityManager.deployed();

  console.log(
    `ERC20UtilityManager deployed to ${deployERC20UtilityManager.address}`
  );
  console.log(
    `
      erc20UtilityManagerTx ${JSON.stringify(erc20UtilityManagerTx)}
      `
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
