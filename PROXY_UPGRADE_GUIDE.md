# 🔄 Proxy Upgrade Guide: Adding Fees to Existing OFT Contracts

This guide explains how to upgrade your existing OFT proxy contracts to add fee functionality **without changing the proxy address**. Your users and integrations continue using the same contract address.

## 📋 Overview

OpenZeppelin's proxy pattern (EIP-1967) separates your contract into two parts:
- **Proxy Contract**: Permanent address that never changes
- **Implementation Contract**: The actual logic that can be upgraded

When you upgrade, only the implementation changes - the proxy address stays the same!

```
User Transactions ──→ Proxy (0xbd26Aa1903b29101B48A27F2CB8A2889FBBEf223) 
                              │
                              ├─ Before: Points to OORTOFTUpgradeable
                              └─ After:  Points to OORTOFTUpgradeableWithFees
```

## 🎯 Current Deployment Status

Based on your deployments, you have:

**Ethereum Mainnet:**
- Proxy Address: `0xbd26Aa1903b29101B48A27F2CB8A2889FBBEf223` ✅ (This stays the same!)
- Current Implementation: `OORTOFTUpgradeable`
- Target Implementation: `OORTOFTUpgradeableWithFees`

## 🛠️ Step-by-Step Upgrade Process

### Step 1: Deploy the Fee Collector Contract

First, deploy the standalone fee collector that will handle fee logic:

```bash
# Deploy fee collector
npx hardhat deploy --tags OFTFeeCollector --network ethereum-mainnet
```

This creates a new `OFTFeeCollector` contract that can be configured and reused across multiple OFT contracts.

### Step 2: Deploy New Implementation Contract

Deploy the new implementation contract (but don't upgrade yet):

```bash
# This deploys just the implementation, not a new proxy
npx hardhat run scripts/deploy-implementation.js --network ethereum-mainnet
```

Create `scripts/deploy-implementation.js`:

```javascript
const { ethers, upgrades } = require('hardhat');

async function main() {
    // Get the contract factory
    const OORTOFTUpgradeableWithFees = await ethers.getContractFactory('OORTOFTUpgradeableWithFees');
    
    // Deploy new implementation (prepare for upgrade)
    console.log('Deploying new implementation...');
    const newImplementation = await upgrades.prepareUpgrade(
        '0xbd26Aa1903b29101B48A27F2CB8A2889FBBEf223', // Your existing proxy address
        OORTOFTUpgradeableWithFees
    );
    
    console.log('New implementation deployed at:', newImplementation);
    console.log('✅ Ready for upgrade!');
}

main().catch(console.error);
```

### Step 3: Verify Upgrade Compatibility

Before upgrading, verify the new implementation is compatible:

```bash
npx hardhat run scripts/verify-upgrade.js --network ethereum-mainnet
```

Create `scripts/verify-upgrade.js`:

```javascript
const { ethers, upgrades } = require('hardhat');

async function main() {
    const currentProxy = '0xbd26Aa1903b29101B48A27F2CB8A2889FBBEf223';
    
    // Validate upgrade safety
    const OORTOFTUpgradeableWithFees = await ethers.getContractFactory('OORTOFTUpgradeableWithFees');
    
    console.log('Validating upgrade compatibility...');
    await upgrades.validateUpgrade(currentProxy, OORTOFTUpgradeableWithFees);
    console.log('✅ Upgrade is safe!');
}

main().catch(console.error);
```

### Step 4: Perform the Upgrade

Now upgrade the proxy to point to the new implementation:

```bash
npx hardhat run scripts/upgrade-proxy.js --network ethereum-mainnet
```

Create `scripts/upgrade-proxy.js`:

```javascript
const { ethers, upgrades } = require('hardhat');

async function main() {
    const proxyAddress = '0xbd26Aa1903b29101B48A27F2CB8A2889FBBEf223';
    
    console.log('Upgrading proxy at:', proxyAddress);
    
    // Get the new contract factory
    const OORTOFTUpgradeableWithFees = await ethers.getContractFactory('OORTOFTUpgradeableWithFees');
    
    // Perform the upgrade
    const upgraded = await upgrades.upgradeProxy(proxyAddress, OORTOFTUpgradeableWithFees);
    await upgraded.deployed();
    
    console.log('✅ Proxy upgraded successfully!');
    console.log('📍 Proxy address (unchanged):', upgraded.address);
    console.log('🔄 New implementation active');
    
    // Verify the upgrade worked
    const version = await upgraded.version();
    console.log('📊 Contract version:', `${version.major}.${version.minor}.${version.patch}`);
}

main().catch(console.error);
```

### Step 5: Configure Fee System

After upgrading, configure the fee collector:

```bash
# Set the fee collector contract
npx hardhat manage-fees \
  --contract 0xbd26Aa1903b29101B48A27F2CB8A2889FBBEf223 \
  --network ethereum-mainnet \
  --collector <FEE_COLLECTOR_ADDRESS>

# Configure fees (example: 2.5% default fee)
npx hardhat manage-fee-collector \
  --collector <FEE_COLLECTOR_ADDRESS> \
  --set-default-fee 250 \
  --set-recipient <YOUR_FEE_RECIPIENT_ADDRESS> \
  --network ethereum-mainnet
```

## 🔍 Verification Steps

### 1. Verify Proxy Address Unchanged

```bash
# The proxy address should still be the same
echo "Expected: 0xbd26Aa1903b29101B48A27F2CB8A2889FBBEf223"
npx hardhat console --network ethereum-mainnet
```

In console:
```javascript
const oft = await ethers.getContractAt('OORTOFTUpgradeableWithFees', '0xbd26Aa1903b29101B48A27F2CB8A2889FBBEf223');
console.log('Contract address:', oft.address); // Should be unchanged
const version = await oft.version();
console.log('Version:', `${version.major}.${version.minor}.${version.patch}`); // Should be 1.1.0
```

### 2. Test New Fee Functionality

```bash
# Test fee preview (should work after upgrade)
npx hardhat manage-fees \
  --contract 0xbd26Aa1903b29101B48A27F2CB8A2889FBBEf223 \
  --preview-fee "30101:1000000000000000000" \
  --network ethereum-mainnet
```

### 3. Verify All Old Functions Still Work

Test that existing functionality remains intact:
- Token transfers
- LayerZero cross-chain functionality  
- Owner functions
- Balance queries

## 🚨 Important Safety Notes

### Pre-Upgrade Checklist

- [ ] **Backup**: Document all current contract settings
- [ ] **Test Environment**: Test the full upgrade on testnet first
- [ ] **Access Control**: Ensure you have owner privileges on the proxy
- [ ] **Validation**: Run `upgrades.validateUpgrade()` to check compatibility
- [ ] **Gas Estimation**: Ensure sufficient gas for upgrade transaction

### Post-Upgrade Checklist

- [ ] **Verify Address**: Confirm proxy address unchanged
- [ ] **Test Basic Functions**: Ensure transfers work normally
- [ ] **Configure Fees**: Set up fee collector and parameters  
- [ ] **Monitor**: Watch for any unusual behavior
- [ ] **Notify Integrators**: Inform partners about new fee functionality

## 📝 Complete Example Script

Here's a complete upgrade script:

```javascript
const { ethers, upgrades } = require('hardhat');

async function main() {
    const proxyAddress = '0xbd26Aa1903b29101B48A27F2CB8A2889FBBEf223';
    const [deployer] = await ethers.getSigners();
    
    console.log('🚀 Starting OFT upgrade process...');
    console.log('📍 Proxy address:', proxyAddress);
    console.log('👤 Deployer:', deployer.address);
    
    // Step 1: Validate current state
    console.log('\n1️⃣ Validating current state...');
    const currentOFT = await ethers.getContractAt('OORTOFTUpgradeable', proxyAddress);
    const owner = await currentOFT.owner();
    console.log('✅ Current owner:', owner);
    
    // Step 2: Validate upgrade
    console.log('\n2️⃣ Validating upgrade compatibility...');
    const NewOFT = await ethers.getContractFactory('OORTOFTUpgradeableWithFees');
    await upgrades.validateUpgrade(proxyAddress, NewOFT);
    console.log('✅ Upgrade validation passed');
    
    // Step 3: Perform upgrade
    console.log('\n3️⃣ Performing upgrade...');
    const upgraded = await upgrades.upgradeProxy(proxyAddress, NewOFT);
    await upgraded.deployed();
    console.log('✅ Upgrade completed!');
    
    // Step 4: Verify upgrade
    console.log('\n4️⃣ Verifying upgrade...');
    console.log('📍 Contract address (should be unchanged):', upgraded.address);
    const version = await upgraded.version();
    console.log('📊 New version:', `${version.major}.${version.minor}.${version.patch}`);
    
    // Step 5: Test new functionality
    console.log('\n5️⃣ Testing new functionality...');
    const feeCollectorAddress = await upgraded.feeCollector();
    console.log('💰 Fee collector (should be zero initially):', feeCollectorAddress);
    
    console.log('\n🎉 Upgrade completed successfully!');
    console.log('🔗 Your OFT contract is now ready for fee configuration');
    console.log('📖 Next steps: Deploy fee collector and configure fees');
}

main().catch(console.error);
```

## 💡 Key Benefits

✅ **No Address Change**: Users continue using the same contract address  
✅ **No Migration**: Existing balances and state preserved  
✅ **Backward Compatible**: All existing functions continue to work  
✅ **Gradual Rollout**: Enable fees when ready, not immediately  
✅ **Configurable**: Adjust fees per destination as needed  

## 🔧 Troubleshooting

**Issue**: "Upgrade validation failed"
- **Solution**: Check storage layout compatibility between old and new implementations

**Issue**: "Not authorized to upgrade"  
- **Solution**: Ensure you're using the proxy admin account

**Issue**: "Fee collector not set"
- **Solution**: Deploy fee collector first, then configure it post-upgrade

**Issue**: "Transaction reverted"
- **Solution**: Check gas limits and ensure proper initialization

## 📚 Additional Resources

- [OpenZeppelin Upgrades Plugin](https://docs.openzeppelin.com/upgrades-plugins/1.x/)
- [EIP-1967 Proxy Storage Slots](https://eips.ethereum.org/EIPS/eip-1967)
- [LayerZero OFT Documentation](https://docs.layerzero.network/)

---

*This guide ensures you can add advanced fee functionality to your existing OFT deployments without disrupting current users or requiring contract migration.*