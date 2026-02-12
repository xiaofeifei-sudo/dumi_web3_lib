// Ledger 适配器入口：
// - 引入必要 polyfills，确保 WebHID 等环境兼容
// - 导出核心适配器与交互模态能力
// - 同时导出类型，便于调用方进行强类型开发
import './polyfills/index';
export * from './adapter';
export * from './Modal/openModal';
export type { LedgerUtils, Account, GetAccounts, SelectAccount } from './LedgerWallet';
