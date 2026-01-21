// 说明：Bitcoin 包入口文件，聚合导出 Provider、钱包工厂、类型与错误工具
// 作用：为上层应用提供统一且简洁的导入路径
export * from './provider';
export * from './wallets';
export * from './types';
export * from './error';
export { useBitcoinWallet } from './adapter/useBitcoinWallet';
