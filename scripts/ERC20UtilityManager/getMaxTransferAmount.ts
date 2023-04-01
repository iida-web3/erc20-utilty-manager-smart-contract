import { ethers } from "hardhat";
import { env } from "../lib/config";
import { contracts } from "../../typechain-types";
import { BigNumber } from "ethers";

async function main() {
  const manager: contracts.ERC20UtilityManager = await ethers.getContractAt(
    "ERC20UtilityManager",
    env.PROXY_CONTRACT_ADDRESS
  );

  const result: BigNumber = await manager.maxTransferAmount();
  console.log(result);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
