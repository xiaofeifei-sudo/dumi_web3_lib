// 说明：BitcoinConfigProvider 作为通用 Web3ConfigProvider 的适配层
// - 负责余额拉取与 NFT 元数据（铭文图片）解析
import { useEffect, useState, type FC, type PropsWithChildren } from 'react';
import { Web3ConfigProvider, type Balance, type Wallet } from 'pelican-web3-lib-common';

import { useBitcoinWallet } from '../adapter';
import { getInscriptionContentById } from '../helpers';
import type { BitcoinWeb3ConfigProviderProps } from '../index';

export interface BitcoinConfigProviderProps
  extends Omit<BitcoinWeb3ConfigProviderProps, 'wallets'> {
  wallets: Wallet[];
  selectWallet: (wallet?: Wallet | null) => void;
}

export const BitcoinConfigProvider: FC<PropsWithChildren<BitcoinConfigProviderProps>> = ({
  children,
  wallets,
  selectWallet,
  balance: showBalance,
}) => {
  const { getBalance, account } = useBitcoinWallet();
  const [balance, setBalance] = useState<Balance>();

  useEffect(() => {
    if (!showBalance) return;
    // 拉取当前账户余额（若适配器支持）
    getBalance?.().then((b) => setBalance(b));
  }, [showBalance, getBalance]);

  return (
    <Web3ConfigProvider
      addressPrefix={false}
      availableWallets={wallets}
      balance={balance}
      account={account}
      connect={async (wallet) => {
        // 由外层传入的选择钱包逻辑
        selectWallet(wallet);
      }}
      disconnect={async () => {
        selectWallet(null);
      }}
      getNFTMetadata={async ({ address }) => {
        // 将 Ordinals 铭文地址解析为可展示的图片链接
        const image = await getInscriptionContentById(address);
        return {
          image,
        };
      }}
    >
      {children}
    </Web3ConfigProvider>
  );
};
