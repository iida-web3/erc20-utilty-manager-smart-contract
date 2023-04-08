# Solidity API

## ERC20UtilityManager

### Withdrew

```solidity
event Withdrew(address sender, uint256 amount, address token)
```

### BulkWithdrewForEach

```solidity
event BulkWithdrewForEach(address sender, uint256 amount, address token)
```

### BULK_ROLE

```solidity
bytes32 BULK_ROLE
```

### initialize

```solidity
function initialize(address _bulkAccount, uint256 _maxTransferAmount) public
```

### onlyAdmin

```solidity
modifier onlyAdmin()
```

### onlyPermited

```solidity
modifier onlyPermited(bytes32 _role)
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
function setMaxTransferAmount(uint256 _value) public
```

### maxTransferAmount

```solidity
function maxTransferAmount() public view returns (uint256)
```

### setupRole

```solidity
function setupRole(bytes32 _role, address _account) external
```

### bulkWithdraw

```solidity
function bulkWithdraw(address _tokenAddress, address[] _recipients, uint256[] _amounts) public
```

### withdraw

```solidity
function withdraw(address _tokenAddress, address _recipient, uint256 _amount) external
```

