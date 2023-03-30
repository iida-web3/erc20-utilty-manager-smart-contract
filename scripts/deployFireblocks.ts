import { ethers } from "hardhat";
import { env } from "./lib/config";
import { fireblocksWeb3Provider } from "./lib/fireblocksUtility";
import { BigNumber, providers} from "ethers";

async function main() {
  const eip1193Provider = await fireblocksWeb3Provider();

  const provider: providers.Web3Provider = await new providers.Web3Provider(eip1193Provider);
  const signer = await provider.getSigner();

  const deployerAddress = await signer.getAddress();
  console.log("deployerAddress = ", deployerAddress);

  const ERC20UtilityManager = await ethers.getContractFactory("ERC20UtilityManager");
  const erc20UtilityManager = await ERC20UtilityManager.connect(signer).deploy();
  const erc20UtilityManagerTx = await erc20UtilityManager.deployed();

  console.log(
      `
      erc20UtilityManagerTx ${JSON.stringify(erc20UtilityManagerTx)}
      ERC20UtilityManager deployed to ${erc20UtilityManager.address}
      `
  );

  const ERC20UtilityManagerProxy = await ethers.getContractFactory("ERC20UtilityManagerProxy");
  const proxy = await ERC20UtilityManagerProxy.connect(signer).deploy(
    erc20UtilityManager.address,
    []
  );
  const proxyTx = await proxy.deployed();

  console.log(
      `
        proxyTx ${JSON.stringify(proxyTx)}
        proxy deployed to ${proxy.address}
      `
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
