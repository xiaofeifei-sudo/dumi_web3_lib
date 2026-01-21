// 说明：Solana 生态的链信息与区块浏览器配置
import { createGetBrowserLink, SolanaChainIds, type Chain } from 'pelican-web3-lib-common';
import { SolanaColorful } from 'pelican-web3-lib-icons';

export interface SolanaChain extends Chain {
  id: SolanaChainIds;
}

// Solana 主网
export const Solana: SolanaChain = {
  id: SolanaChainIds.MainnetBeta,
  name: 'Solana',
  icon: <SolanaColorful />,
  browser: {
    icon: <SolanaColorful />,
    getBrowserLink: createGetBrowserLink('https://explorer.solana.com'),
  },
  nativeCurrency: { name: 'Solana', symbol: 'SOL', decimals: 9 },
};

// Solana Devnet
export const SolanaDevnet: SolanaChain = {
  id: SolanaChainIds.Devnet,
  name: 'Solana Devnet',
  icon: <SolanaColorful />,
  browser: {
    icon: <SolanaColorful />,
    getBrowserLink: (address, type) =>
      `${createGetBrowserLink('https://explorer.solana.com')(address, type)}?cluster=devnet`,
  },
  nativeCurrency: { name: 'Solana', symbol: 'SOL', decimals: 9 },
};

// Solana Testnet
export const SolanaTestnet: SolanaChain = {
  id: SolanaChainIds.Testnet,
  name: 'Solana Testnet',
  icon: <SolanaColorful />,
  browser: {
    icon: <SolanaColorful />,
    getBrowserLink: (address, type) =>
      `${createGetBrowserLink('https://explorer.solana.com')(address, type)}?cluster=testnet`,
  },
  nativeCurrency: { name: 'Solana', symbol: 'SOL', decimals: 9 },
};
