import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import("@nomiclabs/hardhat-ethers");
import "solidity-docgen";
import "@openzeppelin/hardhat-upgrades";
import { env } from "./scripts/lib/config";
const privateKey = [
  env.PRIVATE_KEY,
  env.USER1_PRIVATE_KEY,
  env.USER2_PRIVATE_KEY,
  env.USER3_PRIVATE_KEY,
  env.USER4_PRIVATE_KEY,
];

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    local: {
      chainId: 31337,
      url: env.NODE_URL,
    },
    mumbai: {
      url: env.NODE_URL,
      accounts: privateKey,
    },
    goerli: {
      url: env.NODE_URL,
      accounts: privateKey,
    },
    sepolia: {
      url: env.NODE_URL,
      accounts: privateKey,
    },
    polygon: {
      url: env.NODE_URL,
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
