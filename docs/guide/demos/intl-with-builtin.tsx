import { ConnectButton, Web3ConfigProvider, zh_CN } from 'pelican-web3-lib';

const App: React.FC = () => {
  return (
    <Web3ConfigProvider locale={zh_CN}>
      <ConnectButton />
    </Web3ConfigProvider>
  );
};

export default App;
