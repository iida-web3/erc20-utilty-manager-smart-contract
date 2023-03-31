# ERC20UtilityManager
## Local

use env `.env.sample`

```shell
npx hardhat node
npx hardhat clean
npx hardhat compile
npx hardhat docgen

npx hardhat run --network local scripts/deploy.ts
npx hardhat run --network local scripts/initialize.ts
npx hardhat run --network local scripts/transfer.ts
npx hardhat run --network local scripts/setMaxTransferAmount.ts
npx hardhat run --network local scripts/setupRole.ts
npx hardhat run --network local scripts/bulkSetupRole.ts
npx hardhat run --network local scripts/bulkWithdraw.ts
npx hardhat run --network local scripts/balanceOf.ts
npx hardhat run --network local scripts/defaultAdminRole.ts
npx hardhat run --network local scripts/maxTransferAmount.ts
```

## Polygon mumbai & Fireblocks

use env `.env.mumbai.fireblocks.sample`

```shell
npx hardhat run --network mumbai scripts/deployFireblocks.ts
npx hardhat run --network mumbai scripts/initialize.ts
npx hardhat run --network mumbai scripts/bulkWithdraw.ts
```

## Polygon mumbai

use env `.env.mumbai.sample`

```shell
npx hardhat run --network mumbai scripts/deploy.ts
npx hardhat run --network mumbai scripts/initialize.ts
npx hardhat run --network mumbai scripts/bulkWithdraw.ts
```

## Polygon mainnet & Fireblocks

use env `.env.polygon.fireblocks.sample`

```shell
npx hardhat run --network polygon scripts/deployFireblocks.ts
npx hardhat run --network polygon scripts/initialize.ts
npx hardhat run --network polygon scripts/bulkWithdraw.ts
```


## Polygon mainnet

use env `.env.polygon.sample`

```shell
npx hardhat run --network polygon scripts/deploy.ts
npx hardhat run --network polygon scripts/initialize.ts
npx hardhat run --network polygon scripts/bulkWithdraw.ts
```
