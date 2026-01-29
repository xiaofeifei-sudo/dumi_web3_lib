import type { Chain, TransferParams } from 'pelican-web3-lib-common';

export async function sendTransaction(
  tronWeb: any,
  from: string,
  currentChain: Chain | undefined,
  signTransaction: ((transaction: any) => Promise<any>) | undefined,
  params: TransferParams,
): Promise<`0x${string}`> {
  const to = params.to;
  const value = params.value ?? 0;
  const tokenOnChain = params.token?.availableChains?.find(
    (item) => (item?.chain as any)?.id === (currentChain as any)?.id,
  );
  if (tokenOnChain?.contract) {
    const amount = typeof value === 'bigint' ? value : BigInt(value);
    const functionSelector = 'transfer(address,uint256)';
    const parameter = [
      { type: 'address', value: to },
      { type: 'uint256', value: amount },
    ];
    const tx = await tronWeb.transactionBuilder.triggerSmartContract(
      tokenOnChain.contract,
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
  const nativeValue = typeof value === 'bigint' ? value : BigInt(value);
  const trade = await tronWeb.transactionBuilder.sendTrx(to, Number(nativeValue), from);
  if (!signTransaction) {
    throw new Error('signTransaction is not available');
  }
  const unsignedTx = trade.transaction ?? trade;
  const signed = await signTransaction(unsignedTx);
  const result = await tronWeb.trx.sendRawTransaction(signed);
  const txId: string = result?.txid || result?.transaction?.txID || '';
  return `0x${txId.replace(/^0x/, '')}` as `0x${string}`;
}

