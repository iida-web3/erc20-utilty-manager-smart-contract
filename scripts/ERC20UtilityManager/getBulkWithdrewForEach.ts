import {
  BulkWithdrewEventsResponse,
  HTTPSProvider,
  getBulkWithdrewEvents,
} from "../lib/web3Utility";
import { TransactionReceipt } from "@ethersproject/abstract-provider";
import * as fs from "fs";
import {
  ResultBool,
  bulkWithdrawData,
} from "../lib/bulkWithdrawData/bulkWithdrawData";
import { BigNumber } from "ethers";

async function main(fromTransactionHash: string, toTransactionHash: string) {
  const formTransactionReceipt: TransactionReceipt =
    await HTTPSProvider.getTransactionReceipt(fromTransactionHash);
  const fromBlock: number = formTransactionReceipt.blockNumber;

  console.log("fromBlock: ", fromBlock);

  const toTransactionReceipt: TransactionReceipt =
    await HTTPSProvider.getTransactionReceipt(toTransactionHash);
  const toBlock: number = toTransactionReceipt.blockNumber;

  console.log("toBlock: ", toBlock);

  const result: BulkWithdrewEventsResponse = await getBulkWithdrewEvents(
    fromBlock,
    toBlock
  );

  if (result && result.events) {
    const csvData = result.events.map((row) => row.join(",")).join("\n");

    console.log("start CSV writeFileSync ...");
    const date = new Date();
    fs.writeFileSync(
      `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}.csv`,
      csvData
    );
    console.log("... end CSV writeFileSync");

    const bulkWithdrawDataByCsv: [string[], BigNumber[]] =
      await bulkWithdrawData();
    let resultBoolArray: ResultBool[] = [];

    for (let index = 0; index < result.events.length; index++) {
      const isExist = bulkWithdrawDataByCsv[0].includes(
        result.events[index][0].toLowerCase()
      );
      const resultBool: ResultBool = {
        result: isExist,
        address: isExist ? undefined : result.events[index][0].toLowerCase(),
      };
      resultBoolArray.push(resultBool);
    }

    console.log(result.events.length);
    console.log(`Onchainデータ件数${result.events.length}`);
    console.log(`送金時参照CSVデータ件数${bulkWithdrawDataByCsv[0].length}`);
    console.log(
      `データ照合成功件数${
        resultBoolArray.filter((obj) => obj.result === true).length
      }`
    );
    console.log(
      `データ照合失敗件数${
        resultBoolArray.filter((obj) => obj.result === false).length
      }`
    );
    const addresses = resultBoolArray
      .map((obj) => obj.address)
      .filter((address) => address !== undefined);
    console.log(`失敗アドレス一覧${addresses ? addresses : "失敗なし"}`);
  }
}

const fromTransactionHash: string =
  "0x60af307a2dba950209ff068cec31547969871ee78a6b3f0dab569d4adb7f76cb";
const toTransactionHash: string =
  "0xf9b1fb7a7d33323176743329797d909c7c1b2a991e3ab98487cdddd6562b503b";

main(fromTransactionHash, toTransactionHash)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
