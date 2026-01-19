import { Space } from 'antd';
import { BitcoinCircleColorful, EthereumFilled } from 'pelican-web3-lib-icons';

const App: React.FC = () => {
  return (
    <Space wrap>
      <BitcoinCircleColorful />
      <EthereumFilled />
    </Space>
  );
};

export default App;
