# Vana Network Fork Simulation

This directory contains enhanced simulation tools for the Vana network integration, including both pure simulation and Hardhat fork capabilities.

## Fork vs Pure Simulation

### Pure Simulation (`vana:simulate`)
- Uses mock data and addresses
- No network connection required
- Fast execution
- Shows what deployment would look like

### Fork Simulation (`vana:fork`) 
- Creates local fork of Vana mainnet using Hardhat
- Uses real network state and data
- Actual contract deployment and testing
- No gas costs (local fork)
- More realistic testing environment

## Usage

### Quick Commands

```bash
# View network configuration
npm run vana:info

# Run pure simulation (mock data)
npm run vana:simulate

# Run fork simulation (real network fork)
npm run vana:fork
```

### Fork Simulation Benefits

The fork simulation provides several advantages:

1. **Real Network State**: Forks actual Vana mainnet with current block data
2. **Actual Deployment**: Deploys real contracts to the fork
3. **Zero Costs**: No gas fees since it's a local fork
4. **LayerZero Testing**: Tests against real LayerZero endpoints
5. **Upgrade Testing**: Real UUPS proxy upgrade validation
6. **Contract Interactions**: Actual function calls with real responses

### Sample Fork Output

```
🌟 VANA NETWORK FORK DEPLOYMENT SIMULATION 🌟

📍 Network: vana-fork (Forked from Vana Mainnet)
🔗 Connected to network: unknown (Chain ID: 1480)
📦 Current block number: 8234567

✅ REAL DEPLOYMENT ON FORK: SUCCESS
📍 Contract Address: 0x1234...
⛽ Gas Used: 2,458,123

✅ REAL INTERACTIONS ON FORK: SUCCESS
✓ version() = (1, 0, 0)
✓ owner() = 0xdeployer...
✓ Estimated Cross-chain Fee: 0.012 ETH

✅ REAL UPGRADE TESTING ON FORK: SUCCESS
✓ Upgrade validation passed
```

## Configuration

The fork configuration is automatically set up in `hardhat.config.ts`:

```typescript
'vana-fork': {
    eid: EndpointId.VANAR_V2_TESTNET,
    url: 'http://127.0.0.1:8545',
    forking: {
        url: process.env.RPC_URL_VANA_MAINNET || 'https://rpc.satori.vana.org',
        blockNumber: undefined, // Fork from latest block
    },
    allowUnlimitedContractSize: true,
}
```

## Environment Variables

Add to your `.env` file:

```bash
# Vana Network RPC (used for forking)
RPC_URL_VANA_MAINNET=https://rpc.satori.vana.org

# Optional: Specific block to fork from
VANA_FORK_BLOCK_NUMBER=8234567
```

## Safety Features

- ✅ **Local Fork Only**: No actual mainnet transactions
- ✅ **Funded Accounts**: Test accounts automatically funded on fork
- ✅ **Real Contract Testing**: Deploy and test actual contracts
- ✅ **Upgrade Validation**: Test UUPS upgrade compatibility
- ✅ **Cross-Chain Quotes**: Test LayerZero fee estimation

## Troubleshooting

### Common Issues

1. **RPC Connection**: Ensure Vana RPC is accessible
2. **Contract Compilation**: Run `npm run compile` before simulation
3. **Network Selection**: Use `--network vana-fork` for fork commands

### Commands for Debugging

```bash
# Check if contracts are compiled
npm run compile

# Verify network configuration
npm run vana:info

# Test with verbose output
npx hardhat vana:fork --network vana-fork --verbose
```

This fork simulation provides the most realistic testing environment for Vana network deployment without any costs or risks.