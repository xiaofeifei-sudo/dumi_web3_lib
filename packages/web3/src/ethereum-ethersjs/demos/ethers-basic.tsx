// 演示：使用 pelican-web3-lib-ethers（基于 ethers.js）进行钱包连接与基础数据读取
import { Typography } from 'antd';
// Web3 配置与常见钱包适配（MetaMask、OkxWallet），以及获取 Provider/Signer 的 Hook
import { EthersWeb3ConfigProvider, MetaMask, OkxWallet, useEthersProvider, useEthersSigner } from 'pelican-web3-lib-ethers';
// 负责管理连接状态与上下文的封装组件
import Connector from '../../components/Connector';
// 订阅链上最新区块高度的 Hook（来自 wagmi 集成）
import { useBlockNumber } from 'pelican-web3-lib-ethers/wagmi';
// 统一的连接钱包按钮组件
import { ConnectButton } from '../../components/connect-button';

// 展示当前连接地址与区块高度的示例组件
const AddressPreviewer = () => {
  // 获取 ethers Provider：用于读取链上只读数据（如区块、余额）
  const provider = useEthersProvider();
  // 获取当前连接钱包的 Signer：包含地址与签名能力（发交易、签消息）
  const signer = useEthersSigner();
  // 订阅最新区块高度（响应式更新）
  const blockNumber = useBlockNumber();

  return (
    <Typography.Paragraph>
      {/* 显示当前钱包地址；未连接时回退为 '-' */}
      address: {signer?.address ?? '-'} (at {Number(blockNumber.data)})
    </Typography.Paragraph>
  );
};

// 应用入口：配置 Web3 Provider 与钱包，再渲染连接按钮与演示组件
const App: React.FC = () => {
  return (
    <EthersWeb3ConfigProvider
      // WalletConnect 项目 ID（需替换为你自己的真实 projectId）
      walletConnect={{ projectId: YOUR_WALLET_CONNECT_PROJECT_ID }}
      // 支持的钱包列表，可按需增删
      wallets={[MetaMask(), OkxWallet()]}
    >
      {/* 连接上下文容器，内部放置统一连接按钮 */}
      <Connector>
        <ConnectButton />
      </Connector>
      {/* 地址与区块高度预览 */}
      <AddressPreviewer />
    </EthersWeb3ConfigProvider>
  );
};

export default App;
