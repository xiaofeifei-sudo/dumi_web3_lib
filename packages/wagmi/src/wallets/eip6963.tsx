import type { Wallet, WalletMetadata } from 'pelican-web3-lib-common';
import type { Connector } from 'wagmi';

import type { EthereumWallet } from '../interface';

export const EIP6963_CONNECTOR = 'EIP6963';

// EIP6963Wallet 不从 pelican-web3-lib-wagmi 导出，仅在内部使用
/**
 * EIP6963 注入式钱包工厂
 * - 根据注入的 Connector 生成钱包元数据
 * - 检测 provider 以判断扩展是否安装与钱包是否就绪
 */
export const EIP6963Wallet: EthereumWallet = (metadata) => {
  return {
    connectors: [EIP6963_CONNECTOR],
    create: (connectors?: readonly Connector[]): Wallet => {
      const connector = connectors?.[0];
      const metadata_eip6963: WalletMetadata = {
        icon: connector?.icon,
        name: connector!.name,
        remark: `Wallet ${connector?.name} detected`,
        key: connector?.id,
      };
      return {
        ...metadata_eip6963,
        hasWalletReady: async () => {
          return !!(await connector?.getProvider());
        },
        hasExtensionInstalled: async () => {
          return !!(await connector?.getProvider());
        },
        ...metadata,
      };
    },
  };
};
