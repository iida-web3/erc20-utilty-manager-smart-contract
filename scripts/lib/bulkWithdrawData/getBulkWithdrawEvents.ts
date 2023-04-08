import { contracts } from "../../../typechain-types";
import { ethers } from "hardhat";
import { env } from "../../lib/config";
import { HTTPSProvider } from "../../lib/web3Utility";
import { utils } from "ethers";
import { bulkWithdrawData } from "../../lib/bulkWithdrawData/bulkWithdrawData";

const MAX_GET_EVENTS_AMOUNT: number = env.MAX_BULK_SEND_COUNT;

export async function getBulkWithdrawEvents(
  fromBlock: number,
  toBlock: number
) {
  const manager: contracts.ERC20UtilityManager = await ethers.getContractAt(
    "ERC20UtilityManager",
    env.PROXY_CONTRACT_ADDRESS
  );

  let logs = new Array();

  for (let i = fromBlock; i < toBlock; i = i + MAX_GET_EVENTS_AMOUNT) {
    console.log("fromBlock = ", i);
    console.log("toBlock = ", i + MAX_GET_EVENTS_AMOUNT);

    const filter = {
      address: manager.address,
      topics: [utils.id("BulkWithdrewForEach(address,uint256,address)")],
      fromBlock: i,
      toBlock: i + MAX_GET_EVENTS_AMOUNT,
    };

    const rowLogs = await HTTPSProvider.getLogs(filter);

    for (let n_i = 0; n_i < rowLogs.length; n_i++) {
      const parsedLog = await manager.interface.parseLog(rowLogs[n_i]);
      const walletAddress = parsedLog.args.sender.toString();
      const parseAmount =
        parsedLog.args.amount.toNumber() * 10 ** -env.DECIMALS;

      const result: [string, string] = [walletAddress, String(parseAmount)];
      logs.push(result);
    }
  }

  return logs;
}
