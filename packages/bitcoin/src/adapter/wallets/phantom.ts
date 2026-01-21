/* v8 ignore start */
// 说明：Phantom 钱包的比特币适配器实现
// 能力：连接、余额查询（payment 地址）、消息签名、PSBT 签名、获取铭文
import type { Account } from 'pelican-web3-lib-common';
import { fromHex, fromUtf8, toBase64, toHex } from 'uint8array-tools';

import { NoAddressError, NoProviderError, NotImplementedError } from '../../error';
import { getBalanceByMempool, getInscriptionsByAddress } from '../../helpers';
import type { SignPsbtParams } from '../../types';
import type { BitcoinWallet } from '../useBitcoinWallet';

type AccountType = {
  address: string;
  addressType: string;
  publicKey: string;
  purpose: string;
};

/**
 * @link https://docs.phantom.app/bitcoin/provider-api-reference#options-parameters
 */
type PhantomSignPsbtOptions = {
  sigHash?: number;
  address: string;
  signingIndexes: number[];
}[];

export class PhantomBitcoinWallet implements BitcoinWallet {
  name: string;
  provider?: any;
  account?: Account;
  payment?: string;

  constructor(name: string) {
    this.name = name;
    this.provider = window.phantom?.bitcoin;
    this.account = undefined;
  }

  connect = async () => {
    if (!this.provider) {
      throw new NoProviderError();
    }

    try {
      // 请求账户列表，区分 ordinals 与 payment 两类地址
      const accounts: AccountType[] = await this.provider.requestAccounts();
      const ordinals = accounts.find((acc) => acc.purpose === 'ordinals');
      const payment = accounts.find((acc) => acc.purpose === 'payment');

      this.account = ordinals ? { address: ordinals.address } : undefined;
      this.payment = payment?.address;
    } catch (error) {
      // biome-ignore lint/complexity/noUselessCatch: re-throw error
      throw error;
    }
  };

  getBalance = async () => {
    if (!this.payment) {
      throw new NoAddressError();
    }

    // 使用 payment 地址查询余额
    const balance = await getBalanceByMempool(this.payment);
    return balance;
  };

  signMessage = async (message: string) => {
    if (!this.provider) {
      throw new NoProviderError();
    }

    if (!this.account?.address) {
      throw new NoAddressError();
    }

    // Phantom 的签名返回二进制，需转为 Base64 展示
    const { signature } = await this.provider.signMessage(this.account.address, fromUtf8(message));

    return toBase64(signature);
  };

  signPsbt = async ({ psbt, options = {} }: SignPsbtParams) => {
    if (!this.provider) {
      throw new NoProviderError();
    }

    if (!this.account?.address) {
      throw new NoAddressError();
    }

    // PSBT 需序列化为二进制后交由 Phantom 签名
    const serializedPsbt = fromHex(psbt);

    const {
      // `broadcast` not supported
      // broadcast,
      signInputs,
      signHash,
    } = options;
    const inputsToSign: PhantomSignPsbtOptions = [];

    if (signInputs) {
      for (const address in signInputs) {
        inputsToSign.push({
          sigHash: signHash,
          address,
          signingIndexes: signInputs[address],
        });
      }
    }

    const signedPsbt = await this.provider.signPSBT(serializedPsbt, { inputsToSign });
    const hexPsbt = toHex(signedPsbt);

    return {
      psbt: hexPsbt,
    };
  };

  sendTransfer = async () => {
    throw new NotImplementedError();
  };

  getInscriptions = async (offset = 0, limit = 20) => {
    if (!this.account?.address) {
      throw new NoAddressError();
    }

    // 通过 Hiro API 查询铭文列表
    const inscriptions = await getInscriptionsByAddress({
      address: this.account.address,
      offset,
      limit,
    });
    return inscriptions;
  };
}
