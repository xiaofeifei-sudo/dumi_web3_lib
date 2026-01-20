import { SolanaChainIds } from 'pelican-web3-lib-common';

export interface SolanaChainConfig {
  /** 链 ID（使用公共枚举 SolanaChainIds） */
  id: SolanaChainIds;
  /** 链名称（展示用） */
  name: string;
  /** 网络标识（如 mainnet-beta/devnet/testnet） */
  network: string;
  /** RPC 地址集合（default 为默认 RPC） */
  rpcUrls: Record<string, string>;
}

export const solana: SolanaChainConfig = {
  id: SolanaChainIds.MainnetBeta,
  name: 'Solana',
  network: 'mainnet-beta',
  rpcUrls: {
    default: 'https://api.mainnet-beta.solana.com',
  },
};

export const solanaDevnet: SolanaChainConfig = {
  id: SolanaChainIds.Devnet,
  name: 'Solana Devnet',
  network: 'devnet',
  rpcUrls: {
    default: 'https://api.devnet.solana.com',
  },
};

export const solanaTestnet: SolanaChainConfig = {
  id: SolanaChainIds.Testnet,
  name: 'Solana Testnet',
  network: 'testnet',
  rpcUrls: {
    default: 'https://api.testnet.solana.com',
  },
};
