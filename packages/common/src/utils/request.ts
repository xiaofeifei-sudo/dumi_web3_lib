/**
 * 规范化 Web3 资源地址
 * - 支持将 ipfs:// 协议转换为公共网关 https://ipfs.io/ipfs/
 * - 其他常规 http(s) 链接原样返回
 */
export function getWeb3AssetUrl(url?: string): string | undefined {
  if (!url) {
    return url;
  }
  let requestURL = url;
  if (url.startsWith('ipfs://')) {
    requestURL = `https://ipfs.io/ipfs/${url.replace('ipfs://', '')}`;
  }
  return requestURL;
}

/**
 * 拉取 Web3 资源并解析为 JSON
 * - 会先通过 getWeb3AssetUrl 处理 IPFS 等协议
 * - 未传入 url 时抛出错误
 */
export async function requestWeb3Asset<T = any>(url: string): Promise<T> {
  if (!url) {
    throw new Error('URL not set');
  }
  return fetch(getWeb3AssetUrl(url)!).then((res) => res.json());
}
