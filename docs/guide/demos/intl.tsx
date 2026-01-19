import { ConnectButton } from 'pelican-web3-lib';

const App: React.FC = () => {
  return (
    <ConnectButton
      locale={{
        connect: '连接钱包',
      }}
    />
  );
};

export default App;
