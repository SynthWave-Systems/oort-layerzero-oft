const { ethers, upgrades } = require('hardhat');

async function main() {
    const proxyAddress = '0xbd26Aa1903b29101B48A27F2CB8A2889FBBEf223'; // Ethereum mainnet proxy
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
    
    console.log('\n📋 Next Commands:');
    console.log('# 1. Deploy fee collector:');
    console.log('npx hardhat deploy --tags OFTFeeCollector --network ethereum-mainnet');
    console.log('\n# 2. Configure fee collector:');
    console.log(`npx hardhat manage-fees --contract ${proxyAddress} --network ethereum-mainnet --collector <FEE_COLLECTOR_ADDRESS>`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });