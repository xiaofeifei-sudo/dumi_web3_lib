# pelican-web3-lib-bitcoin

This package provides a Bitcoin adapter for [pelican-web3-lib](https://www.npmjs.com/package/pelican-web3-lib).

## Installation

```bash
npm install pelican-web3-lib pelican-web3-lib-bitcoin
```

## Usage

```tsx
import { ConnectButton, Connector } from 'pelican-web3-lib';
import {
  BitcoinWeb3ConfigProvider,
  OkxWallet,
  UnisatWallet,
  XverseWallet,
} from 'pelican-web3-lib-bitcoin';

const App: React.FC = () => {
  return (
    <BitcoinWeb3ConfigProvider wallets={[XverseWallet(), UnisatWallet(), OkxWallet()]}>
      <Connector>
        <ConnectButton />
      </Connector>
    </BitcoinWeb3ConfigProvider>
  );
};

export default App;
```

For more examples, refer to [Bitcoin - Ant Design Web3](https://web3.ant.design/components/bitcoin).

## Documentation

- For more information, visit [Ant Design Web3](https://web3.ant.design).
