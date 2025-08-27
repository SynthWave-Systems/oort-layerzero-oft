# Comprehensive Guide to Basis Points in DeFi and Smart Contracts

## Table of Contents
- [What are Basis Points?](#what-are-basis-points)
- [Why Use Basis Points?](#why-use-basis-points)
- [Conversion Reference](#conversion-reference)
- [Mathematical Examples](#mathematical-examples)
- [Common DeFi Values](#common-defi-values)
- [Implementation in Smart Contracts](#implementation-in-smart-contracts)
- [OORT Fee System Examples](#oort-fee-system-examples)
- [Calculation Tools](#calculation-tools)
- [Best Practices](#best-practices)
- [Common Pitfalls](#common-pitfalls)

## What are Basis Points?

**Basis Points (bp)** are a unit of measurement used to describe percentages in finance and trading. One basis point equals **0.01%** or **1/100th of a percent**.

### Key Facts:
- **1 basis point = 0.01%**
- **100 basis points = 1%**
- **10,000 basis points = 100%**
- Abbreviated as "bp" or "bps" (basis points)

### Etymology
The term "basis point" comes from the "basis" or "base" move between two percentages. It provides a clear, unambiguous way to discuss small percentage changes.

## Why Use Basis Points?

### 1. **Precision**
Basis points eliminate confusion when discussing small percentage changes:
- ❌ "The fee increased from 0.25% to 0.35%" - Is this a 0.1% increase or 40% relative increase?
- ✅ "The fee increased by 10 basis points" - Crystal clear!

### 2. **Standardization**
Financial industry standard for discussing:
- Interest rates
- Trading fees
- Yield changes
- Risk premiums

### 3. **Smart Contract Efficiency**
- Avoids decimal arithmetic in Solidity
- Uses integer math for gas efficiency
- Eliminates floating-point precision issues

## Conversion Reference

### Quick Reference Table

| Basis Points | Percentage | Decimal | Fraction |
|--------------|------------|---------|----------|
| 1 bp | 0.01% | 0.0001 | 1/10,000 |
| 5 bp | 0.05% | 0.0005 | 1/2,000 |
| 10 bp | 0.10% | 0.001 | 1/1,000 |
| 25 bp | 0.25% | 0.0025 | 1/400 |
| 50 bp | 0.50% | 0.005 | 1/200 |
| 100 bp | 1.00% | 0.01 | 1/100 |
| 250 bp | 2.50% | 0.025 | 1/40 |
| 500 bp | 5.00% | 0.05 | 1/20 |
| 1,000 bp | 10.00% | 0.10 | 1/10 |
| 10,000 bp | 100.00% | 1.00 | 1/1 |

### Conversion Formulas

```
Basis Points to Percentage: bp ÷ 100
Percentage to Basis Points: percentage × 100
Basis Points to Decimal: bp ÷ 10,000
Decimal to Basis Points: decimal × 10,000
```

## Mathematical Examples

### Example 1: Basic Fee Calculation
**Scenario**: Transfer 1,000 OORT tokens with 250 bp fee

```
Amount: 1,000 OORT
Fee Rate: 250 bp (2.50%)

Calculation:
Fee = (Amount × Basis Points) ÷ 10,000
Fee = (1,000 × 250) ÷ 10,000
Fee = 250,000 ÷ 10,000
Fee = 25 OORT

Amount After Fee = 1,000 - 25 = 975 OORT
```

### Example 2: Variable Amounts
Different amounts with same 150 bp fee (1.5%):

| Amount | Fee Calculation | Fee Amount | Net Amount |
|--------|----------------|------------|------------|
| 100 OORT | (100 × 150) ÷ 10,000 | 1.5 OORT | 98.5 OORT |
| 1,000 OORT | (1,000 × 150) ÷ 10,000 | 15 OORT | 985 OORT |
| 10,000 OORT | (10,000 × 150) ÷ 10,000 | 150 OORT | 9,850 OORT |
| 100,000 OORT | (100,000 × 150) ÷ 10,000 | 1,500 OORT | 98,500 OORT |

### Example 3: Destination-Specific Fees
Different fees for different chains:

```
Transfer 5,000 OORT to different chains:

Ethereum (EID: 30101): 100 bp (1%)
Fee = (5,000 × 100) ÷ 10,000 = 50 OORT
Net = 4,950 OORT

BSC (EID: 30102): 75 bp (0.75%)
Fee = (5,000 × 75) ÷ 10,000 = 37.5 OORT
Net = 4,962.5 OORT

Polygon (EID: 30109): 200 bp (2%)
Fee = (5,000 × 200) ÷ 10,000 = 100 OORT
Net = 4,900 OORT
```

## Common DeFi Values

### Typical Fee Ranges in DeFi

| Service Type | Typical Range | Example Values |
|--------------|---------------|----------------|
| **Trading Fees** | 1-50 bp | Uniswap: 30 bp (0.3%) |
| **Bridge Fees** | 10-100 bp | Most bridges: 10-50 bp |
| **Lending Spread** | 200-500 bp | Compound/Aave: 2-5% |
| **Staking Rewards** | 300-1500 bp | ETH staking: ~5% (500 bp) |
| **DAO Treasury** | 50-300 bp | Management fees: 1-3% |
| **Protocol Revenue** | 25-200 bp | Revenue sharing: 0.25-2% |

### OORT Recommended Ranges

| Transfer Type | Recommended | Rationale |
|---------------|-------------|-----------|
| **Mainnet to L2** | 25-75 bp | Low cost, high volume |
| **L2 to L2** | 10-50 bp | Encourage cross-chain activity |
| **Mainnet to Mainnet** | 50-150 bp | Premium for security |
| **Default Fee** | 100 bp | Balanced 1% fee |
| **Maximum Fee** | 1,000 bp | 10% safety cap |

## Implementation in Smart Contracts

### Solidity Implementation Pattern

```solidity
// OORT Fee System Implementation
contract FeeCalculator {
    uint256 public constant MAX_FEE_BPS = 1000; // 10% maximum
    uint256 public constant BPS_DENOMINATOR = 10000; // 100%
    
    // Calculate fee from amount and basis points
    function calculateFee(uint256 amount, uint16 feeBps) 
        public 
        pure 
        returns (uint256) 
    {
        require(feeBps <= MAX_FEE_BPS, "Fee too high");
        return (amount * feeBps) / BPS_DENOMINATOR;
    }
    
    // Calculate net amount after fee deduction
    function calculateNetAmount(uint256 amount, uint16 feeBps) 
        public 
        pure 
        returns (uint256 netAmount, uint256 feeAmount) 
    {
        feeAmount = calculateFee(amount, feeBps);
        netAmount = amount - feeAmount;
    }
}
```

### Storage Optimization

```solidity
// Efficient storage for fee configuration
struct FeeConfig {
    uint16 feeBps;      // 0-10,000 basis points (2 bytes)
    bool enabled;       // Fee enabled flag (1 byte)
    // Total: 3 bytes (saves gas vs separate storage slots)
}

mapping(uint32 => FeeConfig) public destinationFees;
uint16 public defaultFeeBps;
```

## OORT Fee System Examples

### Example 1: Setting Up Default Fees

```bash
# Set 2.5% default fee for all destinations
npx hardhat manage-fees \
  --contract 0x1234... \
  --set-default-fee 250 \
  --network mainnet

# This means:
# - Any cross-chain transfer pays 2.5% fee
# - On 1,000 OORT transfer: 25 OORT fee, 975 OORT sent
# - Fee goes to configured recipient address
```

### Example 2: Destination-Specific Configuration

```bash
# Configure different fees per chain
npx hardhat manage-fees \
  --contract 0x1234... \
  --set-dest-fee "30101:100:true" \  # Ethereum: 1%
  --set-dest-fee "30102:75:true" \   # BSC: 0.75%
  --set-dest-fee "30109:150:true" \  # Polygon: 1.5%
  --network mainnet

# Default fee still applies to unconfigured destinations
```

### Example 3: Fee Preview

```bash
# Preview fee for 1,000 OORT to Ethereum
npx hardhat manage-fees \
  --contract 0x1234... \
  --preview-fee "30101:1000000000000000000" \
  --network mainnet

# Output:
# Destination: Ethereum (30101)
# Amount: 1,000.000000000000000000 OORT
# Fee Rate: 100 bp (1.00%)
# Fee Amount: 10.000000000000000000 OORT
# Net Amount: 990.000000000000000000 OORT
```

### Example 4: Real-World Transfer Scenarios

#### Scenario A: Small Transfer
```
Amount: 50 OORT
Destination: BSC (75 bp fee)
Fee = (50 × 75) ÷ 10,000 = 0.375 OORT
Net = 49.625 OORT
Fee Cost: 0.75%
```

#### Scenario B: Large Transfer
```
Amount: 100,000 OORT  
Destination: Ethereum (100 bp fee)
Fee = (100,000 × 100) ÷ 10,000 = 1,000 OORT
Net = 99,000 OORT
Fee Cost: 1%
```

#### Scenario C: Maximum Fee Protection
```
Amount: 1,000 OORT
Attempted Fee: 1,500 bp (15%)
Result: Transaction REVERTS (exceeds 1,000 bp maximum)
Protection: Prevents excessive fees
```

## Calculation Tools

### Manual Calculation Formulas

```javascript
// JavaScript helper functions
function bpToPercentage(bp) {
    return bp / 100;
}

function bpToDecimal(bp) {
    return bp / 10000;
}

function calculateFee(amount, bp) {
    return (amount * bp) / 10000;
}

function calculateNet(amount, bp) {
    const fee = calculateFee(amount, bp);
    return {
        fee: fee,
        net: amount - fee,
        percentage: bpToPercentage(bp)
    };
}

// Example usage:
console.log(calculateNet(1000, 250));
// Output: { fee: 25, net: 975, percentage: 2.5 }
```

### Excel/Google Sheets Formulas

```excel
// Cell formulas for fee calculations
Fee Amount: =A1*B1/10000
Net Amount: =A1-C1
Percentage: =B1/100

Where:
A1 = Transfer Amount
B1 = Basis Points
C1 = Fee Amount
```

## Best Practices

### 1. **Fee Setting Guidelines**

```solidity
// Recommended fee structure
uint16 public constant MIN_FEE_BPS = 1;      // 0.01% minimum
uint16 public constant DEFAULT_FEE_BPS = 100; // 1% default
uint16 public constant MAX_FEE_BPS = 1000;   // 10% maximum

// Progressive fee structure example
function getProgressiveFee(uint256 amount) public pure returns (uint16) {
    if (amount < 1000e18) return 200;      // 2% for small amounts
    if (amount < 10000e18) return 150;     // 1.5% for medium amounts
    return 100;                            // 1% for large amounts
}
```

### 2. **User Experience Considerations**

- **Always show fees upfront**: Use preview functions
- **Display in multiple formats**: "25 OORT (2.5%)"
- **Provide fee calculators**: Help users estimate costs
- **Set reasonable defaults**: Start with 1% (100 bp)

### 3. **Security Considerations**

```solidity
// Always validate basis points input
modifier validFeeBps(uint16 feeBps) {
    require(feeBps <= MAX_FEE_BPS, "Fee exceeds maximum");
    _;
}

// Use constants for important values
uint256 public constant BPS_DENOMINATOR = 10000;
uint16 public constant MAX_FEE_BPS = 1000; // 10%
```

### 4. **Gas Optimization**

```solidity
// Efficient fee calculation
function _calculateFee(uint256 amount, uint16 feeBps) 
    internal 
    pure 
    returns (uint256) 
{
    // Single multiplication and division
    return (amount * feeBps) / 10000;
}

// Avoid multiple storage reads
FeeConfig memory config = destinationFees[dstEid];
if (config.enabled) {
    fee = _calculateFee(amount, config.feeBps);
}
```

## Common Pitfalls

### 1. **Decimal Confusion**
```
❌ Wrong: Setting 2.5 thinking it's 2.5%
✅ Correct: Setting 250 for 2.5%

❌ Wrong: fee = amount * 0.025
✅ Correct: fee = (amount * 250) / 10000
```

### 2. **Integer Division**
```solidity
❌ Wrong: May lose precision
uint256 fee = (amount * feeBps) / 10000;

✅ Correct: Consider rounding
uint256 fee = (amount * feeBps + 9999) / 10000; // Round up
```

### 3. **Maximum Fee Validation**
```solidity
❌ Wrong: No upper limit
function setFeeBps(uint16 feeBps) external onlyOwner {
    defaultFeeBps = feeBps; // Could be set to 10000 (100%)!
}

✅ Correct: Always validate
function setFeeBps(uint16 feeBps) external onlyOwner {
    require(feeBps <= MAX_FEE_BPS, "Fee too high");
    defaultFeeBps = feeBps;
}
```

### 4. **Zero Amount Handling**
```solidity
❌ Wrong: Division by zero risk
function getFeePercentage(uint256 amount, uint256 fee) 
    external 
    pure 
    returns (uint256) 
{
    return (fee * 10000) / amount; // Fails if amount = 0
}

✅ Correct: Handle edge cases
function getFeePercentage(uint256 amount, uint256 fee) 
    external 
    pure 
    returns (uint256) 
{
    if (amount == 0) return 0;
    return (fee * 10000) / amount;
}
```

---

## Quick Reference Card

```
BASIS POINTS QUICK REFERENCE

1 bp = 0.01% = 0.0001 decimal
100 bp = 1% = 0.01 decimal
1,000 bp = 10% = 0.1 decimal
10,000 bp = 100% = 1.0 decimal

CALCULATION:
fee = (amount × bp) ÷ 10,000

COMMON VALUES:
• 25 bp = 0.25% (trading)
• 50 bp = 0.50% (bridge)
• 100 bp = 1% (standard)
• 250 bp = 2.5% (premium)
• 1,000 bp = 10% (maximum)

OORT EXAMPLES:
1,000 OORT @ 250 bp = 25 OORT fee
10,000 OORT @ 100 bp = 100 OORT fee
```

This guide provides a comprehensive understanding of basis points in the context of DeFi and smart contracts, specifically tailored for the OORT LayerZero OFT fee system. Use it as a reference when configuring fees, explaining the system to users, or implementing similar functionality.