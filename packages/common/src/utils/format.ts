/**
 * 为地址补齐 0x 前缀
 * - 若已以 0x 开头则原样返回
 * - 若未包含前缀则自动加上
 */
export function fillAddressWith0x(address: string): `0x${string}` {
  return (address.startsWith('0x') ? address : `0x${address}`) as `0x${string}`;
}

/**
 * 将 number 或 bigint 统一转换为 bigint
 * - 传入 undefined 则返回 undefined
 * - 已是 bigint 则直接返回
 */
export function parseNumberToBigint(num?: number | bigint) {
  if (num === undefined) return undefined;
  return typeof num !== 'bigint' ? BigInt(num) : num;
}
