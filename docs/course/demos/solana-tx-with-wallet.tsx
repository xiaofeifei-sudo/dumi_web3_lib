import React from 'react';
import { solanaDevnet, SolanaWeb3ConfigProvider } from 'pelican-web3-lib-solana';

import MemoTx from './solana-memo-call';

const rpcProvider = () => `https://api.zan.top/node/v1/solana/devnet/${YOUR_ZAN_API_KEY}`;

export default function CallSolanaMemoApp() {
  return (
    <SolanaWeb3ConfigProvider
      autoAddRegisteredWallets
      chains={[solanaDevnet]}
      rpcProvider={rpcProvider}
    >
      <MemoTx />
    </SolanaWeb3ConfigProvider>
  );
}
