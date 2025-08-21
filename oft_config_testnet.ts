import { EndpointId } from "@layerzerolabs/lz-definitions";

// OFT Configuration for Testnet Networks
// Note: Vana is configured using VANAR_V2_TESTNET endpoint (40298)
// Verify this matches your deployment requirements

const sepolia_testnetContract = {
    eid: EndpointId.SEPOLIA_V2_TESTNET,
    contractName: "OORTOFTUpgradeable"
};

const bsc_testnetContract = {
    eid: EndpointId.BSC_V2_TESTNET,
    contractName: "OORTOFTUpgradeable"
};

const amoy_testnetContract = {
    eid: EndpointId.AMOY_V2_TESTNET,
    contractName: "OORTOFTUpgradeable"
};

// Vana Network Contract
// Using available LayerZero endpoint - verify network type requirements
const vana_testnetContract = {
    eid: EndpointId.VANAR_V2_TESTNET,
    contractName: "OORTOFTUpgradeable"
};

export default { 
    contracts: [
        { contract: sepolia_testnetContract }, 
        { contract: bsc_testnetContract },
        { contract: amoy_testnetContract },
        { contract: vana_testnetContract }
    ], 
    connections: [
        // Sepolia to other testnets
        { 
            from: sepolia_testnetContract, 
            to: bsc_testnetContract, 
            config: { 
                sendLibrary: "0x9F8C645f2D0b2159767Bd6E0839DE4BE49e823DE", 
                receiveLibraryConfig: { 
                    receiveLibrary: "0xB217266c3A98C8B2709Ee26836C98cf12f6cCEC1", 
                    gracePeriod: 0 
                }, 
                sendConfig: { 
                    executorConfig: { 
                        maxMessageSize: 10000, 
                        executor: "0x3ebD570ed38B1b3b4BC886999fcF507e9D584859" 
                    }, 
                    ulnConfig: { 
                        confirmations: 5, 
                        requiredDVNs: ["0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"], 
                        optionalDVNs: [], 
                        optionalDVNThreshold: 0 
                    } 
                }, 
                receiveConfig: { 
                    ulnConfig: { 
                        confirmations: 5, 
                        requiredDVNs: ["0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"], 
                        optionalDVNs: [], 
                        optionalDVNThreshold: 0 
                    } 
                } 
            } 
        },
        {
            from: sepolia_testnetContract,
            to: vana_testnetContract,
            config: {
                sendLibrary: "0x9F8C645f2D0b2159767Bd6E0839DE4BE49e823DE",
                receiveLibraryConfig: {
                    receiveLibrary: "0xB217266c3A98C8B2709Ee26836C98cf12f6cCEC1",
                    gracePeriod: 0
                },
                sendConfig: {
                    executorConfig: {
                        maxMessageSize: 10000,
                        executor: "0x3ebD570ed38B1b3b4BC886999fcF507e9D584859"
                    },
                    ulnConfig: {
                        confirmations: 5,
                        requiredDVNs: ["0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"],
                        optionalDVNs: [],
                        optionalDVNThreshold: 0
                    }
                },
                receiveConfig: {
                    ulnConfig: {
                        confirmations: 5,
                        requiredDVNs: ["0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"],
                        optionalDVNs: [],
                        optionalDVNThreshold: 0
                    }
                }
            }
        },
        // BSC testnet to others
        {
            from: bsc_testnetContract,
            to: sepolia_testnetContract,
            config: {
                sendLibrary: "0x9F8C645f2D0b2159767Bd6E0839DE4BE49e823DE",
                receiveLibraryConfig: {
                    receiveLibrary: "0xB217266c3A98C8B2709Ee26836C98cf12f6cCEC1",
                    gracePeriod: 0
                },
                sendConfig: {
                    executorConfig: {
                        maxMessageSize: 10000,
                        executor: "0x3ebD570ed38B1b3b4BC886999fcF507e9D584859"
                    },
                    ulnConfig: {
                        confirmations: 5,
                        requiredDVNs: ["0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"],
                        optionalDVNs: [],
                        optionalDVNThreshold: 0
                    }
                },
                receiveConfig: {
                    ulnConfig: {
                        confirmations: 5,
                        requiredDVNs: ["0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"],
                        optionalDVNs: [],
                        optionalDVNThreshold: 0
                    }
                }
            }
        },
        {
            from: bsc_testnetContract,
            to: vana_testnetContract,
            config: {
                sendLibrary: "0x9F8C645f2D0b2159767Bd6E0839DE4BE49e823DE",
                receiveLibraryConfig: {
                    receiveLibrary: "0xB217266c3A98C8B2709Ee26836C98cf12f6cCEC1",
                    gracePeriod: 0
                },
                sendConfig: {
                    executorConfig: {
                        maxMessageSize: 10000,
                        executor: "0x3ebD570ed38B1b3b4BC886999fcF507e9D584859"
                    },
                    ulnConfig: {
                        confirmations: 5,
                        requiredDVNs: ["0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"],
                        optionalDVNs: [],
                        optionalDVNThreshold: 0
                    }
                },
                receiveConfig: {
                    ulnConfig: {
                        confirmations: 5,
                        requiredDVNs: ["0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"],
                        optionalDVNs: [],
                        optionalDVNThreshold: 0
                    }
                }
            }
        },
        // Vana testnet to others
        {
            from: vana_testnetContract,
            to: sepolia_testnetContract,
            config: {
                sendLibrary: "0x9F8C645f2D0b2159767Bd6E0839DE4BE49e823DE",
                receiveLibraryConfig: {
                    receiveLibrary: "0xB217266c3A98C8B2709Ee26836C98cf12f6cCEC1",
                    gracePeriod: 0
                },
                sendConfig: {
                    executorConfig: {
                        maxMessageSize: 10000,
                        executor: "0x3ebD570ed38B1b3b4BC886999fcF507e9D584859"
                    },
                    ulnConfig: {
                        confirmations: 5,
                        requiredDVNs: ["0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"],
                        optionalDVNs: [],
                        optionalDVNThreshold: 0
                    }
                },
                receiveConfig: {
                    ulnConfig: {
                        confirmations: 5,
                        requiredDVNs: ["0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"],
                        optionalDVNs: [],
                        optionalDVNThreshold: 0
                    }
                }
            }
        },
        {
            from: vana_testnetContract,
            to: bsc_testnetContract,
            config: {
                sendLibrary: "0x9F8C645f2D0b2159767Bd6E0839DE4BE49e823DE",
                receiveLibraryConfig: {
                    receiveLibrary: "0xB217266c3A98C8B2709Ee26836C98cf12f6cCEC1",
                    gracePeriod: 0
                },
                sendConfig: {
                    executorConfig: {
                        maxMessageSize: 10000,
                        executor: "0x3ebD570ed38B1b3b4BC886999fcF507e9D584859"
                    },
                    ulnConfig: {
                        confirmations: 5,
                        requiredDVNs: ["0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"],
                        optionalDVNs: [],
                        optionalDVNThreshold: 0
                    }
                },
                receiveConfig: {
                    ulnConfig: {
                        confirmations: 5,
                        requiredDVNs: ["0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"],
                        optionalDVNs: [],
                        optionalDVNThreshold: 0
                    }
                }
            }
        }
    ] 
};