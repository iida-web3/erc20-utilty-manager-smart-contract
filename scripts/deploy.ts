import { ethers } from "hardhat";
import { env } from "./lib/config";

async function main() {
  if (env.IS_MAINNET === "false") {
    const TestToken = await ethers.getContractFactory("TestToken");
    const testToken = await TestToken.deploy();
    const testTokenTx = await testToken.deployed();

    console.log(
        `
        testTokenTx ${JSON.stringify(testTokenTx)}
        TestToken ${testToken.address}
        `
    );
  }

  const ERC20UtilityManager = await ethers.getContractFactory("ERC20UtilityManager");
  const erc20UtilityManager = await ERC20UtilityManager.deploy();
  const erc20UtilityManagerTx = await erc20UtilityManager.deployed();

  console.log(
      `
      erc20UtilityManagerTx ${JSON.stringify(erc20UtilityManagerTx)}
      ERC20UtilityManager deployed to ${erc20UtilityManager.address}
      `
  );

  const ERC20UtilityManagerProxy = await ethers.getContractFactory("ERC20UtilityManagerProxy");
  const proxy = await ERC20UtilityManagerProxy.deploy(
    erc20UtilityManager.address,
    []
  );
  const proxyTx = await proxy.deployed();

  console.log(
      `
        proxyTx ${JSON.stringify(proxyTx)}
        proxy deployed to ${proxy.address}
      `
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
