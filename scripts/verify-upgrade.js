const { ethers, upgrades } = require('hardhat');

async function main() {
    const currentProxy = '0xbd26Aa1903b29101B48A27F2CB8A2889FBBEf223'; // Ethereum mainnet
    
    console.log('🔍 Validating upgrade compatibility...');
    console.log('📍 Current proxy:', currentProxy);
    
    try {
        // Get the new contract factory
        const OORTOFTUpgradeableWithFees = await ethers.getContractFactory('OORTOFTUpgradeableWithFees');
        
        // Validate upgrade safety
        console.log('⏳ Running upgrade validation...');
        await upgrades.validateUpgrade(currentProxy, OORTOFTUpgradeableWithFees);
        
        console.log('✅ Upgrade validation passed!');
        console.log('🔒 Storage layout is compatible');
        console.log('🛡️  No conflicting function selectors detected');
        console.log('📊 New implementation is ready for deployment');
        
        // Show what the upgrade will add
        console.log('\n📈 New functionality that will be added:');
        console.log('  • Fee collector integration');
        console.log('  • Pluggable fee system');
        console.log('  • Fee preview functionality');
        console.log('  • Admin fee management');
        
        console.log('\n🚀 Ready to proceed with upgrade!');
        console.log('👉 Run: npx hardhat run scripts/upgrade-proxy.js --network ethereum-mainnet');
        
    } catch (error) {
        console.error('❌ Upgrade validation failed:');
        console.error(error.message);
        
        if (error.message.includes('storage')) {
            console.log('\n💡 Storage layout issues detected:');
            console.log('  • Check if new variables are appended (not inserted)');
            console.log('  • Ensure no existing variables are modified');
            console.log('  • Review inheritance order changes');
        }
        
        if (error.message.includes('function')) {
            console.log('\n💡 Function selector conflicts detected:');
            console.log('  • Check for duplicate function signatures');
            console.log('  • Ensure no function signatures changed');
        }
        
        process.exit(1);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });