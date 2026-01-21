// 说明：本文件提供将 wagmi 的 viem Client 转换为 ethers.js v5 Provider 的工具与 Hook
// 目标：在使用 pelican-web3-lib-ethers（v6 配置）时，保持 v5 Provider 的使用体验
import { useMemo } from 'react';
import { providers } from 'ethers';
import type { Chain, Client, Transport } from 'viem';
import { useClient, type Config } from 'wagmi';

/**
 * 将 wagmi 的 Client 转换为 ethers.js v5 的 Provider
 * @param client 来自 wagmi 的底层客户端（包含链、传输层等信息）
 * @returns 对应的 v5 Provider 实例
 */
export function clientToProvider(client: Client<Transport, Chain>) {
  const { chain, transport } = client;
  // 构造网络信息，确保 v5 Provider 拥有基本的链元数据
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  if (transport.type === 'fallback')
    /* v8 ignore next 5 */
    return new providers.FallbackProvider(
      // 当 transport 为 fallback（多 RPC），将其映射为多个 JsonRpcProvider 以实现容错
      (transport.transports as ReturnType<Transport>[]).map(
        ({ value }) => new providers.JsonRpcProvider(value?.url, network),
      ),
    );
  // 普通单一 RPC 的情况，直接使用 JsonRpcProvider
  return new providers.JsonRpcProvider(transport.url, network);
}

/**
 * React Hook：获取 ethers.js v5 的 Provider
 * - 当 wagmi 已建立客户端连接时返回 v5 Provider
 * - 未连接时返回 null
 */
export function useEthersProvider() {
  const client = useClient<Config>();
  /* v8 ignore next */
  return useMemo(() => (client ? clientToProvider(client) : null), [client]);
}
