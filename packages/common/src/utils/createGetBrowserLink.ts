/**
 * 创建区块浏览器链接生成器
 * - 传入基础浏览器地址 url，返回一个根据地址与类型生成具体链接的函数
 * - 支持的 type：
 *   - address：地址详情页
 *   - transaction：交易详情页
 * - 传入不支持的类型会抛出错误
 */
export const createGetBrowserLink = (url: string) => (address: string, type: string) => {
  if (type === 'address') {
    return `${url}/address/${address}`;
  }
  if (type === 'transaction') {
    return `${url}/tx/${address}`;
  }
  throw new Error(`getBrowserLink unsupported type ${type}`);
};


/**
 * 获取Tron区块链浏览器链接地址
 * @param url
 */
export const createGetTronBrowserLink = (url: string) => (address: string, type: string) => {
  if (type === 'address') {
    return `${url}/address/${address}`;
  } else if (type === 'transaction') {
    return `${url}/transaction/${address}`;
  }
  throw new Error(`getBrowserLink unsupported type ${type}`);
};
