import React from 'react';
import { SolanaWeb3ConfigProvider } from 'pelican-web3-lib-solana';

export default function App() {
  return <SolanaWeb3ConfigProvider autoAddRegisteredWallets></SolanaWeb3ConfigProvider>;
}
