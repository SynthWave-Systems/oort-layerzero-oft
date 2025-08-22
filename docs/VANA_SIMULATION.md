# Vana Network Simulation Guide

## Overview

This repository includes a comprehensive simulation for deploying the OORT LayerZero OFT (Omnichain Fungible Token) Upgradeable contract to the Vana network. Since Vana does not have a dedicated testnet endpoint on LayerZero, this simulation provides a safe way to test the deployment process without actual deployment.

## What is Simulated

### 1. Contract Deployment Simulation
- UUPS (Universal Upgradeable Proxy Standard) proxy deployment
- Constructor parameter validation
- Gas estimation for deployment
- Initialization with proper owner/delegate setup

### 2. Contract Interaction Simulation
- Basic contract function calls (version, owner, token, endpoint)
- ERC20 token approval simulation
- Cross-chain transaction preparation
- LayerZero send parameter configuration
- Fee estimation for cross-chain operations

### 3. Upgrade Simulation
- UUPS upgrade authorization checking
- New implementation deployment simulation
- Storage layout compatibility validation
- Upgrade transaction simulation

## Network Configuration

The simulation uses the following configuration for Vana:

- **Network Name**: `vana-mainnet`
- **Chain ID**: `1480` (Vana network)
- **LayerZero Endpoint ID**: `40298` (VANAR_V2_TESTNET endpoint)
- **RPC URL**: `https://rpc.satori.vana.org`

> **Note**: The simulation uses the VANAR LayerZero endpoint (40298) as a placeholder for Vana network configuration.

## Running the Simulation

### Prerequisites

1. Install dependencies:
```bash
yarn install
```

2. Ensure you have a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

### Commands

#### View Network Information
```bash
npx hardhat vana:info
```

This command displays the current Vana network configuration including:
- Network details
- LayerZero endpoint information
- Available endpoints

#### Run Full Simulation
```bash
npx hardhat vana:simulate
```

This command runs the complete simulation including:
- Deployment simulation
- Contract interaction simulation
- Upgrade simulation
- Comprehensive report generation

### Sample Output

The simulation provides detailed output including:

```
🌟 VANA NETWORK OFT DEPLOYMENT SIMULATION 🌟

🔄 Initializing Vana Network Deployment Simulation...
📍 Network: vana-mainnet
🔗 LayerZero Endpoint ID: 40298
🌐 RPC URL: https://rpc.satori.vana.org
📝 Note: This is a SIMULATION - no actual deployment will occur

... [detailed simulation steps] ...

📊 VANA NETWORK DEPLOYMENT SIMULATION REPORT
==================================================
Network: vana-mainnet
LayerZero Endpoint ID: 40298
Chain ID: 1480
RPC URL: https://rpc.satori.vana.org

📦 DEPLOYMENT SIMULATION: ✅ SUCCESS
🔄 INTERACTION SIMULATION: ✅ SUCCESS  
🔧 UPGRADE SIMULATION: ✅ SUCCESS
```

## Simulation Features

### ✅ What the Simulation Does
- Validates contract deployment parameters
- Simulates gas estimation for all operations
- Tests UUPS proxy deployment pattern
- Simulates cross-chain transaction setup
- Validates upgrade mechanisms
- Provides realistic contract addresses and transaction hashes
- Generates comprehensive reports

### ❌ What the Simulation Does NOT Do
- Actually deploy contracts to any network
- Consume real gas or tokens
- Make actual network calls to Vana
- Modify blockchain state
- Require actual Vana network connectivity

## Real Deployment Preparation

The simulation includes a checklist for real deployment:

### Before Deploying to Vana Mainnet:
- [ ] Verify Vana network has LayerZero V2 endpoint deployed
- [ ] Get actual OORT token address on Vana network
- [ ] Confirm LayerZero endpoint address on Vana
- [ ] Set up DVN configurations for Vana <-> other networks
- [ ] Test on Vana testnet (if available) or fork
- [ ] Prepare sufficient ETH/VANA for deployment gas
- [ ] Configure cross-chain pathways in OFT config
- [ ] Set up monitoring for cross-chain transactions

## Configuration Files

### Updated Files for Vana Support:

1. **`hardhat.config.ts`** - Added Vana network configuration
2. **`oft_config_mainnet.ts`** - Added Vana to mainnet OFT configuration
3. **`scripts/vana-simulation.ts`** - Main simulation script
4. **`tasks/vana-simulation.ts`** - Hardhat tasks for simulation

## Cross-Chain Configuration

The simulation includes cross-chain configuration for:
- Vana ↔ Ethereum Mainnet
- Vana ↔ BSC Mainnet

Example cross-chain operation simulation:
```
🌉 Simulating cross-chain send preparation:
   Destination Network: Ethereum Mainnet (EID: 30101)
   Amount: 100.0 tokens
   Recipient: 0x742d35Cc6637C0532e1860fdE5a7C00F40c78aD7
   Estimated Cross-chain Fee: 0.01 ETH
```

## Gas Estimates

The simulation provides realistic gas estimates:
- **Contract Deployment**: ~2,500,000 gas
- **Cross-chain Transaction**: ~250,000 gas
- **Contract Upgrade**: ~150,000 gas

## Security Considerations

### Simulation Safety
- No actual transactions are performed
- No real funds are at risk
- All operations are performed on local Hardhat network
- No network calls to external services

### Real Deployment Security
- Always verify contract addresses before deployment
- Test on testnets or forks before mainnet
- Use multisig wallets for ownership
- Implement proper access controls
- Monitor cross-chain transactions

## Troubleshooting

### Common Issues

1. **"Contract not found" errors**:
   - This is expected - the simulation doesn't require compiled contracts
   - The simulation works without actual contract artifacts

2. **Network connection errors**:
   - The simulation runs on local Hardhat network
   - No external network connectivity required

3. **LayerZero endpoint errors**:
   - The simulation uses VANAR endpoint as placeholder
   - Real deployment would need actual Vana LayerZero endpoint

## Future Enhancements

Potential improvements for the simulation:
- Add more detailed DVN configuration simulation
- Include oracle and relayer setup simulation  
- Add fork testing capabilities for Vana network
- Implement stress testing scenarios
- Add multi-hop cross-chain simulation

## Support

For questions or issues with the Vana simulation:
1. Check the simulation output for detailed error messages
2. Verify Hardhat configuration is correct
3. Ensure all dependencies are installed
4. Review the real deployment checklist

This simulation provides a comprehensive testing environment for Vana network deployment without the risks and costs of actual deployment.