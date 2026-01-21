// 说明：定义 BitcoinWallet 适配器接口与 React Context/Hook 访问方式
import React from 'react';
import type { Account, Balance } from 'pelican-web3-lib-common';

import type { Inscription, SignPsbtParams, SignPsbtResult, TransferParams } from '../types';

/**
 * Bitcoin 钱包适配器统一接口
 * - name：钱包名称
 * - provider：底层钱包提供者实例
 * - account：当前账户
 * - getBalance：获取余额
 * - connect：连接钱包
 * - signMessage：消息签名
 * - sendTransfer：转账
 * - signPsbt：签名 PSBT
 * - getInscriptions：获取铭文
 */
export interface BitcoinWallet<Provider = any> {
  name: string;
  provider?: Provider;
  account?: Account;
  getBalance: () => Promise<Balance>;
  connect: () => Promise<void>;
  signMessage: (message: string) => Promise<string>;
  sendTransfer: (params: TransferParams) => Promise<string>;
  signPsbt: (params: SignPsbtParams) => Promise<SignPsbtResult>;
  getInscriptions: (
    offset?: number,
    size?: number,
  ) => Promise<{ total: number; list: Inscription[] }>;
}

// 全局适配器上下文，供 Provider 注入与组件使用
export const BitcoinAdapterContext = React.createContext<BitcoinWallet>({} as BitcoinWallet);

/**
 * 访问当前的 Bitcoin 钱包适配器
 * @returns BitcoinWallet 实例（可能为空对象，取决于是否连接）
 */
export const useBitcoinWallet = () => {
  const adapter = React.useContext(BitcoinAdapterContext);
  return adapter;
};
