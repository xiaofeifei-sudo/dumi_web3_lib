import { ConnectButton, Connector, useAccount } from 'pelican-web3-lib';
import { Mainnet } from 'pelican-web3-lib-assets';
import {
  EthersWeb3ConfigProvider,
  MetaMask,
  OkxWallet,
  TokenPocket,
  useEthersProvider,
  useEthersSigner,
} from 'pelican-web3-lib-ethers';
import { Button, message } from 'antd';

const App = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const provider = useEthersProvider();
  const signer = useEthersSigner();
  const account = useAccount();
  return (
    <div>
      {contextHolder}
      <Connector modalProps={{ mode: 'simple' }}>
        <ConnectButton quickConnect style={{ minWidth: 120 }} />
      </Connector>
      <Button
        onClick={async () => {
          if (!account?.account) {
            messageApi.error('Please connect wallet first!');
            return;
          }
          const signature = await signer!.signMessage('hi antd web3!');
          const blockNum = await provider!.getBlockNumber();
          messageApi.success(`Sig: ${signature}, current block number: ${blockNum}`);
        }}
      >
        Sign Message
      </Button>
    </div>
  );
};

export default function HomePage() {
  return (
    <EthersWeb3ConfigProvider
      ens
      eip6963={{ autoAddInjectedWallets: true }}
      wallets={[MetaMask(), TokenPocket(), OkxWallet()]}
      chains={[Mainnet]}
    >
      <App />
    </EthersWeb3ConfigProvider>
  );
}
