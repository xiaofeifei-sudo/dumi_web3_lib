import { Button, Space } from "antd";
import { useWallet, SolanaWeb3ConfigProvider, solana, solanaDevnet, PhantomWallet } from "pelican-web3-lib-solana";
import Connector from "../../components/Connector";
import base58 from 'bs58';
import { ConnectButton } from "../../components/connect-button";


const SignMessage: React.FC = () => {
  const { connected, signMessage } = useWallet();

  if (!connected) {
    return;
  }

  return (
    <Button
      onClick={async () => {
        const message = new TextEncoder().encode('Hello World!');

        try {
          const result = await signMessage?.(message);
          console.log('sign message success!', result ? base58.encode(result) : 'unknown');
        } catch (error) {
          console.log('sign message error:', error);
        }
      }}
    >
      Sign Message
    </Button>
  );
};

const App: React.FC = () => {
  return (
    <SolanaWeb3ConfigProvider
      balance={false}
      chains={[solana, solanaDevnet]}
      rpcProvider={() => `https://api.zan.top/node/v1/solana/mainnet/${YOUR_ZAN_API_KEY}`}
      wallets={[PhantomWallet()]}
    >
      <Space direction="vertical">
        <Connector>
          <ConnectButton />
        </Connector>

        <SignMessage />
      </Space>
    </SolanaWeb3ConfigProvider>
  );
};

export default App;
