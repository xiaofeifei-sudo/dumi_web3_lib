/* v8 ignore start */
/** 重新导出 wagmi 的常用模块，便于外部按需使用 */
export * from 'wagmi';
/** wagmi 的 action 方法集合（账户、网络、交易相关的操作） */
export * as actions from 'wagmi/actions';
/** wagmi 预置的 EVM 链配置集合 */
export * as chains from 'wagmi/chains';
/** wagmi 提供的钱包连接器集合（Injected、WalletConnect 等） */
export * as connectors from 'wagmi/connectors';
