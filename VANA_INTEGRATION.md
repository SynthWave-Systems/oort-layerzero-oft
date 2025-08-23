# Vana Network Integration

This repository now supports deploying the OORT LayerZero OFT to the Vana network. 

## Networks Supported

### Testnets
- Ethereum Sepolia (`sepolia-testnet`)
- BSC Testnet (`bsc-testnet`) 
- Polygon Amoy (`amoy-testnet`)

### Mainnets
- Ethereum Mainnet (`ethereum-mainnet`)
- BSC Mainnet (`bsc-mainnet`)

# Vana Network Integration

This repository now supports deploying the OORT LayerZero OFT to the Vana network. 

## Networks Supported

### Testnets
- Ethereum Sepolia (`sepolia-testnet`)
- BSC Testnet (`bsc-testnet`) 
- Polygon Amoy (`amoy-testnet`)

### Mainnets
- Ethereum Mainnet (`ethereum-mainnet`)
- BSC Mainnet (`bsc-mainnet`)
- **Vana Mainnet (`vana-mainnet`)** - Mainnet-only network

## Vana Network Details

✅ **Important Note**: Vana is a mainnet-only network on LayerZero. There is no testnet available for Vana.

### Available Endpoints in LayerZero Definitions
- **Vana Mainnet Endpoint**: `30330` - Production network endpoint for Vana (ISLANDER_V2_MAINNET)
- **VANAR_TESTNET**: `10298` - Legacy V1 endpoint (deprecated)
- **VANAR_V2_TESTNET**: `40298` - Legacy V2 testnet endpoint (deprecated)

### Current Configuration
The repository is configured to use:
- **Network Name**: `vana-mainnet`
- **LayerZero Endpoint ID**: `30330` (Vana Mainnet - production network)
- **RPC URL**: `https://rpc.satori.vana.org`

📝 **Configuration Note**: This endpoint connects to Vana's production mainnet network for omnichain operations.

## Environment Setup

Add these environment variables to your `.env` file:

```
# Required for all networks
PRIVATE_KEY=your_private_key_here

# Vana Network RPC URL (mainnet-only network)
RPC_URL_VANA_MAINNET=https://rpc.satori.vana.org

# Token address for Vana network (update with actual address)
VANA_TOKEN_ADDRESS=0x... # Replace with actual Vana token address
```

## Deployment

### Deploy to Vana Network

1. Update the deployment configuration in `deploy/DeployAdapter.ts` to set the correct token address for Vana
2. Set the `VANA_TOKEN_ADDRESS` environment variable to the actual token address
3. Run deployment:

```bash
npx hardhat deploy --network vana-mainnet
```

### Cross-chain Configuration

The OFT configuration files are:
- `oft_config_mainnet.ts` - includes Vana network connections (mainnet-only)
- `oft_config_testnet.ts` - testnet networks only (Vana not included as it has no testnet)

## Cross-chain Bridge Operations

To send tokens between networks including Vana:

```bash
npx hardhat lz:oft:send \
  --contract-a <contract_address_on_source> \
  --recipient-b <recipient_address_on_destination> \
  --network-a ethereum-mainnet \
  --network-b vana-mainnet \
  --amount <amount_in_token_decimals> \
  --private-key <your_private_key>
```

## Important Notes

1. **Mainnet-Only Network**: Vana is a mainnet-only network on LayerZero - no testnet is available
2. **Endpoint Validation**: Uses Vana Mainnet endpoint (30330) for production network operations
3. **Token Address**: Update the token address in `deploy/DeployAdapter.ts` and environment variables for Vana network deployment
4. **LayerZero Endpoint**: Verify that LayerZero V2 endpoint is properly deployed on Vana network
5. **DVN Configuration**: Update DVN (Decentralized Verifier Network) addresses in OFT configuration when Vana-specific DVNs are available

## Configuration Files Modified

- `hardhat.config.ts` - Added Vana mainnet configuration using LayerZero endpoint
- `deploy/DeployAdapter.ts` - Enhanced with network-specific deployment settings for Vana mainnet
- `oft_config_mainnet.ts` - Added Vana network to mainnet configuration
- `oft_config_testnet.ts` - Removed Vana (since it's mainnet-only)
- `.env.example` - Updated Vana-specific environment variables to reflect mainnet naming

## Next Steps

1. Set appropriate token address for Vana deployment
2. Test deployment on the configured mainnet network
3. Configure cross-chain connections using `oft_config_mainnet.ts`
4. Set up DVN configurations specific to Vana network when available