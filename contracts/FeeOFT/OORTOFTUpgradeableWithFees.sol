// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { OFTAdapterUpgradeable } from "@layerzerolabs/oft-evm-upgradeable/contracts/oft/OFTAdapterUpgradeable.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface IFeeCollector {
    function calculateFee(uint32 dstEid, uint256 amount) external view returns (uint256 fee);
    function collectFee(uint32 dstEid, address token, uint256 amount, address from) external returns (uint256 fee);
}

///////////////////////////////////////////////////
//   ____  ____  ___  ______  ____  __________  ////
//  / __ \/ __ \/ _ \/_  __/ / __ \/ __/_  __/  ////
// / /_/ / /_/ / , _/ / /   / /_/ / _/  / /   /////
// \____/\____/_/|_| /_/    \____/_/   /_/    /////
//////////////////////////////////////////////////

contract OORTOFTUpgradeableWithFees is OFTAdapterUpgradeable {
    using SafeERC20 for IERC20;

    // Fee collector contract (can be set/updated by admin)
    IFeeCollector public feeCollector;

    event FeeCollectorSet(address indexed feeCollector);
    event FeesCollected(uint32 indexed dstEid, uint256 feeAmount);

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
        _transferOwnership(_delegate);
    }

    /**
     * @dev Sets the fee collector contract
     */
    function setFeeCollector(address _feeCollector) external onlyOwner {
        feeCollector = IFeeCollector(_feeCollector);
        emit FeeCollectorSet(_feeCollector);
    }

    // Override _debitView to apply fees
    function _debitView(
        uint256 _amountLD,
        uint256 _minAmountLD,
        uint32 _dstEid
    ) internal view override returns (uint256 amountSentLD, uint256 amountReceivedLD) {
        // Remove dust
        amountSentLD = _removeDust(_amountLD);
        
        // Calculate fee if fee collector is set
        uint256 fee = 0;
        if (address(feeCollector) != address(0)) {
            fee = feeCollector.calculateFee(_dstEid, amountSentLD);
        }
        
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
        
        // Transfer the tokens to be sent (this locks them in the contract)
        IERC20(token()).safeTransferFrom(_from, address(this), amountSentLD);
        
        // Collect fee if fee collector is set
        if (address(feeCollector) != address(0)) {
            uint256 fee = amountSentLD - amountReceivedLD;
            if (fee > 0) {
                // Transfer fee amount from this contract to fee collector for processing
                IERC20(token()).safeTransfer(address(feeCollector), fee);
                // Let fee collector handle the fee
                feeCollector.collectFee(_dstEid, token(), fee, address(this));
                emit FeesCollected(_dstEid, fee);
            }
        }
    }

    // View function to preview fee for a transfer
    function previewFee(uint32 _dstEid, uint256 _amount) external view returns (uint256 fee, uint256 amountAfterFee) {
        uint256 cleanAmount = _removeDust(_amount);
        
        if (address(feeCollector) != address(0)) {
            fee = feeCollector.calculateFee(_dstEid, cleanAmount);
        }
        
        amountAfterFee = cleanAmount - fee;
    }

    // Restrictive admin function to withdraw tokens
    function AdminWithdrawTokens(address _token, address _to, uint256 _amount) external onlyOwner {
        IERC20(_token).safeTransfer(_to, _amount);
    }
}