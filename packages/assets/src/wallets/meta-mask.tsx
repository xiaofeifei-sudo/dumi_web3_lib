// 说明：MetaMask 钱包的展示元数据与二维码格式化规则
import { ChainType, type WalletMetadata } from 'pelican-web3-lib-common';
import { ChromeCircleColorful, MetaMaskArk } from 'pelican-web3-lib-icons';

export const metadata_MetaMask: WalletMetadata = {
  icon: <MetaMaskArk />,
  name: 'MetaMask',
  remark: 'MetaMask Wallet',
  app: {
    link: 'https://metamask.io/',
  },
  extensions: [
    {
      key: 'Chrome',
      browserIcon: <ChromeCircleColorful />,
      browserName: 'Chrome',
      link: 'https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
      description: 'Access your wallet right from your favorite web browser.',
    },
  ],
  group: 'Popular',
  transferQRCodeFormatter: (params) => {
    // EIP-681 兼容的二维码格式，支持普通转账或 Token 转账
    const { toAddress, chainId, amount, tokenAddress = '', decimal } = params;
    if (tokenAddress) {
      return `ethereum:${tokenAddress}@${chainId}/transfer?address=${toAddress}&uint256=${
        Number(amount) * 10 ** (18 - decimal)
      }`;
    }

    return `ethereum:${toAddress}@${chainId}?value=${amount}`;
  },
  supportChainTypes: [ChainType.EVM],
};
