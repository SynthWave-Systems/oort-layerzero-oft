import { task } from 'hardhat/config'

task('vana:simulate', 'Run Vana network deployment simulation')
    .setDescription('Simulates the deployment of OORTOFTUpgradeable contract to Vana network without actual deployment')
    .setAction(async (taskArgs, hre) => {
        console.log('🚀 Starting Vana Network Deployment Simulation...\n')
        
        try {
            const { runVanaSimulation } = await import('../scripts/vana-simulation')
            await runVanaSimulation()
            console.log('\n✅ Vana simulation completed successfully!')
        } catch (error) {
            console.error('\n❌ Vana simulation failed:', error)
            process.exit(1)
        }
    })

task('vana:fork', 'Run Vana network fork deployment simulation')
    .setDescription('Uses Hardhat fork to create local Vana mainnet fork and performs real deployment testing')
    .setAction(async (taskArgs, hre) => {
        console.log('🚀 Starting Vana Network Fork Simulation...\n')
        
        // Ensure we're using the vana-fork network
        if (hre.network.name !== 'vana-fork') {
            console.error('❌ This task must be run with --network vana-fork')
            console.log('💡 Use: hardhat vana:fork --network vana-fork')
            process.exit(1)
        }
        
        try {
            const { runVanaForkSimulation } = await import('../scripts/vana-fork-simulation')
            await runVanaForkSimulation()
            console.log('\n✅ Vana fork simulation completed successfully!')
        } catch (error) {
            console.error('\n❌ Vana fork simulation failed:', error)
            process.exit(1)
        }
    })

task('vana:info', 'Display Vana network configuration information')
    .setDescription('Shows the current Vana network configuration for LayerZero deployment')
    .setAction(async (taskArgs, hre) => {
        const { EndpointId } = await import('@layerzerolabs/lz-definitions')
        
        console.log('📋 VANA NETWORK CONFIGURATION')
        console.log('=' .repeat(40))
        console.log(`Network Name: vana-mainnet`)
        console.log(`Fork Network: vana-fork`)
        console.log(`Chain ID: 1480`)
        console.log(`LayerZero Endpoint ID: ${EndpointId.VANAR_V2_TESTNET} (40298)`)
        console.log(`RPC URL: https://rpc.satori.vana.org`)
        console.log('')
        console.log('🔍 Available LayerZero Endpoints:')
        console.log(`VANAR_TESTNET: ${EndpointId.VANAR_TESTNET}`)
        console.log(`VANAR_V2_TESTNET: ${EndpointId.VANAR_V2_TESTNET}`)
        console.log('')
        console.log('📝 Simulation Types:')
        console.log('• Pure Simulation: Uses mock data, no network connection')
        console.log('• Fork Simulation: Creates local fork of Vana mainnet')
        console.log('')
        console.log('🚀 Available Commands:')
        console.log('• npm run vana:info - Show this information')
        console.log('• npm run vana:simulate - Run pure simulation')
        console.log('• npm run vana:fork - Run fork simulation')
        console.log('=' .repeat(40))
    })