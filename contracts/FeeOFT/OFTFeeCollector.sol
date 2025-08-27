// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title FeeConfig
 * @notice Structure for fee configuration per destination
 */
struct FeeConfig {
    uint16 feeBps;
    bool enabled;
}

/**
 * @title IFeeCollector
 * @notice Interface for pluggable fee collection
 */
interface IFeeCollector {
    function calculateFee(uint32 dstEid, uint256 amount) external view returns (uint256 fee);
    function collectFee(uint32 dstEid, address token, uint256 amount, address from) external returns (uint256 fee);
}

/**
 * @title OFTFeeCollector
 * @notice Standalone fee collector contract that can be plugged into existing OFT contracts
 * @dev This contract implements a basis points fee system for LayerZero OFT transfers
 */
contract OFTFeeCollector is IFeeCollector, Ownable {
    using SafeERC20 for IERC20;

    uint16 public constant BPS_DENOMINATOR = 10_000;
    uint16 public constant MAX_FEE_BPS = 1000; // 10% maximum fee

    // Default fee basis points for all destinations
    uint16 public defaultFeeBps;

    // Fee configuration for specific destination endpoint IDs
    mapping(uint32 dstEid => FeeConfig config) public feeBps;

    // Fee recipient address
    address public feeRecipient;

    // Authorized callers (OFT contracts that can call collectFee)
    mapping(address => bool) public authorizedCallers;

    // Events
    event FeeBpsSet(uint32 indexed dstEid, uint16 feeBps, bool enabled);
    event DefaultFeeBpsSet(uint16 feeBps);
    event FeeRecipientSet(address indexed feeRecipient);
    event AuthorizedCallerSet(address indexed caller, bool authorized);
    event FeeCollected(uint32 indexed dstEid, address indexed token, uint256 amount, address indexed from);

    // Errors
    error InvalidBps();
    error InvalidFeeRecipient();
    error UnauthorizedCaller();
    error FeeCollectionFailed();

    constructor(address _owner, address _feeRecipient) Ownable(_owner) {
        feeRecipient = _feeRecipient;
        emit FeeRecipientSet(_feeRecipient);
    }

    modifier onlyAuthorized() {
        if (!authorizedCallers[msg.sender]) revert UnauthorizedCaller();
        _;
    }

    /**
     * @dev Sets the default fee basis points (BPS) for all destinations
     */
    function setDefaultFeeBps(uint16 _feeBps) external onlyOwner {
        if (_feeBps > MAX_FEE_BPS) revert InvalidBps();
        defaultFeeBps = _feeBps;
        emit DefaultFeeBpsSet(_feeBps);
    }

    /**
     * @dev Sets fee basis points (BPS) for a specific destination LayerZero EndpointV2 ID
     */
    function setFeeBps(uint32 _dstEid, uint16 _feeBps, bool _enabled) external onlyOwner {
        if (_feeBps > MAX_FEE_BPS) revert InvalidBps();
        feeBps[_dstEid] = FeeConfig(_feeBps, _enabled);
        emit FeeBpsSet(_dstEid, _feeBps, _enabled);
    }

    /**
     * @dev Sets the fee recipient address
     */
    function setFeeRecipient(address _feeRecipient) external onlyOwner {
        if (_feeRecipient == address(0)) revert InvalidFeeRecipient();
        feeRecipient = _feeRecipient;
        emit FeeRecipientSet(_feeRecipient);
    }

    /**
     * @dev Sets authorization for a caller (OFT contract)
     */
    function setAuthorizedCaller(address _caller, bool _authorized) external onlyOwner {
        authorizedCallers[_caller] = _authorized;
        emit AuthorizedCallerSet(_caller, _authorized);
    }

    /**
     * @dev Calculates fee for a given destination and amount
     */
    function calculateFee(uint32 _dstEid, uint256 _amount) external view returns (uint256 fee) {
        uint16 bps = _getFeeBps(_dstEid);
        return bps == 0 ? 0 : (_amount * bps) / BPS_DENOMINATOR;
    }

    /**
     * @dev Collects fee from the caller (must be authorized)
     * @param _dstEid Destination endpoint ID
     * @param _token Token contract address
     * @param _amount Amount to calculate fee on
     * @param _from Address to collect fee from
     * @return fee Amount of fee collected
     */
    function collectFee(
        uint32 _dstEid,
        address _token,
        uint256 _amount,
        address _from
    ) external onlyAuthorized returns (uint256 fee) {
        fee = this.calculateFee(_dstEid, _amount);
        
        if (fee > 0 && feeRecipient != address(0)) {
            IERC20(_token).safeTransferFrom(_from, feeRecipient, fee);
            emit FeeCollected(_dstEid, _token, fee, _from);
        }
        
        return fee;
    }

    /**
     * @dev Returns the effective fee BPS for a destination
     */
    function _getFeeBps(uint32 _dstEid) internal view returns (uint16) {
        FeeConfig memory config = feeBps[_dstEid];
        return config.enabled ? config.feeBps : defaultFeeBps;
    }

    /**
     * @dev Gets fee configuration for a destination
     */
    function getFeeConfig(uint32 _dstEid) external view returns (
        uint16 feeBpsForDestination,
        bool enabled,
        uint16 defaultFee,
        address recipient
    ) {
        FeeConfig memory config = feeBps[_dstEid];
        feeBpsForDestination = config.feeBps;
        enabled = config.enabled;
        defaultFee = defaultFeeBps;
        recipient = feeRecipient;
    }

    /**
     * @dev Emergency function to withdraw stuck tokens (only owner)
     */
    function emergencyWithdraw(address _token, uint256 _amount) external onlyOwner {
        IERC20(_token).safeTransfer(owner(), _amount);
    }
}