import { contracts } from "../../typechain-types";
import { ethers } from "hardhat";
import { env } from "../lib/config";
import { BigNumber, providers, Wallet, utils } from "ethers";
import { HTTPSProvider } from "../lib/web3Utility";

async function main() {
  const abiFilter = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"address","name":"token","type":"address"}],"name":"BulkWithdrewForEach","type":"event"}]

  const manager: contracts.ERC20UtilityManager = await ethers.getContractAt(
    "ERC20UtilityManager",
    env.PROXY_CONTRACT_ADDRESS
  );

  const filter = {
    address: manager.address,
    topics: [utils.id("BulkWithdrewForEach(address,uint256,address)")],
    fromBlock: 0
  };

  const iface = await new utils.Interface(abiFilter);
  const rowLogs = await HTTPSProvider.getLogs(filter);
  console.log("rowLogs = ", rowLogs);

  const parsedLog = await iface.parseLog(rowLogs[0]);

  const event = {
    sender: parsedLog.args.sender.toString(),
    amount: parsedLog.args.amount.toString(),
    token: parsedLog.args.token.toString(),
  };

  console.log("event = ", event);

  // const fromBlock = 33942600;
  // const toBlock = 33943000;

  // const events = await manager.queryFilter(
  //   manager.filters.BulkWithdrewForEach(),
  //   fromBlock,
  //   toBlock
  // );

  // console.log(events.length)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
