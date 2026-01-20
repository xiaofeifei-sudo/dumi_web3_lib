import { mainnet } from 'wagmi/chains';

// wagmi 基础能力的测试用 Mock，实现最小可用的钩子返回值
const mockConnector = {
  name: 'MetaMask',
};

export const wagmiBaseMock = {
  // 模拟账户信息（主网、地址、连接器）
  useAccount: () => {
    return {
      chain: mainnet,
      address: '0x21CDf0974d53a6e96eF05d7B324a9803735fFd3B',
      connector: mockConnector,
    };
  },
  // 模拟配置
  useConfig: () => ({}),
  // 模拟余额查询
  useBalance: () => ({ data: {} }),
  // 模拟链切换
  useSwitchChain: () => ({ switchChain: () => {} }),
  // 模拟连接能力
  useConnect: () => ({
    connectors: [mockConnector],
    connectAsync: async () => ({}),
  }),
  // 模拟断开连接
  useDisconnect: () => ({
    disconnectAsync: () => {},
  }),
  // 模拟 ENS 名称与头像
  useEnsName: () => ({ data: null }),
  useEnsAvatar: () => ({ data: null }),
  // 模拟消息签名
  useSignMessage: () => ({ signMessageAsync: async () => 'signMessage' }),
};
