// 扩展全局 Window：声明以支持注入式钱包的 window.ethereum
declare interface Window {
  ethereum?: any;
}
