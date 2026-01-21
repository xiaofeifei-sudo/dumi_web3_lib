import { Chain, ChainIds, createGetTronBrowserLink, TronChainIds } from "pelican-web3-lib-common";
import { ChromeCircleColorful, TronColorful, TrxColorful } from "pelican-web3-lib-icons";

export interface TronChain extends Chain {
  network: 'Mainnet' | 'Shasta' | 'Nile';
}

export const TRX_DECIMALS = 6;
export const TronMainnet: TronChain = {
  id: TronChainIds.Mainnet,
  name: 'Tron Mainnet',
  network: 'Mainnet',
  icon: <TronColorful />,
  browser: {
    icon: <ChromeCircleColorful />,
    getBrowserLink: createGetTronBrowserLink('https://tronscan.org/#/'),
  },
  nativeCurrency: {
    name: 'Trx',
    symbol: 'TRX',
    decimals: TRX_DECIMALS,
    icon: <TrxColorful />,
  },
};

export const TronShastaNet: TronChain = {
  id: TronChainIds.Shasta,
  name: 'Tron Shasta',
  network: 'Shasta',
  icon: <TronColorful />,
  browser: {
    icon: <ChromeCircleColorful />,
    getBrowserLink: createGetTronBrowserLink('https://shasta.tronscan.org/#/'),
  },
  nativeCurrency: {
    name: 'Trx',
    symbol: 'TRX',
    decimals: TRX_DECIMALS,
    icon: <TronColorful />,
  },
};

export const TronNileNet: TronChain = {
  id: TronChainIds.Nile,
  name: 'Tron Nile',
  network: 'Nile',
  icon: <TronColorful />,
  browser: {
    icon: <ChromeCircleColorful />,
    getBrowserLink: createGetTronBrowserLink('https://nile.tronscan.org/#/'),
  },
  nativeCurrency: {
    name: 'Trx',
    symbol: 'TRX',
    decimals: TRX_DECIMALS,
    icon: <TrxColorful />,
  },
};
