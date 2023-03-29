// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract ERC20UtiltyManager is AccessControlUpgradeable {
	using SafeMath for uint256;
	using SafeERC20 for IERC20;

	bytes32 public constant BULK_ROLE = keccak256("BULK_ROLE");
	uint256 private MAX_TRANSFER_AMOUNT;
	mapping(address => uint256) public lastTransferTimestamp;

	function initialize(
		address bulkAccount,
		uint256 _maxTransferAmount
	) public initializer {
		__AccessControl_init();
		_setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
		_setRoleAdmin(DEFAULT_ADMIN_ROLE, DEFAULT_ADMIN_ROLE);
		_setupRole(BULK_ROLE, bulkAccount);
		setMaxTransferAmount(_maxTransferAmount);
	}

	modifier onlyAdmin() {
		_checkRole(DEFAULT_ADMIN_ROLE);
		_;
	}

	modifier onlyPermited(bytes32 role) {
		_checkRole(role);
		_checkRole(DEFAULT_ADMIN_ROLE);
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
		uint256 value
	) public onlyAdmin {
		MAX_TRANSFER_AMOUNT = value;
	}

	function maxTransferAmount() public view {
		MAX_TRANSFER_AMOUNT;
	}

	function setupRole(
		bytes32 role,
		address account
	) external onlyAdmin {
		_setupRole(role, account);
	}

	function bulkSetupRole(
		bytes32[] memory roles,
		address account
	) external onlyAdmin {
		for (uint256 i; i < roles.length; i++) {
			_setupRole(roles[i], account);
		}
	}

	function bulkWithdraw(
		address _tokenAddress,
		address[] memory _recipients,
		uint256[] memory _amounts
	) public onlyPermited(BULK_ROLE) {
		for (uint8 i = 0; i < _recipients.length; i++) {
			require(
				_amounts[i] <= MAX_TRANSFER_AMOUNT,
				"Amount exceeds daily limit"
			);

			IERC20(_tokenAddress).safeTransfer(
				_recipients[i],
				_amounts[i]
			);
		}
	}

	function withdraw(
		address _tokenAddress,
		address _recipient,
		uint256 _amount
	) external onlyAdmin {
		IERC20(_tokenAddress).safeTransfer(_recipient, _amount);
	}
}
