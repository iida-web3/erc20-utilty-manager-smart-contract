import { BigNumber } from "ethers";
import { parseUseErc20 } from "../web3Utility";
const amount: BigNumber = parseUseErc20("1");
export const amounts: BigNumber[] = new Array(250).fill(amount);
