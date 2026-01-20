import { metadata_WalletConnect } from 'pelican-web3-lib-assets';
import type { WalletMetadata } from 'pelican-web3-lib-common';
import type { Connector } from 'wagmi';

import type { WalletFactory, WalletUseInWagmiAdapter } from '../interface';

export type EthereumWalletConnect = (
  metadata?: Partial<WalletMetadata> & {
    useWalletConnectOfficialModal?: boolean;
  },
) => WalletFactory;

/**
 * WalletConnect 钱包工厂
 * - 通过 wagmi 的 WalletConnect 连接器进行连接
 * - 支持自定义是否使用官方二维码弹窗
 * - 提供获取二维码 URI 的方法（监听 display_uri 事件）
 */
export const WalletConnect: EthereumWalletConnect = (metadata) => {
  const { useWalletConnectOfficialModal = false, ...rest } = metadata || {};
  return {
    connectors: ['WalletConnect'],
    create: (connectors?: readonly Connector[], options = {}): WalletUseInWagmiAdapter => {
      let qrCodeUri: string | undefined = undefined;
      const getQrCode = async () => {
        const provider = await connectors?.[0]?.getProvider();
        return new Promise<{ uri: string }>((resolve) => {
          if (qrCodeUri) {
            resolve({
              uri: qrCodeUri,
            });
            return;
          }
          (provider as any)?.on('display_uri', (uri: string) => {
            qrCodeUri = uri;
            resolve({
              uri,
            });
          });
        });
      };
      return {
        ...metadata_WalletConnect,
        getWagmiConnector: async () => {
          return connectors?.[0];
        },
        hasWalletReady: async () => {
          return true;
        },
        getQrCode: getQrCode,
        customQrCodePanel: useWalletConnectOfficialModal || options.useWalletConnectOfficialModal,
        ...rest,
      };
    },
  };
};
