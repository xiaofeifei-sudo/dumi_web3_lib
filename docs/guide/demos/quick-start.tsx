import { NFTImage } from 'pelican-web3-lib';
import { WagmiWeb3ConfigProvider } from 'pelican-web3-lib-wagmi';

const App: React.FC = () => {
  return (
    <WagmiWeb3ConfigProvider>
      <NFTImage width={300} address="0x79fcdef22feed20eddacbb2587640e45491b757f" tokenId={8540} />
    </WagmiWeb3ConfigProvider>
  );
};

export default App;
