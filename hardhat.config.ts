// Get the environment configuration from .env file
//
// To make use of automatic environment setup:
// - Duplicate .env.example file and name it .env
// - Fill in the environment variables
import 'dotenv/config'

import 'hardhat-deploy'
import 'hardhat-contract-sizer'
import '@nomiclabs/hardhat-ethers'
//import 'hardhat-deploy-ethers'
import '@layerzerolabs/toolbox-hardhat'
import { HardhatUserConfig, HttpNetworkAccountsUserConfig } from 'hardhat/types'
import './tasks/sendOFT'
import './tasks/vana-simulation'
import "@openzeppelin/hardhat-upgrades";

import { EndpointId } from '@layerzerolabs/lz-definitions'

// Set your preferred authentication method
//
// If you prefer using a mnemonic, set a MNEMONIC environment variable
// to a valid mnemonic
const MNEMONIC = process.env.MNEMONIC

// If you prefer to be authenticated using a private key, set a PRIVATE_KEY environment variable
const PRIVATE_KEY = process.env.PRIVATE_KEY

const accounts: HttpNetworkAccountsUserConfig | undefined = MNEMONIC
    ? { mnemonic: MNEMONIC }
    : PRIVATE_KEY
      ? [PRIVATE_KEY]
      : []

if (accounts == null) {
    console.warn(
        'Could not find MNEMONIC or PRIVATE_KEY environment variables. It will not be possible to execute transactions in your example.'
    )
}

const config: HardhatUserConfig = {
    paths: {
        cache: 'cache/hardhat',
    },
    solidity: {
        compilers: [
            {
                version: '0.8.22',
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
        ],
    },
    networks: {
        'ethereum-mainnet': {
            eid: EndpointId.ETHEREUM_V2_MAINNET,
            url: process.env.RPC_URL_MAINNET || '',
            accounts,
        },
        'bsc-mainnet': {
            eid: EndpointId.BSC_V2_MAINNET,
            url: process.env.RPC_URL_BSC || '',
            accounts,
        },
        'sepolia-testnet': {
            eid: EndpointId.SEPOLIA_V2_TESTNET,
            url: process.env.RPC_URL_SEPOLIA || '',
            accounts,
        },
        'bsc-testnet': {
            eid: EndpointId.BSC_V2_TESTNET,
            url: process.env.RPC_URL_BSC || 'https://data-seed-prebsc-2-s1.bnbchain.org:8545',
            accounts,
        },
        'amoy-testnet': {
            eid: EndpointId.AMOY_V2_TESTNET,
            url: process.env.RPC_URL_AMOY || '',
            accounts,
        },
        // Vana Network Configuration  
        // Note: Vana network uses VANAR LayerZero endpoint ID (40298)
        // This is for simulation purposes - actual deployment should use proper Vana mainnet
        'vana-mainnet': {
            eid: EndpointId.VANAR_V2_TESTNET, // Using VANAR endpoint (40298) for Vana simulation
            url: process.env.RPC_URL_VANA_MAINNET || 'https://rpc.satori.vana.org',
            accounts,
        },
        // Vana Network Fork Configuration
        // This creates a local fork of Vana mainnet for realistic testing without gas costs
        'vana-fork': {
            eid: EndpointId.VANAR_V2_TESTNET, // Using VANAR endpoint (40298) for Vana simulation
            url: 'http://127.0.0.1:8545', // Local hardhat fork
            accounts,
            forking: {
                url: process.env.RPC_URL_VANA_MAINNET || 'https://rpc.satori.vana.org',
                blockNumber: undefined, // Fork from latest block
            },
            allowUnlimitedContractSize: true,
        },
        hardhat: {
            // Need this for testing because TestHelperOz5.sol is exceeding the compiled contract size limit
            allowUnlimitedContractSize: true,
        },
    },
    namedAccounts: {
        deployer: {
            default: '', // wallet address of index[0], of the mnemonic in .env
        },
        proxyOwner: ''
    },
}

export default config
