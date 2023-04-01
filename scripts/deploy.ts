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
  if (env.IS_MAINNET === "false") {
    const MockERC20: TestToken__factory = await ethers.getContractFactory(
      "TestToken"
    );
    const mockERC20: TestToken = await MockERC20.connect(deployer).deploy();
    const testTokenTx: TestToken = await mockERC20.deployed();

    console.log(
      `
        testTokenTx ${JSON.stringify(testTokenTx)}
        mockERC20 ${mockERC20.address}
        `
    );
  }

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

  const erc20UtilityManagerProxy: ERC20UtilityManagerProxy__factory =
    await ethers.getContractFactory("ERC20UtilityManagerProxy");
  const deployProxy: ERC20UtilityManagerProxy = await erc20UtilityManagerProxy
    .connect(deployer)
    .deploy(deployERC20UtilityManager.address, []);
  const proxyTx: ERC20UtilityManagerProxy = await deployProxy.deployed();

  console.log(`deployProxy deployed to ${deployProxy.address}`);
  console.log(
    `
        proxyTx ${JSON.stringify(proxyTx)}

      `
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
