// 说明：USDT 代币元数据（含多链合约地址）
import type {Token} from 'pelican-web3-lib-common';
import {USDTColorful} from 'pelican-web3-lib-icons';

import {Arbitrum, BSC, BSCTestNet, Mainnet, Optimism, Polygon, Sepolia, TronMainnet, TronNileNet} from '../chains';

export const USDT: Token = {
  name: 'Tether USD',
  symbol: 'USDT',
  decimal: 6,
  icon: <USDTColorful/>,
  availableChains: [
    {
      chain: TronMainnet,
      contract: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
    },
    {
      chain: TronNileNet,
      contract: 'TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj',
    },
    {
      chain: Mainnet,
      contract: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    },
    {
      chain: Sepolia,
      contract: '0x419Fe9f14Ff3aA22e46ff1d03a73EdF3b70A62ED',
    },
    {
      chain: Polygon,
      contract: '0x3813e82e6f7098b9583FC0F33a962D02018B6803',
    },
    {
      chain: BSC,
      contract: '0x55d398326f99059fF775485246999027B3197955',
    },
    {
      chain: BSCTestNet,
      contract: '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd',
    },
    {
      chain: Arbitrum,
      contract: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
    },
    {
      chain: Optimism,
      contract: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
    },
  ],
};
