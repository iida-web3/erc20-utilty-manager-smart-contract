import * as fs from "fs";

export function walletAddresses(): string[] {
  const data = fs.readFileSync(
    "scripts/lib/bulkWithdrawData/addresses.csv",
    "utf8"
  );
  const result = data.trim().split("\n");
  console.log(result);
  return result;
}
