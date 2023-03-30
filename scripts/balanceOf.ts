import { ethers } from "hardhat";
import { env } from "./lib/config";
import { contracts } from "../typechain-types";
import { getSigners } from "./lib/web3Utility";

async function main() {
  const [deployer] = await getSigners();
  const erc20: contracts.TestToken = await ethers.getContractAt("TestToken", env.TESTTOKEN_CONTRACT_ADDRESS);

  const result = await erc20.balanceOf(await deployer.getAddress());
  console.log(result);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
