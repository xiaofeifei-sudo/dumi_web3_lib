// 说明：为全局 Window 对象补充以太坊提供者类型，便于在浏览器环境访问 window.ethereum
// 参考：EIP-1193 Provider 标准接口定义
import type { EIP1193Provider } from 'viem';

declare interface Window {
  ethereum?: EIP1193Provider;
}
