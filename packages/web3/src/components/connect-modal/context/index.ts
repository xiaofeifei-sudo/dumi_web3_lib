/* v8 ignore start */
import React from 'react';
import type { ConnectOptions } from 'pelican-web3-lib-common';
import type { ConnectingStatusConfig, PanelRoute, Wallet } from '../interface';

type ConnectModalLocaleMessages = {
  title: string;
  walletListEmpty: string;
  qrCodePanelDownloadTipForReady: string;
  getWalletUniversalProtocolBtnText: string;
  getWalletBtnText: string;
};

export type ConnectModalContext = {
  prefixCls: string;
  addressPrefix?: string | false;
  selectedWallet?: Wallet;
  updateSelectedWallet: (wallet?: Wallet, connectOptions?: ConnectOptions) => void;
  panelRoute: PanelRoute;
  updatePanelRoute: (route: PanelRoute, clear?: boolean) => void;
  panelRouteBack: () => void;
  canBack: boolean;
  localeMessage: ConnectModalLocaleMessages;
  connecting?: ConnectingStatusConfig;
};

export const connectModalContext = React.createContext<ConnectModalContext>({
  prefixCls: 'ant-web3-connect-modal',
  addressPrefix: undefined,
  selectedWallet: undefined,
  updateSelectedWallet: () => {},
  panelRoute: 'init',
  updatePanelRoute: () => {},
  panelRouteBack: () => {},
  canBack: false,
  localeMessage: {
    title: "连接钱包",
    walletListEmpty: "暂无可用钱包",
    qrCodePanelDownloadTipForReady: "扫码下载并安装钱包",
    getWalletUniversalProtocolBtnText: "使用通用协议连接",
    getWalletBtnText: "前往安装钱包",
  },
});

export const ConnectModalContextProvider = connectModalContext.Provider;
