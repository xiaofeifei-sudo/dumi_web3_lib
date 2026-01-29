// 说明：EVM 生态常见链的静态元数据与区块浏览器配置
import { ChainIds, ChainType, createGetBrowserLink, type Chain } from 'pelican-web3-lib-common';
import {
  ArbitrumCircleColorful,
  AvalancheCircleColorful,
  BaseCircleColorful,
  BSCCircleColorful,
  EthereumCircleColorful,
  EthereumColorful,
  EthereumFilled,
  EtherscanCircleColorful,
  HardhatColorful,
  OkxWalletColorful,
  OptimismCircleColorful,
  PolygonCircleColorful,
  ScrollColorful,
} from 'pelican-web3-lib-icons';

// 主网（Ethereum）
export const Mainnet: Chain = {
  id: ChainIds.Mainnet,
  name: 'Ethereum',
  type: ChainType.EVM,
  icon: <EthereumCircleColorful />,
  browser: {
    icon: <EtherscanCircleColorful />,
    getBrowserLink: createGetBrowserLink('https://etherscan.io'),
  },
  nativeCurrency: { icon: <EthereumFilled />, name: 'Ether', symbol: 'ETH', decimals: 18 },
};

/**
 * @deprecated use sepolia or holesky instead
 */
export const Goerli: Chain = {
  id: ChainIds.Goerli,
  name: 'Goerli',
  type: ChainType.EVM,
  icon: <EthereumCircleColorful />,
  browser: {
    icon: <EthereumCircleColorful />,
    getBrowserLink: createGetBrowserLink('https://goerli.etherscan.io'),
  },
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
};

// Sepolia 测试网
export const Sepolia: Chain = {
  id: ChainIds.Sepolia,
  name: 'Sepolia',
  type: ChainType.EVM,
  icon: <EthereumCircleColorful />,
  browser: {
    icon: <EthereumCircleColorful />,
    getBrowserLink: createGetBrowserLink('https://sepolia.etherscan.io'),
  },
  nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
};

// Holesky 测试网
export const Holesky: Chain = {
  id: ChainIds.Holesky,
  name: 'Holesky',
  type: ChainType.EVM,
  icon: <EthereumCircleColorful />,
  browser: {
    icon: <EthereumCircleColorful />,
    getBrowserLink: createGetBrowserLink('https://holesky.etherscan.io'),
  },
  nativeCurrency: { name: 'Holesky Ether', symbol: 'ETH', decimals: 18 },
};

// Polygon 主网
export const Polygon: Chain = {
  id: ChainIds.Polygon,
  name: 'Polygon',
  type: ChainType.EVM,
  icon: <PolygonCircleColorful />,
  browser: {
    icon: <PolygonCircleColorful />,
    getBrowserLink: createGetBrowserLink('https://polygonscan.com'),
  },
  nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
};

// BSC 主网
export const BSC: Chain = {
  id: ChainIds.BSC,
  name: 'BNB Smart Chain',
  type: ChainType.EVM,
  icon: <BSCCircleColorful />,
  browser: {
    icon: <BSCCircleColorful />,
    getBrowserLink: createGetBrowserLink('https://bscscan.com'),
  },
  nativeCurrency: { decimals: 18, name: 'BNB', symbol: 'BNB' },
};


/// BSC 测试网
export const BSCTestNet: Chain = {
  id: ChainIds.BSCTestNet,
  name: 'BNB Smart Chain Testnet',
  type: ChainType.EVM,
  icon: <BSCCircleColorful />,
  browser: {
    icon: <BSCCircleColorful />,
    getBrowserLink: createGetBrowserLink('https://bscscan.com'),
  },
  nativeCurrency: {decimals: 18, name: 'BNB', symbol: 'BNB'},
};


// Arbitrum 主网
export const Arbitrum: Chain = {
  id: ChainIds.Arbitrum,
  name: 'Arbitrum One',
  type: ChainType.EVM,
  icon: <ArbitrumCircleColorful />,
  browser: {
    icon: <ArbitrumCircleColorful />,
    getBrowserLink: createGetBrowserLink('https://arbiscan.io'),
  },
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
};

// Optimism 主网
export const Optimism: Chain = {
  id: ChainIds.Optimism,
  name: 'OP Mainnet',
  type: ChainType.EVM,
  icon: <OptimismCircleColorful />,
  browser: {
    icon: <OptimismCircleColorful />,
    getBrowserLink: createGetBrowserLink('https://optimistic.etherscan.io'),
  },
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
};

// Avalanche 主网
export const Avalanche: Chain = {
  id: ChainIds.Avalanche,
  name: 'Avalanche',
  type: ChainType.EVM,
  icon: <AvalancheCircleColorful />,
  browser: {
    icon: <AvalancheCircleColorful />,
    getBrowserLink: createGetBrowserLink('https://snowtrace.io'),
  },
  nativeCurrency: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 },
};

// OKX X1: https://www.okx.com/cn/x1/docs/developer/build-on-x1/quickstart
// OKX X1 测试网
export const X1Testnet: Chain = {
  id: ChainIds.X1Testnet,
  name: 'X1 testnet',
  type: ChainType.EVM,
  icon: <OkxWalletColorful />,
  browser: {
    icon: <OkxWalletColorful />,
    getBrowserLink: createGetBrowserLink('https://www.okx.com/explorer/x1-test'),
  },
  nativeCurrency: { name: 'OKB', symbol: 'OKB', decimals: 18 },
};

// Scroll 主网
export const Scroll: Chain = {
  id: ChainIds.Scroll,
  name: 'Scroll',
  type: ChainType.EVM,
  icon: <ScrollColorful />,
  browser: {
    icon: <ScrollColorful />,
    getBrowserLink: createGetBrowserLink('https://scrollscan.com/'),
  },
  nativeCurrency: { name: 'Scroll ETH', symbol: 'ETH', decimals: 18 },
};

// Scroll Sepolia 测试网
export const ScrollSepolia: Chain = {
  id: ChainIds.ScrollSepolia,
  name: 'Scroll Sepolia Testnet',
  type: ChainType.EVM,
  icon: <ScrollColorful />,
  browser: {
    icon: <ScrollColorful />,
    getBrowserLink: createGetBrowserLink('https://sepolia.scrollscan.com/'),
  },
  nativeCurrency: { name: 'Scroll ETH', symbol: 'ETH', decimals: 18 },
};

// Base 主网
export const Base: Chain = {
  id: ChainIds.Base,
  name: 'Base',
  type: ChainType.EVM,
  icon: <BaseCircleColorful />,
  browser: {
    icon: <BaseCircleColorful />,
    getBrowserLink: createGetBrowserLink('https://basescan.org'),
  },
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
};

// Hardhat 本地开发链
export const Hardhat: Chain = {
  id: ChainIds.Hardhat,
  name: 'Hardhat',
  type: ChainType.EVM,
  icon: <HardhatColorful />,
  nativeCurrency: { icon: <EthereumFilled />, name: 'Ether', symbol: 'ETH', decimals: 18 },
};

// Localhost 本地链
export const Localhost: Chain = {
  id: ChainIds.Localhost,
  name: 'Localhost',
  type: ChainType.EVM,
  icon: <EthereumColorful />,
  nativeCurrency: { icon: <EthereumFilled />, name: 'Ether', symbol: 'ETH', decimals: 18 },
};
