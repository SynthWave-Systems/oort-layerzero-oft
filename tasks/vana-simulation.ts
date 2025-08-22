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

task('vana:info', 'Display Vana network configuration information')
    .setDescription('Shows the current Vana network configuration for LayerZero deployment')
    .setAction(async (taskArgs, hre) => {
        const { EndpointId } = await import('@layerzerolabs/lz-definitions')
        
        console.log('📋 VANA NETWORK CONFIGURATION')
        console.log('=' .repeat(40))
        console.log(`Network Name: vana-mainnet`)
        console.log(`Chain ID: 1480`)
        console.log(`LayerZero Endpoint ID: ${EndpointId.VANAR_V2_TESTNET} (40298)`)
        console.log(`RPC URL: https://rpc.satori.vana.org`)
        console.log('')
        console.log('🔍 Available LayerZero Endpoints:')
        console.log(`VANAR_TESTNET: ${EndpointId.VANAR_TESTNET}`)
        console.log(`VANAR_V2_TESTNET: ${EndpointId.VANAR_V2_TESTNET}`)
        console.log('')
        console.log('📝 Note: Using VANAR endpoint (40298) for Vana simulation')
        console.log('=' .repeat(40))
    })