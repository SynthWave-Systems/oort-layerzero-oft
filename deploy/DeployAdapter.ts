import { Contract } from 'ethers'
import { type DeployFunction } from 'hardhat-deploy/types'

import { getDeploymentAddressAndAbi } from '@layerzerolabs/lz-evm-sdk-v2'
import { getNamedAccounts } from 'hardhat'

const contractName = 'OORTOFTUpgradeable'

// Network-specific configurations
const networkConfigs = {
    'ethereum-mainnet': {
        tokenAddress: '0x5651fA7a726B9Ec0cAd00Ee140179912B6E73599',
        endpointAddress: '0x1a44076050125825900e736c501f859c50fE728c',
    },
    'bsc-mainnet': {
        tokenAddress: '0x5651fA7a726B9Ec0cAd00Ee140179912B6E73599',
        endpointAddress: '0x1a44076050125825900e736c501f859c50fE728c',
    },
    'sepolia-testnet': {
        tokenAddress: '0x0000000000000000000000000000000000000000', // Placeholder - to be updated
        endpointAddress: '0x6EDCE65403992e310A62460808c4b910D972f10f', // Standard testnet endpoint
    },
    'bsc-testnet': {
        tokenAddress: '0x0000000000000000000000000000000000000000', // Placeholder - to be updated
        endpointAddress: '0x6EDCE65403992e310A62460808c4b910D972f10f', // Standard testnet endpoint
    },
    'amoy-testnet': {
        tokenAddress: '0x0000000000000000000000000000000000000000', // Placeholder - to be updated
        endpointAddress: '0x6EDCE65403992e310A62460808c4b910D972f10f', // Standard testnet endpoint
    },
    'vana-mainnet': {
        tokenAddress: process.env.VANA_TOKEN_ADDRESS || '0x0000000000000000000000000000000000000000', // Must be set for deployment
        endpointAddress: '0x1a44076050125825900e736c501f859c50fE728c', // Standard mainnet endpoint (to be confirmed)
    }
}

const deploy: DeployFunction = async (hre) => {
    const { deploy } = hre.deployments
    const {deployer, proxyOwner} = await getNamedAccounts();
    console.log(`deploying ${contractName} on network: ${hre.network.name} with ${deployer}`)

    // Get network-specific configuration
    const networkConfig = networkConfigs[hre.network.name as keyof typeof networkConfigs]
    if (!networkConfig) {
        throw new Error(`No configuration found for network: ${hre.network.name}. Please add it to networkConfigs.`)
    }

    console.log(`Using token address: ${networkConfig.tokenAddress}`)
    console.log(`Using endpoint address: ${networkConfig.endpointAddress}`)

    // Validate token address is set
    if (networkConfig.tokenAddress === '0x0000000000000000000000000000000000000000') {
        console.warn(`⚠️  WARNING: Token address not set for ${hre.network.name}!`)
        console.warn(`   Please set the appropriate token address in the deployment configuration`)
        console.warn(`   or set the VANA_TOKEN_ADDRESS environment variable for Vana networks.`)
    }

    // Try to get LayerZero endpoint from SDK (fallback to manual config)
    let endpointAddress = networkConfig.endpointAddress
    try {
        const { address } = getDeploymentAddressAndAbi(hre.network.name, 'EndpointV2')
        if (address && address !== '0x0000000000000000000000000000000000000000') {
            endpointAddress = address
            console.log(`Using LayerZero SDK endpoint: ${address}`)
        }
    } catch (e) {
        console.log(`LayerZero SDK endpoint not found for ${hre.network.name}, using manual config: ${endpointAddress}`)
    }

    try {
        const deployments = await hre.deployments.all()
        const proxy = deployments['OORTOFTUpgradeable']
        if (proxy) {
            console.log(`Proxy: ${proxy.address}`)
        }
    } catch (e) {
        console.log(`Proxy not found`)
    }

    await deploy(contractName, {
        from: deployer,
        args: [networkConfig.tokenAddress, endpointAddress],
        log: true,
        waitConfirmations: 1,
        skipIfAlreadyDeployed: true,
        proxy: {
            owner: deployer,
            proxyContract: 'UUPS',
            execute: {
                init: {
                    methodName: 'initialize',
                    args: [deployer],
                },
            },
        },
    })
}

deploy.tags = [contractName]

export default deploy
