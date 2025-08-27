# OORT LayerZero OFT Fee System

> 📖 **New to basis points?** Check out our [Comprehensive Basis Points Guide](BASIS_POINTS_GUIDE.md) for detailed explanations, examples, and calculations.

This repository now includes a comprehensive fee system for LayerZero Omnichain Fungible Tokens (OFT) implemented in Solidity with basis points configuration.

## Overview

The fee system allows collecting fees on cross-chain transfers in basis points (1 basis point = 0.01%). It provides two implementation approaches:

1. **Integrated Fee System** - `OORTOFTWithFees.sol` - Direct integration with fee functionality
2. **Pluggable Fee System** - Combination of `OORTOFTUpgradeableWithFees.sol` and `OFTFeeCollector.sol` for modular fee collection

## Features

- ✅ Basis points fee configuration (1 bp = 0.01%)
- ✅ Default fee for all destinations
- ✅ Destination-specific fee overrides
- ✅ Configurable fee recipient
- ✅ Upgradeable contracts support
- ✅ Emergency admin controls
- ✅ Fee preview functionality
- ✅ Event emission for transparency
- ✅ Pluggable architecture for existing contracts

## Contracts

### Core Fee Contracts

#### `FeeUpgradeable.sol`
Abstract upgradeable contract implementing fee logic using EIP-1967 storage patterns.

**Key Features:**
- Basis points fee calculation (max 10,000 bp = 100%)
- Per-destination fee configuration
- Default fee fallback
- Fee recipient management
- Upgradeable storage layout

#### `OORTOFTWithFees.sol`
Enhanced OFT adapter with integrated fee functionality.

**Key Features:**
- Inherits from `OFTAdapterUpgradeable` and `FeeUpgradeable`
- Overrides `_debitView` and `_debit` for fee application
- Fee collection during cross-chain transfers
- Preview fee functionality

#### `OFTFeeCollector.sol`
Standalone fee collector contract for pluggable fee functionality.

**Key Features:**
- Independent deployment and management
- Authorization system for OFT contracts
- Maximum fee protection (10% cap)
- Emergency withdrawal functionality

#### `OORTOFTUpgradeableWithFees.sol`
Modified version of existing OFT that works with the pluggable fee collector.

## Usage

### Deployment

1. **Deploy Fee Collector** (for pluggable approach):
```bash
npx hardhat deploy --tags OFTFeeCollector --network <network>
```

2. **Deploy Enhanced OFT**:
```bash
npx hardhat deploy --tags OORTOFTWithFees --network <network>
```

### Fee Management

#### Set Default Fee (2.5%):
```bash
npx hardhat manage-fees --contract <contract-address> --set-default-fee 250 --network <network>
```

#### Set Destination-Specific Fee:
```bash
# Set 1% fee for Ethereum mainnet (EID: 30101)
npx hardhat manage-fees --contract <contract-address> --set-dest-fee "30101:100:true" --network <network>
```

#### Set Fee Recipient:
```bash
npx hardhat manage-fees --contract <contract-address> --set-recipient <recipient-address> --network <network>
```

#### Preview Fee:
```bash
# Preview fee for sending 1 OORT to Ethereum
npx hardhat manage-fees --contract <contract-address> --preview-fee "30101:1000000000000000000" --network <network>
```

### Pluggable Fee Collector Management

#### Authorize OFT Contract:
```bash
npx hardhat manage-fee-collector --collector <collector-address> --authorize "<oft-address>:true" --network <network>
```

#### Configure Fees:
```bash
npx hardhat manage-fee-collector --collector <collector-address> --set-default-fee 150 --network <network>
```

## Fee Calculation

Fees are calculated using basis points:
- 1 basis point (bp) = 0.01%
- 100 bp = 1%
- 10,000 bp = 100%

**Formula:**
```
fee = (amount * feeBps) / 10,000
```

**Example:**
- Amount: 1,000 tokens
- Fee: 250 bp (2.5%)
- Calculated fee: (1,000 * 250) / 10,000 = 25 tokens
- Amount after fee: 975 tokens

> 📖 **Need more details on basis points?** Check out our [Comprehensive Basis Points Guide](BASIS_POINTS_GUIDE.md) for in-depth explanations, examples, and best practices.

## Architecture

### Integrated Approach
```
User -> OORTOFTWithFees -> Fee Calculation -> LayerZero Transfer
                      ↓
                 Fee Recipient
```

### Pluggable Approach
```
User -> OORTOFTUpgradeableWithFees -> OFTFeeCollector -> Fee Recipient
                                  ↓
                            LayerZero Transfer
```

## Security Features

1. **Maximum Fee Protection**: 10% cap on fees
2. **Owner-only Administration**: Critical functions restricted to contract owner
3. **Slippage Protection**: Minimum amount checks
4. **Authorization System**: Only authorized contracts can call fee collector
5. **Emergency Controls**: Admin withdrawal functions

## Configuration Examples

### Basic Setup (2% default fee):
```solidity
// Set 2% default fee
oft.setDefaultFeeBps(200);

// Set fee recipient
oft.setFeeRecipient(feeRecipientAddress);
```

### Advanced Setup (different fees per destination):
```solidity
// 1% for Ethereum (EID: 30101)
oft.setFeeBps(30101, 100, true);

// 0.5% for BSC (EID: 30102)  
oft.setFeeBps(30102, 50, true);

// 3% default for other chains
oft.setDefaultFeeBps(300);
```

## Events

The contracts emit events for transparency:

```solidity
event FeeBpsSet(uint32 indexed dstEid, uint16 feeBps, bool enabled);
event DefaultFeeBpsSet(uint16 feeBps);
event FeeRecipientSet(address indexed feeRecipient);
event FeesCollected(uint32 indexed dstEid, uint256 feeAmount);
```

## Gas Optimization

- Uses EIP-1967 storage patterns for upgradeable contracts
- Minimal storage reads with memory caching
- Efficient basis points calculation
- No external calls during fee calculation

## Compatibility

- ✅ LayerZero V2 EndpointV2
- ✅ OpenZeppelin Upgradeable Contracts
- ✅ ERC-20 tokens
- ✅ Solidity ^0.8.22

## Testing

Test the fee functionality:

```bash
# Deploy and configure
npx hardhat deploy --tags OORTOFTWithFees
npx hardhat manage-fees --contract <address> --set-default-fee 250 --set-recipient <recipient>

# Test transfer with fee preview
npx hardhat manage-fees --contract <address> --preview-fee "30101:1000000000000000000"
```

## Migration from Existing OFT

To add fees to existing OFT deployments:

1. Deploy `OFTFeeCollector`
2. Configure fee parameters
3. Authorize your OFT contract
4. Update OFT to call fee collector (requires contract upgrade)

## Support

For technical support and questions about the fee system implementation, please refer to the contract documentation and test examples.