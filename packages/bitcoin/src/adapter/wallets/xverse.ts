/* v8 ignore start */
// 说明：Xverse 钱包适配器实现（基于 sats-connect）
// 能力：连接、余额查询（payment 地址）、消息签名、转账、PSBT 签名、获取铭文
import type { Account, Balance } from 'pelican-web3-lib-common';
import { AddressPurpose, getProviderById, request } from 'sats-connect';

import { NoAddressError, NoProviderError } from '../../error';
import { getBalanceByMempool, getInscriptionsByAddress } from '../../helpers';
import type { BitcoinProvider, SignPsbtParams, SignPsbtResult, TransferParams } from '../../types';
import type { BitcoinWallet } from '../useBitcoinWallet';

export class XverseBitcoinWallet implements BitcoinWallet {
  name: string;
  provider?: BitcoinProvider;
  account?: Account;
  payment?: string;

  constructor(name: string, id = 'XverseProviders.BitcoinProvider') {
    this.name = name;
    this.provider = getProviderById(id);
  }

  connect = async (): Promise<void> => {
    if (!this.provider) {
      throw new NoProviderError();
    }
    // 请求 Ordinals 与 Payment 两种地址
    const response = await request('getAccounts', {
      purposes: [AddressPurpose.Ordinals, AddressPurpose.Payment],
    });
    if (response.status === 'error') {
      throw new Error(response.error.message);
    }
    const [ordinals, payment] = response.result;
    this.account = { address: ordinals.address };
    this.payment = payment.address;
  };

  getBalance = async (): Promise<Balance> => {
    if (!this.payment) {
      throw new NoAddressError();
    }
    // 使用 payment 地址通过 mempool 查询余额
    const balance = await getBalanceByMempool(this.payment);
    return balance;
  };

  signMessage = async (msg: string): Promise<string> => {
    if (!this.provider) {
      throw new NoProviderError();
    }
    if (!this.account?.address) {
      throw new NoAddressError();
    }
    // 通过 sats-connect 进行消息签名
    const response = await request('signMessage', {
      address: this.account.address,
      message: msg,
    });
    if (response.status === 'success') {
      return response.result.signature;
    }

    throw new Error(response.error.message);
  };

  sendTransfer = async ({ to, sats }: TransferParams): Promise<string> => {
    let txid = '';
    // 由 sats-connect 发起转账，Xverse 处理交易构造与广播
    const response = await request('sendTransfer', {
      recipients: [
        {
          address: to,
          amount: sats,
        },
      ],
    });
    if (response.status === 'success') {
      txid = response.result.txid;
    } else {
      throw new Error(response.error.message);
    }
    return txid;
  };

  signPsbt = async ({ psbt, options }: SignPsbtParams): Promise<SignPsbtResult> => {
    if (!this.provider) {
      throw new NoProviderError();
    }
    // API: https://docs.xverse.app/sats-connect/bitcoin-methods/signpsbt
    // 通过 sats-connect 对 PSBT 进行签名，可选择广播
    const response = await request('signPsbt', {
      psbt,
      signInputs: options?.signInputs ?? {},
      broadcast: !!options?.broadcast,
    });
    if (response.status === 'success') {
      return response.result as SignPsbtResult;
    }

    throw new Error(response.error.message);
  };

  getInscriptions = async (offset = 0, limit = 20) => {
    if (!this.account?.address) {
      throw new NoAddressError();
    }
    // 通过 Hiro API 获取当前账户的铭文列表
    const inscriptions = await getInscriptionsByAddress({
      address: this.account?.address,
      offset,
      limit,
    });
    return inscriptions;
  };
}
