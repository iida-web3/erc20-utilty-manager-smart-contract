import { contracts } from "../../typechain-types";
import { ethers } from "hardhat";
import { env } from "../lib/config";

async function main() {
  const manager: contracts.ERC20UtilityManager = await ethers.getContractAt(
    "ERC20UtilityManager",
    env.PROXY_CONTRACT_ADDRESS
  );

  const fromBlock = 33942600;
  const toBlock = 33943000;

  const events = await manager.queryFilter(
    manager.filters.BulkWithdrewForEach(),
    fromBlock,
    toBlock
  );

  console.log(events.length)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
