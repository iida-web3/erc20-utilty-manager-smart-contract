import { contracts } from "../../typechain-types";
import { ethers } from "hardhat";
import { env } from "../lib/config";

// solidity emitで保存されたEventsは最大10000しか取得できない
async function main() {
  const manager: contracts.ERC20UtilityManager = await ethers.getContractAt(
    "ERC20UtilityManager",
    env.PROXY_CONTRACT_ADDRESS
  );

  let events = await manager.queryFilter(
    manager.filters.BulkWithdrewForEach(),
    33942500, // https://mumbai.polygonscan.com/block/33942500
    33943000 // https://mumbai.polygonscan.com/block/33943000
  );

  console.log(events.length)


  events = await manager.queryFilter(
    manager.filters.BulkWithdrewForEach(),
    33943000, // https://mumbai.polygonscan.com/block/33943000
    33943500 // https://mumbai.polygonscan.com/block/33943500
  );

  console.log(events.length)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
