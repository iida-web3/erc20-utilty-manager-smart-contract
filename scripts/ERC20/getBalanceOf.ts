import { ethers } from "hardhat";
import { env } from "../lib/config";
import { contracts } from "../../typechain-types";
import { getSigners } from "../lib/web3Utility";
import { BigNumber } from "ethers";

async function main() {
  const [deployer, user1, user2, user3] = await getSigners();
  const erc20: contracts.TestToken = await ethers.getContractAt(
    "TestToken",
    env.TESTTOKEN_CONTRACT_ADDRESS
  );

  let result: BigNumber;
  result = await erc20.balanceOf(await deployer.getAddress());
  console.log(result);

  result = await erc20.balanceOf(await user1.getAddress());
  console.log(result);

  result = await erc20.balanceOf(await user2.getAddress());
  console.log(result);

  result = await erc20.balanceOf(await user3.getAddress());
  console.log(result);

  result = await erc20.balanceOf(await env.PROXY_CONTRACT_ADDRESS);
  console.log(result);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
