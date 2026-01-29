import type { Config } from 'wagmi';
import { sendTransaction as sendNativeTransaction, writeContract } from 'wagmi/actions';
import type { Token, TransferParams } from 'pelican-web3-lib-common';
import { fillAddressWith0x, parseNumberToBigint } from 'pelican-web3-lib-common';
import { erc20Abi } from 'viem';

function findTokenContractOnChain(token?: Token, chainId?: number): `0x${string}` | undefined {
  if (!token || !chainId) return undefined;
  const found = token.availableChains?.find((item) => item?.chain?.id === chainId);
  const contract = found?.contract;
  if (typeof contract === 'string' && contract.toLowerCase().startsWith('0x')) {
    return fillAddressWith0x(contract);
  }
  return undefined;
}

export async function sendTransaction(
  config: Config,
  params: TransferParams & { chainId?: number },
): Promise<`0x${string}`> {
  const to = fillAddressWith0x(params.to);
  const value = parseNumberToBigint(params.value);
  const chainId = params.chainId;
  const contract = findTokenContractOnChain(params.token, chainId);
  if (contract) {
    return writeContract(config as any, {
      address: contract,
      chainId,
      abi: erc20Abi,
      functionName: 'transfer',
      args: [to, value ?? BigInt(0)],
    });
  }
  return sendNativeTransaction(config as any, {
    to,
    value,
    chainId,
  });
}
