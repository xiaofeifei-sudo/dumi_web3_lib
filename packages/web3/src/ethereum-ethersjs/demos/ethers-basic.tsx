import { Typography } from 'antd';
import { ConnectButton, Connector } from 'pelican-web3-lib';
import {
  EthersWeb3ConfigProvider,
  MetaMask,
  OkxWallet,
  useEthersProvider,
  useEthersSigner,
} from 'pelican-web3-lib-ethers';
import { useBlockNumber } from 'pelican-web3-lib-ethers/wagmi';

const AddressPreviewer = () => {
  const provider = useEthersProvider(); // ethers provider
  const signer = useEthersSigner();
  const blockNumber = useBlockNumber();

  return (
    <Typography.Paragraph>
      address: {signer?.address ?? '-'} (at {Number(blockNumber.data)})
    </Typography.Paragraph>
  );
};

const App: React.FC = () => {
  return (
    <EthersWeb3ConfigProvider
      walletConnect={{ projectId: YOUR_WALLET_CONNECT_PROJECT_ID }}
      wallets={[MetaMask(), OkxWallet()]}
    >
      <Connector>
        <ConnectButton />
      </Connector>
      <AddressPreviewer />
    </EthersWeb3ConfigProvider>
  );
};

export default App;
