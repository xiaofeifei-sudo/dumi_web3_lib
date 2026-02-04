import type { Config } from 'wagmi';
import { sendTransaction as sendNativeTransaction, writeContract } from 'wagmi/actions';
import { getAccount } from 'wagmi/actions';
import type { Token, TransferParams } from 'pelican-web3-lib-common';
import { fillAddressWith0x } from 'pelican-web3-lib-common';
import { erc20Abi, isAddress } from 'viem';
import { getBalance } from './getBalance';
import { EvmInsufficientBalanceError } from '../../errors/insufficient-balance-error';
import { EvmInvalidAddressError } from '../../errors/invalid-address-error';
import { ETH } from 'pelican-web3-lib-assets';
import { getTokenDecimals } from './getTokenDecimals';

/// 在指定链上查找代币合约地址
function findTokenContractOnChain(token?: Token, chainId?: number): `0x${string}` | undefined {
  if (!token || !chainId) return undefined;
  const found = token.availableChains?.find((item) => item?.chain?.id === chainId);
  const contract = found?.contract;
  if (typeof contract === 'string') {
    return fillAddressWith0x(contract);
  }
  return undefined;
}

/// 发送交易
export async function sendTransaction(
  config: Config,
  params: TransferParams & { chainId?: number },
): Promise<`0x${string}`> {
  const to = fillAddressWith0x(params.to);
  if (!isAddress(to)) {
    throw new EvmInvalidAddressError();
  }
  const chainId = params.chainId;
  const contract =
    params.customToken?.contract && chainId
      ? fillAddressWith0x(params.customToken.contract)
      : findTokenContractOnChain(params.token, chainId);
  const rawValue = params.value ?? 0;
  let amount: bigint;
  if (typeof rawValue === 'bigint') {
    amount = rawValue;
  } else {
    let decimals = ETH.decimal;
    if (params.token) {
      if (contract && chainId) {
        decimals = await getTokenDecimals(config, contract, chainId);
      } else {
        decimals = params.token.decimal;
      }
    } else if (params.customToken) {
      if (typeof params.customToken.decimal === 'number') {
        decimals = params.customToken.decimal;
      } else if (contract && chainId) {
        decimals = await getTokenDecimals(config, contract, chainId);
      }
    }
    amount = BigInt(Math.floor(rawValue * 10 ** decimals));
  }
  const account = getAccount(config);
  const from = account?.address;
  if (from && chainId) {
    if (contract && params.token) {
      const balance = await getBalance(config, from, chainId, params.token);
      const available = balance?.value ?? BigInt(0);
      if (amount > available) {
        throw new EvmInsufficientBalanceError();
      }
    } else if (contract && params.customToken && !params.token) {
      const balance = await getBalance(config, from, chainId, undefined, undefined, params.customToken);
      const available = balance?.value ?? BigInt(0);
      if (amount > available) {
        throw new EvmInsufficientBalanceError();
      }
    } else if (!contract) {
      const balance = await getBalance(config, from, chainId);
      const available = balance?.value ?? BigInt(0);
      if (amount > available) {
        throw new EvmInsufficientBalanceError();
      }
    }
  }
  if (contract) {
    return writeContract(config, {
      address: contract,
      chainId,
      abi: erc20Abi,
      functionName: 'transfer',
      args: [to, amount],
    });
  }
  return sendNativeTransaction(config, {
    to,
    value: amount,
    chainId,
  });
}
