import { ethers } from 'hardhat';
import { env } from '../lib/config';
import { contracts } from '../../typechain-types';
import { getEstimate, getFeeData, getSigners } from '../lib/web3Utility';
import { BigNumber, providers } from 'ethers';
import { bulkWithdrawData } from '../lib/bulkWithdrawData/bulkWithdrawData';

async function bulkWithdraw(addresses: string[], amounts: BigNumber[]) {
  const [deployer] = await getSigners();
  const manager: contracts.ERC20UtilityManager = await ethers.getContractAt(
    'ERC20UtilityManager',
    env.PROXY_CONTRACT_ADDRESS,
  );

  const dataRow: string = await manager.interface.encodeFunctionData(
    'bulkWithdraw',
    [env.TESTTOKEN_CONTRACT_ADDRESS, addresses, amounts],
  );

  const nonce: number = await deployer.getTransactionCount();

  const estimateGas: number = await getEstimate(
    nonce,
    await deployer.getAddress(),
    manager.address,
    dataRow,
  );

  const feeData: providers.FeeData = await getFeeData();
  const tx: providers.TransactionResponse = await deployer.sendTransaction({
    from: await deployer.getAddress(),
    to: manager.address,
    gasLimit: estimateGas,
    nonce: nonce,
    data: dataRow,
    //maxPriorityFeePerGas: feeData.maxPriorityFeePerGas || 0,
    //maxFeePerGas: feeData.maxFeePerGas || 0,
  });

  console.log(tx);
  await tx.wait();
}

async function runMain(addresses: string[], amounts: BigNumber[]) {
  let bulkWithdrawForCount = addresses.length / env.MAX_BULK_SEND_COUNT;
  let dumpAddress = addresses;
  let dumpAmounts = amounts;

  console.log(`${bulkWithdrawForCount}回Loopします`);
  console.log(`送金人数: ${addresses.length}`);
  const total: BigNumber = amounts.reduce(
    (acc: BigNumber, cur: BigNumber) => acc.add(cur),
    BigNumber.from(0),
  );
  console.log(`合計送金トークン量: ${total}`);

  for (let i = 0; i < bulkWithdrawForCount; i++) {
    console.log(`${i + 1}回目bulkWithdraw`);
    const inAddress = dumpAddress.slice(0, env.MAX_BULK_SEND_COUNT);
    const inAmounts = dumpAmounts.slice(0, env.MAX_BULK_SEND_COUNT);

    if (dumpAddress.length >= env.MAX_BULK_SEND_COUNT) {
      dumpAddress = dumpAddress.slice(env.MAX_BULK_SEND_COUNT);
      dumpAmounts = dumpAmounts.slice(env.MAX_BULK_SEND_COUNT);
    }

    console.log('送金人数', env.MAX_BULK_SEND_COUNT);
    console.log('残り送金人数', dumpAddress.length);

    await bulkWithdraw(inAddress, inAmounts);
  }
}

const [addresses, amounts] = bulkWithdrawData();

runMain(addresses, amounts)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
