require("dotenv").config();
import * as fs from "fs";

function fileExists(filePath: string): boolean {
  try {
    return fs.existsSync(filePath);
  } catch (err) {
    return false;
  }
}
const {
  INFURA,
  PRIVATE_KEY,
  NODE_URL,
  DEPLOYER_ADDRESS,
  TESTTOKEN_CONTRACT_ADDRESS,
  PROXY_CONTRACT_ADDRESS,
  ERC20UTILITYMANAGER_CONTRACT_ADDRESS,
  USER1_ADDRESS,
  USER1_PRIVATE_KEY,
  USER2_ADDRESS,
  USER2_PRIVATE_KEY,
  USER3_ADDRESS,
  USER3_PRIVATE_KEY,
  USER4_ADDRESS,
  USER4_PRIVATE_KEY,
  USER5_ADDRESS,
  USER5_PRIVATE_KEY,
  ETHERSCAN_API_KEY,
  IS_MAINNET,
  FIREBLOCKS_APIKEY,
  VAULT_ACCOUNTIDS,
  USE_FIREBLOCKS,
  CHAIN_ID,
  DECIMALS,
  MAX_BULK_SEND_COUNT,
  EVENT_FIRST_BLOCK,
} = process.env;

const addressZero = "0x0000000000000000000000000000000000000000";
const privateKeyZero =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

export const env = {
  INFURA: INFURA || "",
  NODE_URL: NODE_URL || "",
  PRIVATE_KEY: PRIVATE_KEY || privateKeyZero,
  DEPLOYER_ADDRESS: DEPLOYER_ADDRESS || addressZero,
  TESTTOKEN_CONTRACT_ADDRESS: TESTTOKEN_CONTRACT_ADDRESS || addressZero,
  ERC20UTILITYMANAGER_CONTRACT_ADDRESS:
    ERC20UTILITYMANAGER_CONTRACT_ADDRESS || addressZero,
  PROXY_CONTRACT_ADDRESS: PROXY_CONTRACT_ADDRESS || addressZero,
  USER1_ADDRESS: USER1_ADDRESS || addressZero,
  USER1_PRIVATE_KEY: USER1_PRIVATE_KEY || privateKeyZero,
  USER2_ADDRESS: USER2_ADDRESS || addressZero,
  USER2_PRIVATE_KEY: USER2_PRIVATE_KEY || privateKeyZero,
  USER3_ADDRESS: USER3_ADDRESS || addressZero,
  USER3_PRIVATE_KEY: USER3_PRIVATE_KEY || privateKeyZero,
  USER4_ADDRESS: USER4_ADDRESS || addressZero,
  USER4_PRIVATE_KEY: USER4_PRIVATE_KEY || privateKeyZero,
  ETHERSCAN_API_KEY: ETHERSCAN_API_KEY || "",
  TESTTOKEN_CONTRACT_ABI: fileExists(
    "../../artifacts/contracts/TestToken.sol/TestToken.json"
  )
    ? require("../../artifacts/contracts/TestToken.sol/TestToken.json").abi
    : "",
  ERC20UTILITYMANAGER_CONTRACT_ABI: fileExists(
    "../../artifacts/contracts/ERC20UtilityManager.sol/ERC20UtilityManager.json"
  )
    ? require("../../artifacts/contracts/ERC20UtilityManager.sol/ERC20UtilityManager.json")
        .abi
    : "",
  PROXY_CONTRACT_ABI: fileExists(
    "../../artifacts/contracts/Proxy.sol/ERC20UtilityManagerProxy.json"
  )
    ? require("../../artifacts/contracts/Proxy.sol/ERC20UtilityManagerProxy.json")
        .abi
    : "",
  DECIMALS: Number(DECIMALS) || 18,
  IS_MAINNET: IS_MAINNET || "false",
  FIREBLOCKS_APIKEY: FIREBLOCKS_APIKEY || "",
  VAULT_ACCOUNTIDS: VAULT_ACCOUNTIDS || "",
  CHAIN_ID: Number(CHAIN_ID) || 0,
  USE_FIREBLOCKS: USE_FIREBLOCKS || "false",
  MAX_BULK_SEND_COUNT: Number(MAX_BULK_SEND_COUNT) || 250,
  EVENT_FIRST_BLOCK: Number(EVENT_FIRST_BLOCK) || 0,
};
