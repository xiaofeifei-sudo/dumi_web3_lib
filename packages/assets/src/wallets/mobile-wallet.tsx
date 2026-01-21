// 说明：移动端扫码连接入口的元数据展示（与 WalletConnect 组合使用）
import type { WalletMetadata } from 'pelican-web3-lib-common';
import { ScanColorful } from 'pelican-web3-lib-icons';

export const metadata_MobileConnect: WalletMetadata = {
  icon: <ScanColorful />,
  name: 'Scan QR Code',
  remark: 'Connect with mobile APP',
  group: 'Popular',
  universalProtocol: {
    link: 'https://walletconnect.com/',
  },
};
