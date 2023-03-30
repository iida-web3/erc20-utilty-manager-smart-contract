

```shell
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
npx hardhat run --network local scripts/transferFrom.js
```
