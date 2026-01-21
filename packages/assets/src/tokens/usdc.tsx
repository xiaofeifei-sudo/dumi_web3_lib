// 说明：USDC 代币元数据（含多链合约地址）
import type {Token} from 'pelican-web3-lib-common';
import {UsdcColorful} from 'pelican-web3-lib-icons';

import {
  Arbitrum,
  Avalanche,
  Mainnet,
  Optimism,
  Polygon,
  Sepolia,
  Solana,
  SolanaDevnet,
  suiMainnet,
  suiTestnet,
  TronMainnet
} from '../chains';

export const USDC: Token = {
  name: 'USDC',
  symbol: 'USDC',
  decimal: 6,
  icon: <UsdcColorful/>,

  // Data Source:
  //   https://developers.circle.com/stablecoins/docs/usdc-on-main-networks
  availableChains: [
    // evm
    {
      chain: Mainnet,
      contract: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    },
    {
      chain: Sepolia,
      contract: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
    },
    {
      chain: Polygon,
      contract: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
    },
    {
      chain: Arbitrum,
      contract: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
    },
    {
      chain: Avalanche,
      contract: '',
    },
    {
      chain: Optimism,
      contract: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
    },

    // solana
    {
      chain: Solana,
      contract: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    },
    {
      chain: SolanaDevnet,
      contract: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'
    },


    // sui
    {
      chain: suiMainnet,
      contract: '0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC'
    },
    {
      chain: suiTestnet,
      contract: '0xa1ec7fc00a6f40db9693ad1415d0c193ad3906494428cf252621037bd7117e29::usdc::USDC'
    },

    // tron
    {
      chain: TronMainnet,
      contract: 'TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8'
    }
  ],
};
