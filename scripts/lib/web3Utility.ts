import { env } from "./config";
import Web3 from "web3";
import { BigNumber, providers, Signer, utils, version } from "ethers";
import { ethers } from "hardhat";
import { fireblocksSigner } from "./fireblocksUtility";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Logger } from "@ethersproject/logger";
const logger = new Logger(version);
import { parseFixed } from "@ethersproject/bignumber";
import { contracts } from "../../typechain-types";
const MAX_GET_EVENTS_AMOUNT: number = env.MAX_BULK_SEND_COUNT;

export const web3: Web3 = new Web3(
  new Web3.providers.HttpProvider(env.NODE_URL)
);
export const HTTPSProvider: providers.JsonRpcProvider =
  new providers.JsonRpcProvider(env.NODE_URL);

export async function getFeeData(): Promise<providers.FeeData> {
  return await HTTPSProvider.getFeeData();
}

export function parseUseErc20(value: string): BigNumber {
  if (typeof value !== "string") {
    logger.throwArgumentError("value must be a string", "value", value);
  }
  return parseFixed(value, env.DECIMALS);
}

export async function getEstimate(
  nonce: number,
  from: string,
  to: string,
  data: string,
  coefficient: number = 1.05,
  value: string | number | undefined = "0x0"
): Promise<number> {
  const estimateGas = await web3.eth.estimateGas({
    nonce: nonce,
    from: from,
    to: to,
    value: value,
    data: data,
    // chainId: env.CHAIN_ID,
  });

  return Math.floor(estimateGas * coefficient);
}

export async function getSigners(): Promise<Signer[]> {
  let [deployer, user1, user2, user3] = await ethers.getSigners();

  if (env.USE_FIREBLOCKS === "true") {
    const signer: Signer = await fireblocksSigner();
    console.log("[signer, user1, user2, user3]", [
      await signer.getAddress(),
      await user1.getAddress(),
      await user2.getAddress(),
      await user3.getAddress(),
    ]);

    deployer = signer as SignerWithAddress;
    return [deployer, user1, user2, user3];
  }

  console.log("[deployer, user1, user2, user3]", [
    await deployer.getAddress(),
    await user1.getAddress(),
    await user2.getAddress(),
    await user3.getAddress(),
  ]);
  return [deployer, user1, user2, user3];
}

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

export async function getLatestBlockNumber(): Promise<number> {
  const blockNumber = await HTTPSProvider.getBlockNumber();
  return blockNumber;
}

export async function getERC20UtilityManagerInitializedBlockNumber(
  contractAddress: string
): Promise<number> {
  const manager: contracts.ERC20UtilityManager = await ethers.getContractAt(
    "ERC20UtilityManager",
    env.PROXY_CONTRACT_ADDRESS
  );

  const filter = {
    address: contractAddress,
    fromBlock: env.EVENT_FIRST_BLOCK,
    topics: [utils.id("Initialized(uint8)")],
  };

  const logs = await HTTPSProvider.getLogs(filter);
  const blockNumber: number[] = logs.map((log) => log.blockNumber);

  return blockNumber[0];
}

export async function getTokenInfo(tokenAddress: string): Promise<TokenInfo> {
  const erc20: contracts.TestToken = await ethers.getContractAt(
    "TestToken",
    tokenAddress
  );

  const name: string = await erc20.name();
  const symbol: string = await erc20.symbol();
  const totalSupply: BigNumber = await erc20.totalSupply();

  return {
    address: tokenAddress,
    name: name,
    symbol: symbol,
    totalSupply: totalSupply,
  };
}

export async function getBulkWithdrewEvents(
  fromBlock: number,
  toBlock: number
): Promise<BulkWithdrewEventsResponse> {
  const manager: contracts.ERC20UtilityManager = await ethers.getContractAt(
    "ERC20UtilityManager",
    env.PROXY_CONTRACT_ADDRESS
  );

  let events: any[] = new Array();
  let tokenInfo: TokenInfo | undefined;

  for (let i = fromBlock; i < toBlock; i = i + MAX_GET_EVENTS_AMOUNT) {
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

      const result: [string, number] = [walletAddress, parseAmount];
      events.push(result);

      // check token
      if (!tokenInfo?.name) {
        const tokenAddress = parsedLog.args.token.toString();
        tokenInfo = await getTokenInfo(tokenAddress);
      }
    }
  }

  return {
    events: events,
    tokenInfo: tokenInfo,
  };
}

export interface TokenInfo {
  address: string;
  name: string;
  symbol: string;
  totalSupply: BigNumber;
}

export interface BulkWithdrewEventsResponse {
  events: any[];
  tokenInfo?: TokenInfo;
}
