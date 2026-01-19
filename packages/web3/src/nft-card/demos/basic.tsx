import React from 'react';
import { Space } from 'antd';
import { NFTCard } from 'pelican-web3-lib';

const App: React.FC = () => {
  return (
    <Space size={16}>
      <NFTCard
        name="My NFT"
        tokenId={16}
        price={{
          value: 1230000000000000000n,
        }}
        like={{
          totalLikes: 1600,
        }}
        description="This is description"
        showAction
        footer="This is footer"
        image="https://mdn.alipayobjects.com/huamei_mutawc/afts/img/A*jlrDRrBXZiEAAAAAAAAAAAAADlrGAQ/original"
      />
      <NFTCard
        type="pithy"
        name="My NFT"
        tokenId={16}
        price={{
          value: 1230000000000000000n,
        }}
        like={{
          totalLikes: 1600,
        }}
        description="This is description"
        showAction
        footer="This is footer"
        image="https://mdn.alipayobjects.com/huamei_mutawc/afts/img/A*jlrDRrBXZiEAAAAAAAAAAAAADlrGAQ/original"
      />
    </Space>
  );
};

export default App;
