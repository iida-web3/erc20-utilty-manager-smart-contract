# ERC20UtilityManager

## Bulk系関数のCSVテンプレート

```
https://docs.google.com/spreadsheets/d/1GcWuM74oip6dzSNeWi73qCjY9tDAX-BZaiiPBJ5gnZ4/edit?usp=sharing
```

## Local

use env `.env.sample`

```shell
npx hardhat node
npx hardhat clean
npx hardhat compile
npx hardhat docgen
```

```shell
npx hardhat run --network local scripts/deploy.ts
npx hardhat run --network local scripts/initialize.ts
```

## Polygon mumbai & Fireblocks

use env `.env.mumbai.fireblocks.sample`

```shell
npx hardhat run --network mumbai scripts/deploy.ts
npx hardhat run --network mumbai scripts/initialize.ts
```

## Polygon mumbai

use env `.env.mumbai.sample`

```shell
npx hardhat run --network mumbai scripts/deploy.ts
npx hardhat run --network mumbai scripts/initialize.ts
```

## Polygon mainnet & Fireblocks

use env `.env.polygon.fireblocks.sample`

```shell
npx hardhat run --network polygon scripts/deploy.ts
npx hardhat run --network polygon scripts/initialize.ts
```

## Polygon mainnet

use env `.env.polygon.sample`

```shell
npx hardhat run --network polygon scripts/deploy.ts
npx hardhat run --network polygon scripts/initialize.ts
```

## Scripts

```shell
✅scripts/ERC20/transfer.ts
scripts/ERC20/getBalanceOf.ts
scripts/ERC20UtilityManager/setMaxTransferAmount.ts
scripts/ERC20UtilityManager/setupRole.ts
scripts/ERC20UtilityManager/bulkWithdraw.ts
scripts/ERC20UtilityManager/withdraw.ts
scripts/ERC20UtilityManager/multicall.ts
scripts/ERC20UtilityManager/getDefaultAdminRole.ts
scripts/ERC20UtilityManager/getMaxTransferAmount.ts
scripts/ERC20UtilityManager/loopMulticall.ts
✅scripts/ERC20UtilityManager/loopBulkWithdraw.ts
```
