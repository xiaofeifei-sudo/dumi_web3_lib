/* v8 ignore start */
// 说明：OKX 钱包的比特币适配器实现
// 能力：连接、余额查询、消息签名、转账、PSBT 签名、获取铭文
import type { Account, Balance } from 'pelican-web3-lib-common';

import { NoAddressError, NoProviderError } from '../../error';
import { getBalanceObject } from '../../helpers';
import type { SignPsbtParams, TransferParams } from '../../types';
import type { BitcoinWallet } from '../useBitcoinWallet';

export class OkxBitcoinWallet implements BitcoinWallet {
  name: string;
  provider?: Unisat.Provider;
  account?: Account;

  constructor(name: string) {
    this.name = name;
    this.provider = window.okxwallet?.bitcoin;
    this.account = undefined;
  }

  connect = async (): Promise<void> => {
    if (!this.provider) {
      throw new NoProviderError();
    }

    try {
      // 请求当前账户地址
      const accounts = await this.provider.requestAccounts();
      this.account = { address: accounts[0] };
    } catch (error) {
      // biome-ignore lint/complexity/noUselessCatch: re-throw error
      throw error;
    }
  };

  getBalance = async (): Promise<Balance> => {
    if (!this.provider) {
      throw new NoProviderError();
    }

    // 仅使用 confirmed 数值构造余额对象
    const { confirmed } = await this.provider.getBalance();
    return getBalanceObject(confirmed);
  };

  signMessage = async (msg: string): Promise<string> => {
    if (!this.provider) {
      throw new NoProviderError();
    }

    return await this.provider.signMessage(msg);
  };

  sendTransfer = async ({ to, sats, options }: TransferParams): Promise<string> => {
    if (!this.provider) {
      throw new NoProviderError();
    }

    let txid = '';
    try {
      // 发起转账交易
      txid = await this.provider.sendBitcoin(to, sats, options);
    } catch (error) {
      // biome-ignore lint/complexity/noUselessCatch: re-throw error
      throw error;
    }
    return txid;
  };

  signPsbt = async ({ psbt, options = {} }: SignPsbtParams): Promise<SignPsbtParams> => {
    if (!this.provider) {
      throw new NoProviderError();
    }
    if (!this.account?.address) {
      throw new NoAddressError();
    }

    const { broadcast = false, signInputs = {}, signHash } = options;
    const toSignInputs = [];

    // 将 signInputs 转为 OKX 兼容的 toSignInputs 结构
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

    // API: https://web3.okx.com/zh-hans/build/docs/sdks/chains/bitcoin/provider#signpsbt
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
    // 获取当前账户铭文
    const inscriptions = await this.provider.getInscriptions(offset, size);
    return inscriptions;
  };
}
