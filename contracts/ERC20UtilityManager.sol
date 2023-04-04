// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/utils/MulticallUpgradeable.sol";

contract ERC20UtilityManager is
	AccessControlUpgradeable,
	MulticallUpgradeable
{
	using SafeERC20 for IERC20;

	event Withdrew(address indexed sender, uint256 amount, address token);
	event BulkWithdrewForEach(address indexed sender, uint256 amount, address token);

	bytes32 public constant BULK_ROLE = keccak256("BULK_ROLE");
	uint256 private MAX_TRANSFER_AMOUNT;

	function initialize(
		address _bulkAccount,
		uint256 _maxTransferAmount
	) public initializer {
		__AccessControl_init();
		__Multicall_init();
		_setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
		_setRoleAdmin(DEFAULT_ADMIN_ROLE, DEFAULT_ADMIN_ROLE);
		_setupRole(BULK_ROLE, _bulkAccount);
		setMaxTransferAmount(_maxTransferAmount);
	}

	modifier onlyAdmin() {
		_checkRole(DEFAULT_ADMIN_ROLE);
		_;
	}

	modifier onlyPermited(bytes32 _role) {
		require(
			hasRole(_role, _msgSender()) ||
				hasRole(DEFAULT_ADMIN_ROLE, _msgSender()),
			"onlyPermited: Invalid Role"
		);
		_;
	}

	modifier checkLength(
		address[] memory _recipient,
		uint256[] memory _amount
	) {
		require(
			_recipient.length == _amount.length,
			"checkLength: Invalid Arguments"
		);
		_;
	}

	function version() public pure returns (string memory) {
		return "1";
	}

	function setMaxTransferAmount(
		uint256 _value
	) public onlyAdmin {
		MAX_TRANSFER_AMOUNT = _value;
	}

	function maxTransferAmount() public view returns (uint256) {
		MAX_TRANSFER_AMOUNT;
	}

	function setupRole(
		bytes32 _role,
		address _account
	) external onlyAdmin {
		_setupRole(_role, _account);
	}

	function bulkWithdraw(
		address _tokenAddress,
		address[] memory _recipients,
		uint256[] memory _amounts
	)
		public
		onlyPermited(BULK_ROLE)
		checkLength(_recipients, _amounts)
	{
		for (uint8 i = 0; i < _recipients.length; i++) {
			require(
				_amounts[i] <= MAX_TRANSFER_AMOUNT,
				"Amount exceeds daily limit"
			);

			IERC20(_tokenAddress).safeTransfer(
				_recipients[i],
				_amounts[i]
			);

			emit BulkWithdrewForEach(_recipients[i], _amounts[i], _tokenAddress);
		}
	}

	function withdraw(
		address _tokenAddress,
		address _recipient,
		uint256 _amount
	) external onlyAdmin {
		IERC20(_tokenAddress).safeTransfer(_recipient, _amount);

		emit Withdrew(_recipient, _amount, _tokenAddress);
	}
}
