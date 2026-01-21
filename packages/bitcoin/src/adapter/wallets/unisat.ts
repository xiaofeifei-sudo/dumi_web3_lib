/* v8 ignore start */
// 说明：Unisat 钱包适配器实现
// 能力：连接、余额查询、消息签名、转账、PSBT 签名、获取铭文
import type { Account, Balance } from 'pelican-web3-lib-common';

import { NoAddressError, NoProviderError } from '../../error';
import { getBalanceObject } from '../../helpers';
import type { SignPsbtParams, SignPsbtResult, TransferParams } from '../../types';
import type { BitcoinWallet } from '../useBitcoinWallet';

export class UnisatBitcoinWallet implements BitcoinWallet {
  name: string;
  provider?: Unisat.Provider;
  account?: Account;

  constructor(name: string) {
    this.name = name;
    this.provider = window.unisat;
    this.account = undefined;
  }

  connect = async (): Promise<void> => {
    if (!this.provider) {
      throw new NoProviderError();
    }
    try {
      // 请求账户地址并缓存为当前账户
      const accounts = await this.provider.requestAccounts();
      this.account = { address: accounts[0] };
    } catch (e) {
      // biome-ignore lint/complexity/noUselessCatch: re-throw error
      throw e;
    }
  };

  getBalance = async (): Promise<Balance> => {
    if (!this.provider) {
      throw new NoProviderError();
    }
    // 仅使用 confirmed 数值构造余额对象
    const { confirmed } = await this.provider.getBalance();
    const balance = getBalanceObject(confirmed);
    return balance;
  };

  signMessage = async (msg: string): Promise<string> => {
    if (!this.provider) {
      throw new NoProviderError();
    }
    const signature = await this.provider.signMessage(msg);
    return signature;
  };

  sendTransfer = async ({ to, sats, options }: TransferParams): Promise<string> => {
    if (!this.provider) {
      throw new NoProviderError();
    }
    let txid = '';
    try {
      // 进行比特币转账，返回交易 ID
      txid = await this.provider.sendBitcoin(to, sats, options);
    } catch (e) {
      // biome-ignore lint/complexity/noUselessCatch: re-throw error
      throw e;
    }
    return txid;
  };

  signPsbt = async ({ psbt, options = {} }: SignPsbtParams): Promise<SignPsbtResult> => {
    if (!this.provider) {
      throw new NoProviderError();
    }
    if (!this.account?.address) {
      throw new NoAddressError();
    }
    const { broadcast = false, signInputs = {}, signHash } = options;
    const toSignInputs = [];

    // Convert xverse-compatible signInputs to unisat-compatible toSignInputs
    for (const address in signInputs) {
      for (const input of signInputs[address]) {
        toSignInputs.push({
          address,
          index: input,
          sighashTypes: signHash ? [signHash] : undefined,
          publicKey: this.account?.address,
        });
      }
    }
    // API: https://docs.unisat.io/dev/unisat-developer-center/unisat-wallet#signpsbt
    const signedPsbt = await this.provider.signPsbt(psbt, {
      autoFinalized: broadcast,
      toSignInputs: toSignInputs.length === 0 ? undefined : toSignInputs,
    });
    return {
      psbt: signedPsbt,
    };
  };

  getInscriptions = async (offset = 0, size = 20) => {
    if (!this.provider) {
      throw new NoProviderError();
    }
    // 获取当前账户的铭文列表
    const inscriptions = await this.provider.getInscriptions(offset, size);
    return inscriptions;
  };
}
