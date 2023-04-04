import * as fs from "fs";
import { BigNumber } from "ethers";
import { parseUseErc20 } from "../web3Utility";

export function bulkWithdrawData(): [string[], BigNumber[]] {
  const addresses: string[] = new Array();
  const amounts: BigNumber[] = new Array();
  const data = fs.readFileSync(
    "scripts/lib/bulkWithdrawData/bulkWithdrawData.csv",
    "utf8"
  );

  const lines = data.trim().split("\n");
  for (const line of lines) {
    const [address, amount] = line.split(",");
    addresses.push(address);
    amounts.push(parseUseErc20(amount.trim()));
  }

  return [addresses, amounts];
}
