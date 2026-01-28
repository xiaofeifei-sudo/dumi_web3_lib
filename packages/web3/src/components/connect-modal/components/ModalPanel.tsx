/**
 * ModalPanel 主面板
 * - 管理弹窗内部路由（init/guide/wallet/qrCode/downloadQrCode/link）
 * - 负责钱包选择、连接方式判定与事件上报
 *
 * 状态说明
 * - selectedWallet：当前选中钱包
 * - panelRoute：当前面板路由；routeStack 维护返回栈
 * - isSimple：根据 mode 或断点决定是否使用简易布局
 *
 * 交互流程
 * - updateSelectedWallet：根据 connectType 切换到二维码/链接面板，否则返回列表
 * - panelRouteBack：按栈返回，回到 init 时清空选中钱包
 */
import React from 'react';
import type { ConnectOptions } from 'pelican-web3-lib-common';
import { Button, ConfigProvider } from 'antd';
import classNames from 'classnames';

import useProvider from '../../../hooks/useProvider';
import { ConnectModalContextProvider } from '../context';
import useMode from '../hooks/useMode';
import type { ConnectModalProps, PanelRoute, Wallet } from '../interface';
import { useStyle } from '../style';
import { mergeReactNodeProps } from '../utils';
import MainPanel from './MainPanel';
import WalletList from './WalletList';

export type ModalPanelProps = ConnectModalProps;

const ModalPanel: React.FC<ModalPanelProps> = (props) => {
  const { availableWallets } = useProvider();
  const {
    title,
    footer,
    walletList = availableWallets,
    emptyProps,
    guide,
    group,
    groupOrder,
    mode,
    onWalletSelected,
    actionRef,
    defaultSelectedWallet,
    connecting,
    disabled = false,
    banner,
  } = props;
  const showQRCoodByDefault = defaultSelectedWallet?.getQrCode;
  const [panelRoute, setPanelRoute] = React.useState<PanelRoute>(
    showQRCoodByDefault ? 'qrCode' : 'init',
  );
  const routeStack = React.useRef<PanelRoute[]>(
    showQRCoodByDefault ? ['init', 'qrCode'] : ['init'],
  );
  const [selectedWallet, setSelectedWallet] = React.useState<Wallet | undefined>(
    defaultSelectedWallet,
  );
  const { getPrefixCls } = React.useContext(ConfigProvider.ConfigContext);
  const prefixCls = getPrefixCls('web3-connect-modal');
  const { wrapSSR, hashId } = useStyle(prefixCls);

  const mergedTitle = mergeReactNodeProps(
    title,
    <h2 className={`${prefixCls}-title`}>{"连接钱包"}</h2>,
    (node) => <h2 className={`${prefixCls}-title`}>{node}</h2>,
  );

  const updatePanelRoute = React.useCallback((route: PanelRoute, clear = false) => {
    if (clear) {
      routeStack.current = ['init'];
    }
    setPanelRoute(route);
    routeStack.current.push(route);
  }, []);

  const updateSelectedWallet = React.useCallback(
    async (wallet?: Wallet, connectOptions?: ConnectOptions) => {
      setSelectedWallet(wallet);
      if (wallet && connectOptions) {
        if (connectOptions.connectType === 'qrCode' && !wallet.customQrCodePanel) {
          updatePanelRoute('qrCode', true);
        } else if (connectOptions.connectType === 'extension') {
          updatePanelRoute('link', true);
        } else if (connectOptions.connectType === 'openMobile') {
          updatePanelRoute('link', true);
        } else {
          setPanelRoute('init');
        }
        onWalletSelected?.(wallet, connectOptions);
      }
    },
    [onWalletSelected],
  );

  const panelRouteBack = React.useCallback(() => {
    routeStack.current.pop();
    const route = routeStack.current[routeStack.current.length - 1];
    if (route === 'init') {
      updateSelectedWallet(undefined);
    }
    setPanelRoute(route);
  }, [updateSelectedWallet]);

  const { isSimple } = useMode(mode);

  return wrapSSR(
    <ConnectModalContextProvider
      value={{
        prefixCls,
        selectedWallet,
        updateSelectedWallet,
        panelRoute,
        updatePanelRoute,
        panelRouteBack,
        canBack: routeStack.current.length > 1,
        localeMessage: {
          title: "连接钱包",
          walletListEmpty: "暂无可用钱包",
          qrCodePanelDownloadTipForReady: "扫码下载并安装钱包",
          getWalletUniversalProtocolBtnText: "使用通用协议连接",
          getWalletBtnText: "前往安装钱包",
        },
        connecting,
      }}
    >
      <div
        className={classNames(
          `${prefixCls}-body`,
          {
            [`${prefixCls}-body-simple`]: isSimple,
          },
          hashId,
        )}
      >
        {(panelRoute === 'init' || !isSimple) && (
          <div className={classNames(`${prefixCls}-list-panel`)}>
            <div className={`${prefixCls}-header`}>{mergedTitle}</div>
            {banner && <div className={`${prefixCls}-banner`}>{banner}</div>}
            <div className={`${prefixCls}-list`}>
              <div className={`${prefixCls}-list-container`}>
                <WalletList
                  ref={actionRef}
                  walletList={walletList}
                  group={group}
                  groupOrder={groupOrder}
                  emptyProps={emptyProps}
                  disabled={disabled}
                />
              </div>
              <div className={`${prefixCls}-footer-container`}>
                {isSimple && (
                  <div className={`${prefixCls}-simple-guide`}>
                    {"使用提示"}
                    <Button
                      type="link"
                      className={`${prefixCls}-simple-guide-right`}
                      onClick={() => {
                        updatePanelRoute('guide');
                      }}
                      size="small"
                    >
                      {"学习更多"}
                    </Button>
                  </div>
                )}
                {footer && <div className={`${prefixCls}-footer`}>{footer}</div>}
              </div>
            </div>
          </div>
        )}
        {!(panelRoute === 'init' && isSimple) && (
          <MainPanel simple={isSimple} guide={guide} walletList={walletList} />
        )}
      </div>
    </ConnectModalContextProvider>,
  );
};

export default ModalPanel;
