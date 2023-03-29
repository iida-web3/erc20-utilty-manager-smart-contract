import { ethers } from "hardhat";
import { env } from "./lib/config";

async function main() {
  if (env.IS_MAINNET === "false") {
    const TestToken = await ethers.getContractFactory("TestToken");
    const testToken = await TestToken.deploy();
    await testToken.deployed();

    console.log(
        `TestToken ${testToken.address}`
    );
  }

  const ERC20UtiltyManager = await ethers.getContractFactory("ERC20UtiltyManager");
  const erc20UtiltyManager = await ERC20UtiltyManager.deploy();
  await erc20UtiltyManager.deployed();

  console.log(
    `ERC20UtiltyManager deployed to ${erc20UtiltyManager.address}`
  );

  const ERC20UtiltyManagerProxy = await ethers.getContractFactory("ERC20UtiltyManagerProxy");
  const proxy = await ERC20UtiltyManagerProxy.deploy(
    erc20UtiltyManager.address,
    []
  );
  await proxy.deployed();

  console.log("proxy contract deployed to: ", proxy.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
