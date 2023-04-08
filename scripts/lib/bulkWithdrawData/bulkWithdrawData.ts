import * as fs from "fs";
import { BigNumber } from "ethers";
import { parseUseErc20 } from "../web3Utility";

export function bulkWithdrawData(): [string[], BigNumber[]] {
  const addresses: string[] = new Array();
  const amounts: BigNumber[] = new Array();
  const data = fs.readFileSync("data/20230403/bulkWithdrawData.csv", "utf8");

  const lines = data.trim().split("\n");
  for (const line of lines) {
    const [address, amount] = line.split(",");
    addresses.push(address);
    amounts.push(parseUseErc20(amount.trim()));
  }

  return [addresses, amounts];
}

export function bulkWithdrawDataFormatDefult(): any[] {
  const data = fs.readFileSync("data/20230403/bulkWithdrawData.csv", "utf8");

  const lines = data.trim().split("\n");
  let logs = new Array();

  for (const line of lines) {
    const [address, amount] = line.split(",");
    logs.push([address.toLowerCase(), Number(amount.trim())]);
  }

  return logs;
}

export interface ResultBool {
  result: Boolean;
  address?: string;
}
