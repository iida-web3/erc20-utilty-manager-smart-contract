import { ethers } from "hardhat";
import { env } from "../lib/config";
import { contracts } from "../../typechain-types";
import { BigNumber } from "ethers";
import { walletAddresses } from "../lib/bulkWithdrawData/walletAddresses";
import { amounts } from "../lib/bulkWithdrawData/amounts";

export async function generateBulkWithdraw(
  to: string[],
  amount: BigNumber[]
): Promise<string> {
  const manager: contracts.ERC20UtilityManager = await ethers.getContractAt(
    "ERC20UtilityManager",
    env.PROXY_CONTRACT_ADDRESS
  );

  return await manager.interface.encodeFunctionData("bulkWithdraw", [
    env.TESTTOKEN_CONTRACT_ADDRESS,
    to,
    amount,
  ]);
}
