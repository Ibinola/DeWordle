export type NetworkName = "testnet" | "mainnet";

export interface SorobanNetworkConfig {
  name: NetworkName;
  rpcUrl: string;
  passphrase: string;
}

export const NETWORKS: Record<NetworkName, SorobanNetworkConfig> = {
  testnet: {
    name: "testnet",
    rpcUrl: "https://soroban-testnet.stellar.org",
    passphrase: "Test SDF Network ; September 2015",
  },
  mainnet: {
    name: "mainnet",
    rpcUrl: "https://mainnet.sorobanrpc.com",
    passphrase: "Public Global Stellar Network ; September 2015",
  },
};
