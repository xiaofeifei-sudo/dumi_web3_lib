import TonConnect, { CHAIN, type TonConnectOptions } from '@tonconnect/sdk';

/**
 * TonConnect SDK 配置类型
 * - chain：指定网络（主网/测试网）
 * - 继承 TonConnectOptions（manifestUrl 等）
 */
export interface TonConnectSdkConfigType extends TonConnectOptions {
  chain?: CHAIN;
}
/**
 * 基于 @tonconnect/sdk 的封装，提供：
 * - 网络切换与当前 API 地址
 * - 查询账户余额的便捷方法
 */
class TonConnectSdk extends TonConnect {
  private _api: string;
  private _network: CHAIN;

  /**
   * 使用配置初始化 SDK，并根据链设置 API 地址
   */
  constructor(options: TonConnectSdkConfigType) {
    super({ manifestUrl: options?.manifestUrl });
    this._api = '';
    this._network = CHAIN.MAINNET;
    this._switchNetwork(options.chain || this._network);
  }

  /**
   * 当前网络（主网/测试网）
   */
  get network() {
    return this._network;
  }

  /**
   * 设置网络，自动切换对应 API 地址
   */
  set network(network: CHAIN) {
    this._switchNetwork(network);
  }

  /**
   * 当前使用的 TonCenter API 基础地址
   */
  get api() {
    return this._api;
  }

  /**
   * 根据网络设置 API 地址（主网/测试网）
   */
  private _switchNetwork(network: CHAIN) {
    if (network === CHAIN.MAINNET) {
      this._api = 'https://toncenter.com/api/v3';
    } else {
      this._api = 'https://testnet.toncenter.com/api/v3';
    }
    this._network = network;
  }

  /**
   * 查询余额
   * - 当未连接且未提供自定义查询 URL 时，返回 0n
   * - 默认使用当前账户地址拼接 TonCenter API 进行查询
   * @param url 可选的自定义查询地址
   * @returns 以 bigint 表示的余额
   */
  async getBalance(url?: string) {
    if (!this.account?.address && !url) return Promise.resolve(0n);
    const queryUrl = url || `${this._api}/account?address=${this.account?.address}`;
    return fetch(queryUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch balance');
        }
        return res.json();
      })
      .then((res) => {
        return res.balance as bigint;
      });
  }
}

export default TonConnectSdk;
