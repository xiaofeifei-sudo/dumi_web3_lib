import React, { useState } from 'react';
import { TokenSelect, type Token } from 'pelican-web3-lib';
import { ETH, USDT } from 'pelican-web3-lib-assets/tokens';

const App: React.FC = () => {
  const [token, setToken] = useState<Token>();

  return <TokenSelect value={token} onChange={setToken} options={[ETH, USDT]} />;
};

export default App;
