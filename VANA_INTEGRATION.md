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

## Vana Network Details

⚠️ **Important Note**: Based on LayerZero's current definitions, only testnet endpoints are available for Vana/Vanar networks. However, according to LayerZero documentation, Vana may be configured as mainnet-only. Please verify the current status with LayerZero before deployment.

### Available Endpoints in LayerZero Definitions
- **VANAR_V2_TESTNET**: `40298` - Using RPC `https://rpc.satori.vana.org`
- **VANAR_TESTNET**: `10298` - Legacy V1 endpoint

### Current Configuration
The repository is currently configured to use:
- **Network Name**: `vana-testnet`
- **LayerZero Endpoint ID**: `40298` (VANAR_V2_TESTNET)
- **RPC URL**: `https://rpc.satori.vana.org`

⚠️ **Configuration Warning**: If Vana operates as a mainnet-only network, the current testnet configuration may need adjustment once proper mainnet endpoints become available in LayerZero definitions.

## Environment Setup

Add these environment variables to your `.env` file:

```
# Required for all networks
PRIVATE_KEY=your_private_key_here

# Vana Network RPC URLs (optional, defaults provided)
RPC_URL_VANA_TESTNET=https://rpc.satori.vana.org

# Token address for Vana network (update with actual address)
VANA_TOKEN_ADDRESS=0x... # Replace with actual Vana token address
```

## Deployment

⚠️ **Before Deployment**: Verify the network configuration matches your intended deployment target (testnet vs mainnet).

### Deploy to Vana Network

1. Update the deployment configuration in `deploy/DeployAdapter.ts` to set the correct token address for Vana
2. Set the `VANA_TOKEN_ADDRESS` environment variable to the actual token address
3. Run deployment:

```bash
npx hardhat deploy --network vana-testnet
```

**Note**: The network is currently named `vana-testnet` but uses the available LayerZero endpoint. Verify this matches your deployment requirements.

### Cross-chain Configuration

The OFT configuration files are:
- `oft_config_testnet.ts` - includes Vana network connections

⚠️ **Configuration Note**: The current configuration treats Vana as a testnet participant. If Vana operates as mainnet-only, this configuration may need adjustment.

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

1. **Network Status Verification**: Before deployment, verify if Vana should be treated as testnet or mainnet according to LayerZero's current setup
2. **Endpoint Validation**: Current setup uses `VANAR_V2_TESTNET` (40298) endpoint - confirm this matches your deployment requirements
3. **Token Address**: Update the token address in `deploy/DeployAdapter.ts` and environment variables for Vana network deployment
4. **LayerZero Endpoint**: Verify that LayerZero V2 endpoint is properly deployed on Vana network
5. **DVN Configuration**: Update DVN (Decentralized Verifier Network) addresses in OFT configuration when Vana-specific DVNs are available

## Configuration Files Modified

- `hardhat.config.ts` - Added Vana network configuration using available LayerZero endpoint
- `deploy/DeployAdapter.ts` - Enhanced with network-specific deployment settings
- `oft_config_testnet.ts` - Added Vana network to testnet configuration
- `.env.example` - Added Vana-specific environment variables

## Resolution Steps

If you need to adjust the configuration based on Vana's actual network status:

1. **For Mainnet-only Vana**:
   - Wait for LayerZero to provide mainnet endpoint definitions
   - Update configuration to use mainnet endpoints when available
   - Move Vana configuration from testnet to mainnet config files

2. **For Current Setup**:
   - The current configuration uses available endpoints from LayerZero definitions
   - Test deployment on the configured network to verify functionality
   - Monitor LayerZero updates for additional endpoint support

## Next Steps

1. Verify Vana network requirements with LayerZero documentation
2. Confirm the correct endpoint and network type for your deployment
3. Set appropriate token address for Vana deployment
4. Test deployment on the configured network
5. Configure cross-chain connections as needed