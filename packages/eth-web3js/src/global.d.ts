/** 由浏览器钱包（如 MetaMask）注入的 EIP-1193 兼容提供者，供应用与区块链交互使用 */
import type { EIP1193Provider } from 'viem';

declare interface Window {
  ethereum?: EIP1193Provider;
}
