import { trc20Abi } from '../../abi/trc20';
import { tronToNumber, triggerSmartContractCompat } from '../../utils';

export async function getTokenDecimals(tronWeb: any, contractAddress: string): Promise<number> {
  if (typeof tronWeb?.contract === 'function') {
    const contract = await tronWeb.contract(trc20Abi, contractAddress);
    const rawDecimals = await contract.decimals().call();
    return tronToNumber(rawDecimals, 6);
  }
  const res = await triggerSmartContractCompat(
    tronWeb,
    contractAddress,
    'decimals()',
    [],
    {},
  );
  if (!res) return 6;
  const raw = (res?.constant_result ?? res?.constantResult)?.[0];
  return tronToNumber(raw, 6);
}
