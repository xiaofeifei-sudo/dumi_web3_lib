/**
 * ConnectModal 上下文
 * - 管理前缀类名、地址前缀、选中钱包、面板路由与文案
 * - 通过 Provider 在弹窗内共享状态与操作方法
 *
 * 字段说明
 * - prefixCls：样式前缀
 * - addressPrefix：地址展示前缀（如 0x），false 表示不添加
 * - selectedWallet：当前选中钱包
 * - updateSelectedWallet：更新选中钱包并可附带连接选项
 * - panelRoute / updatePanelRoute / panelRouteBack / canBack：路由与返回栈
 * - localeMessage：文案字典（标题、空列表提示、二维码说明、按钮文本）
 * - connecting：外部传入的连接状态配置
 */
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
