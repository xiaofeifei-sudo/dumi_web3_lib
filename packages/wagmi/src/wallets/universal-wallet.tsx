import type { WalletMetadata } from 'pelican-web3-lib-common';
import type { Connector, CreateConnectorFn } from 'wagmi';

import type { CreateWalletOptions, WalletFactory, WalletUseInWagmiAdapter } from '../interface';

/**
 * UniversalWallet
 * 通用钱包工厂：
 * - 根据 WalletMetadata 自动推断支持的连接器（Injected/WalletConnect）
 * - create 方法在运行时根据连接方式与是否安装扩展选择合适的连接器
 * - 支持获取 WalletConnect 二维码与自定义二维码面板
 */
export class UniversalWallet implements WalletFactory {
  public name?: string;
  public createWagmiConnector?: () => CreateConnectorFn;
  public connectors: string[] = [];
  constructor(
    private wallet: WalletMetadata,
    createWagmiConnector?: () => CreateConnectorFn,
  ) {
    this.name = wallet.name;
    this.createWagmiConnector = createWagmiConnector;
    if (wallet.extensions) {
      // 支持 Injected 连接器
      // https://wagmi.sh/react/connectors/injected
      this.connectors.push(wallet.name);
    }
    if (wallet.app) {
      // 支持 WalletConnect
      // https://wagmi.sh/react/connectors/walletConnect
      this.connectors.push('WalletConnect');
    }
  }
  create = (
    connectors?: readonly Connector[],
    options?: CreateWalletOptions,
  ): WalletUseInWagmiAdapter => {
    const walletConnector = connectors?.find((item) => item.name === 'WalletConnect');
    const injectedConnector = connectors?.find((item) => item.name === this.wallet.name);

    let qrCodeUri: string | undefined = undefined;
    const getQrCode = async () => {
      const provider = await walletConnector?.getProvider();
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

    const hasExtensionInstalled = async () => {
      const provider = await injectedConnector?.getProvider?.();
      return !!provider;
    };

    return {
      ...this.wallet,
      getWagmiConnector: async (connectOptions) => {
        if (connectOptions?.connectType === 'qrCode') {
          return walletConnector;
        }
        if (await hasExtensionInstalled()) {
          return injectedConnector;
        }
        return walletConnector;
      },
      hasExtensionInstalled: async () => {
        return hasExtensionInstalled();
      },
      hasWalletReady: async () => {
        const installed = await hasExtensionInstalled();
        return !!(installed || walletConnector);
      },
      customQrCodePanel: options?.useWalletConnectOfficialModal,
      getQrCode: walletConnector ? getQrCode : undefined,
    };
  };
}
