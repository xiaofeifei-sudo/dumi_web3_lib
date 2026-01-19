import { Space } from 'antd';
import { Address } from 'pelican-web3-lib';

const App: React.FC = () => {
  return (
    <Space direction="vertical">
      <div>
        Default: <Address address={'3ea2cfd153b8d8505097b81c87c11f5d05097c18'} />
      </div>
      <div>
        Custom:{' '}
        <Address address={'3ea2cfd153b8d8505097b81c87c11f5d05097c18'} addressPrefix={'0xb1'} />
      </div>
      <div>
        No Prefix:{' '}
        <Address address={'3ea2cfd153b8d8505097b81c87c11f5d05097c18'} addressPrefix={false} />
      </div>
    </Space>
  );
};

export default App;
