import React from 'react';
import type { ComponentDemo } from 'antd-token-previewer-web3';

export const components: Record<string, string[]> = {
  'Crypto Price': ['Basic Crypto Price', 'With Icon'],
};

export const demos: Record<string, ComponentDemo[]> = {
  'Basic Crypto Price': [
    {
      demo: React.createElement(require('pelican-web3-lib/crypto-price/demos/basic').default),
      key: 'Basic Crypto Price',
    },
  ],
  'With Icon': [
    {
      demo: React.createElement(require('pelican-web3-lib/crypto-price/demos/icon').default),
      key: 'With Icon',
    },
  ],
};
