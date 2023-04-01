import { BigNumber, providers, Wallet, utils } from "ethers";
import { ethers } from "hardhat";
import { env } from "../lib/config";
import { contracts } from "../../typechain-types";

async function main() {
  const manager: contracts.ERC20UtilityManager = await ethers.getContractAt(
    "ERC20UtilityManager",
    env.PROXY_CONTRACT_ADDRESS
  );

  const result = await manager.BULK_ROLE();
  console.log(result);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
