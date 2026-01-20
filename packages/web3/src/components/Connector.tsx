import React from 'react';
import { message } from 'antd';
import type {
  Account,
  Chain,
  ConnectingStatusConfig,
  ConnectOptions,
  UniversalWeb3ProviderInterface,
  Wallet,
} from 'pelican-web3-lib-common';
import useProvider from '../hooks/useProvider';
import { ConnectModal, type ConnectModalProps } from './connect-modal';

export interface ConnectorProps extends UniversalWeb3ProviderInterface {
  children: React.ReactNode;
  modalProps?: ConnectModalProps;
  onConnect?: () => void;
  onConnected?: (account?: Account) => void;
  onDisconnect?: () => void;
  onDisconnected?: () => void;
  onChainSwitched?: (chain?: Chain) => void;
  onConnectError?: (error?: Error) => void;
}

const Connector: React.FC<ConnectorProps> = (props) => {
  const {
    children,
    modalProps,
    onConnect,
    onConnected,
    onDisconnect,
    onDisconnected,
    onChainSwitched,
    onConnectError,
  } = props;
  const {
    availableWallets,
    connect,
    disconnect,
    account,
    availableChains,
    chain,
    switchChain,
    balance,
    addressPrefix,
    sign,
  } = useProvider(props);
  const [open, setOpen] = React.useState(false);
  const [connecting, setConnecting] = React.useState<ConnectingStatusConfig>(false);
  const [defaultSelectedWallet, setDefaultSelectedWallet] = React.useState<Wallet>();
  const [messageApi, contextHolder] = message.useMessage();
  // simplified: ConnectModal 将负责展示与状态交互

  const connectWallet = async (wallet?: Wallet, options?: ConnectOptions) => {
    onConnect?.();
    try {
      setConnecting(true);
      if (wallet?.customQrCodePanel && options?.connectType === 'qrCode') {
        setOpen(false);
      }
      const connectedAccount = await connect?.(wallet, options);
      onConnected?.(connectedAccount ? (connectedAccount as Account) : undefined);
      if (sign?.signIn && (connectedAccount as Account | undefined)?.address) {
        setConnecting({
          status: 'signing',
        });
        await sign.signIn((connectedAccount as Account).address);
      }
      setOpen(false);
    } catch (e: any) {
      if (typeof onConnectError === 'function') {
        onConnectError(e);
      } else {
        messageApi.error(e?.message ?? String(e));
        console.error(e);
      }
    } finally {
      setConnecting(false);
    }
  };

  if (!React.isValidElement(children)) {
    console.error('"children" property of the "Connector" must be a React element');
    return null;
  }

  return (
    <>
      {contextHolder}
      {React.cloneElement(children as React.ReactElement<any>, {
        account,
        onConnectClick: async (wallet?: Wallet) => {
          if (!wallet) {
            setOpen(true);
            return;
          }
          if (await wallet?.hasExtensionInstalled?.()) {
            connectWallet(wallet, {
              connectType: 'extension',
            });
            return;
          }
          connectWallet(wallet, {
            connectType: 'qrCode',
          });
          setDefaultSelectedWallet(wallet);
          setOpen(true);
        },
        onDisconnectClick: () => {
          setConnecting(true);
          onDisconnect?.();
          disconnect?.().then(() => {
            onDisconnected?.();
            setConnecting(false);
          });
        },
        balance,
        availableChains,
        availableWallets,
        chain,
        onSwitchChain: async (c: Chain) => {
          await switchChain?.(c);
          onChainSwitched?.(c);
        },
        loading: typeof connecting === 'boolean' ? connecting : true,
        ...children.props,
      })}
      <ConnectModal
        open={open}
        onCancel={(e) => {
          modalProps?.onCancel?.(e as any);
          setOpen(false);
          setConnecting(false);
        }}
        walletList={availableWallets}
        defaultSelectedWallet={defaultSelectedWallet}
        connecting={connecting}
        addressPrefix={addressPrefix}
        onWalletSelected={(wallet, options) => {
          connectWallet(wallet, options);
        }}
        {...modalProps}
      />
    </>
  );
};

export default Connector;
