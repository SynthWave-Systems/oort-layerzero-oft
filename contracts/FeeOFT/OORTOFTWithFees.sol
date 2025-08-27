// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { OFTAdapterUpgradeable } from "@layerzerolabs/oft-evm-upgradeable/contracts/oft/OFTAdapterUpgradeable.sol";
import { FeeUpgradeable } from "./FeeUpgradeable.sol";

///////////////////////////////////////////////////
//   ____  ____  ___  ______  ____  __________  ////
//  / __ \/ __ \/ _ \/_  __/ / __ \/ __/_  __/  ////
// / /_/ / /_/ / , _/ / /   / /_/ / _/  / /   /////
// \____/\____/_/|_| /_/    \____/_/   /_/    /////
//////////////////////////////////////////////////

contract OORTOFTWithFees is OFTAdapterUpgradeable, FeeUpgradeable {
    using SafeERC20 for IERC20;

    event FeesCollected(uint32 dstEid, uint256 feeAmount, address feeRecipient);

    constructor(
        address _token,
        address _lzEndpoint
    ) OFTAdapterUpgradeable(_token, _lzEndpoint) {}

    function version() external pure returns (uint256 major, uint256 minor, uint256 patch) {
        major = 1;
        minor = 1;
        patch = 0;
    }

    // Admin
    function initialize(address _delegate) external initializer {
        __OFTCore_init(_delegate);
        __Ownable_init(_delegate);
        __Fee_init();
        _transferOwnership(_delegate);
    }

    // Override _debitView to apply fees
    function _debitView(
        uint256 _amountLD,
        uint256 _minAmountLD,
        uint32 _dstEid
    ) internal view override returns (uint256 amountSentLD, uint256 amountReceivedLD) {
        // Remove dust
        amountSentLD = _removeDust(_amountLD);
        
        // Calculate fee
        uint256 fee = getFee(_dstEid, amountSentLD);
        
        // Amount received after fee deduction
        amountReceivedLD = amountSentLD - fee;

        // Check for slippage
        if (amountReceivedLD < _minAmountLD) {
            revert SlippageExceeded(amountReceivedLD, _minAmountLD);
        }
    }

    // Override _debit to handle fee collection
    function _debit(
        address _from,
        uint256 _amountLD,
        uint256 _minAmountLD,
        uint32 _dstEid
    ) internal override returns (uint256 amountSentLD, uint256 amountReceivedLD) {
        (amountSentLD, amountReceivedLD) = _debitView(_amountLD, _minAmountLD, _dstEid);
        
        // Calculate fee
        uint256 fee = amountSentLD - amountReceivedLD;
        
        // Transfer the full amount from user
        IERC20(token()).safeTransferFrom(_from, address(this), amountSentLD);
        
        // Handle fee collection if there's a fee and fee recipient
        if (fee > 0) {
            address recipient = feeRecipient();
            if (recipient != address(0)) {
                // Transfer fee to fee recipient
                IERC20(token()).safeTransfer(recipient, fee);
                emit FeesCollected(_dstEid, fee, recipient);
            }
            // If no fee recipient, fees stay in the contract (can be withdrawn by admin)
        }
    }

    // Restrictive admin function to withdraw tokens (including accumulated fees)
    function AdminWithdrawTokens(address _token, address _to, uint256 _amount) external onlyOwner {
        IERC20(_token).safeTransfer(_to, _amount);
    }

    // View function to preview fee for a transfer
    function previewFee(uint32 _dstEid, uint256 _amount) external view returns (uint256 fee, uint256 amountAfterFee) {
        uint256 cleanAmount = _removeDust(_amount);
        fee = getFee(_dstEid, cleanAmount);
        amountAfterFee = cleanAmount - fee;
    }

    // Get current fee configuration for easy inspection
    function getFeeConfig(uint32 _dstEid) external view returns (
        uint16 feeBpsForDestination,
        bool enabled,
        uint16 defaultFee,
        address recipient
    ) {
        FeeConfig memory config = feeBps(_dstEid);
        feeBpsForDestination = config.feeBps;
        enabled = config.enabled;
        defaultFee = defaultFeeBps();
        recipient = feeRecipient();
    }
}