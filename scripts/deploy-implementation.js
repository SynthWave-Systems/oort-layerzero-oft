const { ethers, upgrades } = require('hardhat');

async function main() {
    const proxyAddress = '0xbd26Aa1903b29101B48A27F2CB8A2889FBBEf223'; // Ethereum mainnet
    
    console.log('🏗️  Preparing new implementation deployment...');
    console.log('📍 Target proxy:', proxyAddress);
    
    try {
        // Get the contract factory
        const OORTOFTUpgradeableWithFees = await ethers.getContractFactory('OORTOFTUpgradeableWithFees');
        
        console.log('⏳ Deploying new implementation...');
        
        // Deploy new implementation (prepare for upgrade)
        const newImplementation = await upgrades.prepareUpgrade(
            proxyAddress,
            OORTOFTUpgradeableWithFees
        );
        
        console.log('✅ New implementation deployed!');
        console.log('📍 Implementation address:', newImplementation);
        console.log('🔄 Ready for upgrade execution');
        
        // Get current implementation for comparison
        const adminSlot = '0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103';
        const currentAdmin = await ethers.provider.getStorageAt(proxyAddress, adminSlot);
        console.log('🔧 Current proxy admin:', ethers.utils.getAddress('0x' + currentAdmin.slice(26)));
        
        const implSlot = '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc';
        const currentImpl = await ethers.provider.getStorageAt(proxyAddress, implSlot);
        console.log('📜 Current implementation:', ethers.utils.getAddress('0x' + currentImpl.slice(26)));
        console.log('🆕 New implementation:', newImplementation);
        
        console.log('\n📋 Next steps:');
        console.log('1. Verify upgrade compatibility:');
        console.log('   npx hardhat run scripts/verify-upgrade.js --network ethereum-mainnet');
        console.log('2. Execute the upgrade:');
        console.log('   npx hardhat run scripts/upgrade-proxy.js --network ethereum-mainnet');
        
    } catch (error) {
        console.error('❌ Implementation deployment failed:');
        console.error(error.message);
        process.exit(1);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });