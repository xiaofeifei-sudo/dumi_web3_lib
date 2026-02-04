import type { Chain, TransferParams } from 'pelican-web3-lib-common';
import { getBalance } from './getBalance';
import { TronInsufficientBalanceError } from '../../errors/insufficient-balance-error';
import { TronInvalidAddressError } from '../../errors/invalid-address-error';
import { getTokenDecimals } from './getTokenDecimals';

/// 发送交易
export async function sendTransaction(
  tronWeb: any,
  from: string,
  currentChain: Chain | undefined,
  signTransaction: ((transaction: any) => Promise<any>) | undefined,
  params: TransferParams,
): Promise<`0x${string}`> {
  const to = params.to;
  if (!tronWeb?.isAddress?.(to)) {
    throw new TronInvalidAddressError();
  }
  const rawValue = params.value ?? 0;
  const tokenOnChain = params.token?.availableChains?.find(
    (item) => (item?.chain as any)?.id === (currentChain as any)?.id,
  );
  let amount: bigint;
  if (typeof rawValue === 'bigint') {
    amount = rawValue;
  } else if (tokenOnChain?.contract) {
    const decimals = await getTokenDecimals(tronWeb, tokenOnChain.contract);
    amount = BigInt(Math.floor(rawValue * 10 ** decimals));
  } else if (params.customToken?.contract) {
    let decimals = params.customToken.decimal;
    if (decimals === undefined) {
      decimals = await getTokenDecimals(tronWeb, params.customToken.contract);
    }
    amount = BigInt(Math.floor(rawValue * 10 ** decimals));
  } else {
    const sun = tronWeb.toSun(rawValue);
    amount = BigInt(typeof sun === 'string' ? sun : String(sun));
  }
  const balance = await getBalance(
    tronWeb,
    from,
    currentChain,
    tokenOnChain?.contract ? params.token : undefined,
    !tokenOnChain?.contract ? params.customToken : undefined,
  );
  const available = balance?.value ?? 0n;
  if (amount > available) {
    throw new TronInsufficientBalanceError();
  }
  if (tokenOnChain?.contract || params.customToken?.contract) {
    const functionSelector = 'transfer(address,uint256)';
    const parameter = [
      { type: 'address', value: to },
      { type: 'uint256', value: amount },
    ];
    const tx = await tronWeb.transactionBuilder.triggerSmartContract(
      tokenOnChain?.contract ?? params.customToken?.contract,
      functionSelector,
      {},
      parameter,
    );
    if (!signTransaction) {
      throw new Error('signTransaction is not available');
    }
    const signed = await signTransaction(tx.transaction);
    const result = await tronWeb.trx.sendRawTransaction(signed);
    const txId: string = result?.txid || result?.transaction?.txID || '';
    return `0x${txId.replace(/^0x/, '')}` as `0x${string}`;
  }
  const trade = await tronWeb.transactionBuilder.sendTrx(to, Number(amount), from);
  if (!signTransaction) {
    throw new Error('signTransaction is not available');
  }
  const unsignedTx = trade.transaction ?? trade;
  const signed = await signTransaction(unsignedTx);
  const result = await tronWeb.trx.sendRawTransaction(signed);
  const txId: string = result?.txid || result?.transaction?.txID || '';
  return `0x${txId.replace(/^0x/, '')}` as `0x${string}`;
}
