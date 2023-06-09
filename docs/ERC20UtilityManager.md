# Solidity API

## ERC20UtilityManager

### BULK_ROLE

```solidity
bytes32 BULK_ROLE
```

### initialize

```solidity
function initialize(address bulkAccount, uint256 _maxTransferAmount) public
```

### onlyAdmin

```solidity
modifier onlyAdmin()
```

### onlyPermited

```solidity
modifier onlyPermited(bytes32 role)
```

### checkLength

```solidity
modifier checkLength(address[] _recipient, uint256[] _amount)
```

### version

```solidity
function version() public pure returns (string)
```

### setMaxTransferAmount

```solidity
function setMaxTransferAmount(uint256 value) public
```

### maxTransferAmount

```solidity
function maxTransferAmount() public view returns (uint256)
```

### setupRole

```solidity
function setupRole(bytes32 role, address account) external
```

### bulkWithdraw

```solidity
function bulkWithdraw(address _tokenAddress, address[] _recipients, uint256[] _amounts) public
```

### withdraw

```solidity
function withdraw(address _tokenAddress, address _recipient, uint256 _amount) external
```

