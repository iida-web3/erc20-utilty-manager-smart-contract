import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import("@nomiclabs/hardhat-ethers");
import "solidity-docgen";
import "@openzeppelin/hardhat-upgrades";
import { env } from "./scripts/lib/config";

const infuraApiKey = env.INFURA;
const privateKey = [env.PRIVATE_KEY, env.USER1_PRIVATE_KEY,env.USER2_PRIVATE_KEY,env.USER3_PRIVATE_KEY,env.USER4_PRIVATE_KEY];

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    local: {
      chainId: 31337,
      url: "http://127.0.0.1:8545/",
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${infuraApiKey}`,
      accounts: privateKey,
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${infuraApiKey}`,
      accounts: privateKey,
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${infuraApiKey}`,
      accounts: privateKey,
    },
    polygon: {
      url: "https://polygon-mainnet.infura.io/v3/647c7f609ecd46b58a534261c8f3e46b",
      accounts: privateKey,
    },
  },
  docgen: {
    outputDir: "./docs",
    pages: "files",
  },
  solidity: "0.8.19",
};

export default config;
