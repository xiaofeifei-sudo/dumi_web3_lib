import { useMemo } from 'react';
import type { Chain, Client, Transport } from 'viem';
import { useConnectorClient, type Config } from 'wagmi';
import { Web3 } from 'web3';

/**
 * 将 wagmi 的 Client 转换为 Web3.js 的 Web3 实例
 * - 当 transport 为 fallback 时，优先取第一个 RPC URL
 * - 其他情况直接使用 transport 作为 provider
 * @param client 当前连接器的 wagmi Client
 * @returns Web3.js 的 Web3 实例
 */
/* v8 ignore next 7 */
export const clientToWeb3js = (client: Client<Transport, Chain>): Web3 => {
  const { transport } = client;
  if (transport.type === 'fallback') {
    return new Web3(transport.transports[0].value.url);
  }
  return new Web3(transport);
};

/**
 * 返回当前连接器对应的 Web3.js 实例
 * - 未连接或没有可用客户端时返回 null
 * - 内部依赖 wagmi 的 useConnectorClient 获取 Client
 */
export function useWeb3js(): Web3 | null {
  const { data: client } = useConnectorClient<Config>();
  /* v8 ignore next */
  return useMemo(() => (client ? clientToWeb3js(client) : null), [client]);
}
