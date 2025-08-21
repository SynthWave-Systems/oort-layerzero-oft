# Vana Network Integration

This repository now supports deploying the OORT LayerZero OFT to the Vana network. 

## Networks Supported

### Testnets
- Ethereum Sepolia (`sepolia-testnet`)
- BSC Testnet (`bsc-testnet`) 
- Polygon Amoy (`amoy-testnet`)
- **Vana Satori Testnet (`vana-testnet`)** - *NEW*

### Mainnets
- Ethereum Mainnet (`ethereum-mainnet`)
- BSC Mainnet (`bsc-mainnet`)
- *Vana Mainnet (coming soon when LayerZero support is available)*

## Vana Network Details

### Vana Satori Testnet
- **Network Name**: `vana-testnet`
- **LayerZero Endpoint ID**: `40298` (VANAR_V2_TESTNET)
- **RPC URL**: `https://rpc.satori.vana.org`
- **Chain ID**: `14801`

### Vana Mainnet (Future)
- **Network Name**: `vana-mainnet` (to be enabled)
- **LayerZero Endpoint ID**: TBD (estimated: `30298`)
- **RPC URL**: `https://rpc.vana.org`
- **Chain ID**: `1480`

## Environment Setup

Add these environment variables to your `.env` file:

```
# Required for all networks
PRIVATE_KEY=your_private_key_here

# Vana Network RPC URLs (optional, defaults provided)
RPC_URL_VANA_TESTNET=https://rpc.satori.vana.org
```

## Deployment

### Deploy to Vana Testnet

1. Update the deployment configuration in `deploy/DeployAdapter.ts` to set the correct token address for Vana testnet
2. Run deployment:

```bash
npx hardhat deploy --network vana-testnet
```

### Cross-chain Configuration

The OFT configuration files are:
- `oft_config_testnet.ts` - includes Vana testnet connections
- `oft_config_mainnet.ts` - for mainnet deployments

## Cross-chain Bridge Operations

To send tokens between networks including Vana:

```bash
npx hardhat lz:oft:send \
  --contract-a <contract_address_on_source> \
  --recipient-b <recipient_address_on_destination> \
  --network-a sepolia-testnet \
  --network-b vana-testnet \
  --amount <amount_in_token_decimals> \
  --private-key <your_private_key>
```

## Important Notes

1. **Token Address**: Update the token address in `deploy/DeployAdapter.ts` for Vana network deployment
2. **LayerZero Endpoint**: Verify that LayerZero V2 endpoint is properly deployed on Vana network
3. **DVN Configuration**: Update DVN (Decentralized Verifier Network) addresses in OFT configuration when Vana-specific DVNs are available
4. **Mainnet Support**: Vana mainnet will be added when LayerZero officially supports it with a dedicated endpoint ID

## Configuration Files Modified

- `hardhat.config.ts` - Added Vana network configuration
- `deploy/DeployAdapter.ts` - Enhanced with network-specific deployment settings
- `oft_config_testnet.ts` - New testnet configuration including Vana
- `.env.example` - Added Vana RPC URL variables

## Next Steps

1. Set appropriate token address for Vana deployment
2. Test deployment on Vana testnet
3. Configure cross-chain connections between Vana and existing networks
4. Monitor LayerZero announcements for Vana mainnet support