import { ArrowRightOutlined } from '@ant-design/icons';
import { Flex, Space } from 'antd';
import { ConnectButton } from 'pelican-web3-lib';
import { EthereumCircleColorful } from 'pelican-web3-lib-icons';

const App: React.FC = () => {
  return (
    <ConnectButton
      style={{
        height: 60,
        borderRadius: 12,
      }}
    >
      <Flex justify="space-between">
        <Space size={8}>
          <EthereumCircleColorful />
          <Flex vertical gap={4} align="start" style={{ width: 200 }}>
            <div>Ethereum</div>
            <div style={{ opacity: 0.25 }}>Connect to this network</div>
          </Flex>
        </Space>
        <ArrowRightOutlined style={{ opacity: 0.25 }} />
      </Flex>
    </ConnectButton>
  );
};

export default App;
