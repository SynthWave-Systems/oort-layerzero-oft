# OORT LayerZero OFT

![image](https://github.com/user-attachments/assets/488f0cfe-509e-40b5-bd08-9b0521dac590)

## 🌟 Vana Network Support Added!

This LayerZero OFT now supports the **Vana Network**, enabling omnichain token transfers between Vana and existing supported networks.

✅ **Network Status**: Vana is a mainnet-only network on LayerZero (no testnet available).

### Supported Networks
- **Mainnets**: Ethereum, BSC, Vana
- **Testnets**: Sepolia, BSC Testnet, Polygon Amoy

For detailed Vana integration information and configuration guidance, see [VANA_INTEGRATION.md](./VANA_INTEGRATION.md)

## Cross-chain Transaction Examples

https://testnet.layerzeroscan.com/tx/0x36c6378087e5c621e181d41ab7e6df8bc41ed46a37a38cc629928b3ace272192

Origin Transaction: https://sepolia.etherscan.io/tx/0x36c6378087e5c621e181d41ab7e6df8bc41ed46a37a38cc629928b3ace272192

Recipient Transaction: https://testnet.bscscan.com/tx/0xbc2e6fcb09ab05722b0cc6e50635929cad750b7320adfaad5952544cc0d65fcc

## Quick Start for Vana Network

✅ **Network Status**: Vana is mainnet-only on LayerZero. Uses endpoint `VANAR_V2_TESTNET` (40298) which represents Vana's mainnet.

1. Set up environment variables:
```bash
cp .env.example .env
# Edit .env and set PRIVATE_KEY and VANA_TOKEN_ADDRESS
```

2. Deploy to Vana mainnet:
```bash
npx hardhat deploy --network vana-mainnet
```

3. Configure cross-chain connections using the mainnet configuration:
```bash
npx hardhat lz:oapp:wire --oapp-config oft_config_mainnet.ts
```

For detailed setup and configuration guidance, see [VANA_INTEGRATION.md](./VANA_INTEGRATION.md)
