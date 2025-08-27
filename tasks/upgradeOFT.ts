import { task } from 'hardhat/config'
import { upgrades } from 'hardhat'

task('upgrade-oft', 'Upgrade OFT proxy to add fee functionality')
    .addParam('proxy', 'Proxy contract address to upgrade')
    .addOptionalParam('network', 'Target network', 'localhost')
    .addFlag('verify', 'Only verify upgrade compatibility without executing')
    .addFlag('prepare', 'Only prepare new implementation without upgrading')
    .setAction(async (taskArgs, hre) => {
        const { ethers } = hre;
        const [signer] = await ethers.getSigners();
        
        console.log(`🔄 OFT Upgrade Tool`);
        console.log(`📍 Proxy: ${taskArgs.proxy}`);
        console.log(`🌐 Network: ${hre.network.name}`);
        console.log(`👤 Signer: ${signer.address}`);
        
        const OORTOFTUpgradeableWithFees = await ethers.getContractFactory('OORTOFTUpgradeableWithFees');
        
        try {
            // Always validate first
            console.log('\n1️⃣ Validating upgrade...');
            await upgrades.validateUpgrade(taskArgs.proxy, OORTOFTUpgradeableWithFees);
            console.log('✅ Upgrade validation passed');
            
            if (taskArgs.verify) {
                console.log('🔍 Verification complete - upgrade is safe!');
                return;
            }
            
            if (taskArgs.prepare) {
                console.log('\n2️⃣ Preparing implementation...');
                const newImpl = await upgrades.prepareUpgrade(taskArgs.proxy, OORTOFTUpgradeableWithFees);
                console.log(`✅ New implementation prepared: ${newImpl}`);
                return;
            }
            
            // Full upgrade
            console.log('\n2️⃣ Executing upgrade...');
            const upgraded = await upgrades.upgradeProxy(taskArgs.proxy, OORTOFTUpgradeableWithFees);
            await upgraded.deployed();
            
            console.log('✅ Upgrade completed!');
            console.log(`📍 Proxy address (unchanged): ${upgraded.address}`);
            
            // Verify new functionality
            const version = await upgraded.version();
            console.log(`📊 Version: ${version.major}.${version.minor}.${version.patch}`);
            
            const feeCollector = await upgraded.feeCollector();
            console.log(`💰 Fee collector: ${feeCollector} (configure this next)`);
            
            console.log('\n🎉 Upgrade successful!');
            console.log('📋 Next steps:');
            console.log(`1. Deploy fee collector: npx hardhat deploy --tags OFTFeeCollector --network ${hre.network.name}`);
            console.log(`2. Configure fees: npx hardhat manage-fees --contract ${taskArgs.proxy} --collector <FEE_COLLECTOR_ADDRESS>`);
            
        } catch (error) {
            console.error('❌ Upgrade failed:', error.message);
            
            if (error.message.includes('storage')) {
                console.log('\n💡 Storage layout incompatibility detected');
                console.log('Check that new variables are only appended, not inserted');
            }
            
            throw error;
        }
    })