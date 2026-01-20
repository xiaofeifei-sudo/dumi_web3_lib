import type { EIP1193Provider } from 'viem';

declare interface Window {
  /** 浏览器注入的 EIP-1193 兼容 Provider（如 MetaMask） */
  ethereum?: EIP1193Provider;
}
