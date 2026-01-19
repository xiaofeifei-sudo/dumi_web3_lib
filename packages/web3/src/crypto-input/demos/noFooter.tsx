import React, { useState } from 'react';
import { CryptoInput, type CryptoInputProps } from 'pelican-web3-lib';
import { ETH, USDT } from 'pelican-web3-lib-assets/tokens';

const App: React.FC = () => {
  const [crypto, setCrypto] = useState<CryptoInputProps['value']>();

  return (
    <div style={{ width: 456 }}>
      <CryptoInput value={crypto} footer={false} onChange={setCrypto} options={[ETH, USDT]} />
    </div>
  );
};

export default App;
