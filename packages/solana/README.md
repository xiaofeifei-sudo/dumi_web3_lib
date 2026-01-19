# pelican-web3-lib-solana

This package provides a [Solana](https://solana.com) adapter for [pelican-web3-lib](https://www.npmjs.com/package/pelican-web3-lib).

## Installation

```bash
npm install pelican-web3-lib pelican-web3-lib-solana --save
```

## Usage

```tsx
import { ConnectButton, Connector } from 'pelican-web3-lib';
import { PhantomWallet, SolanaWeb3ConfigProvider } from 'pelican-web3-lib-solana';

const App: React.FC = () => {
  return (
    <SolanaWeb3ConfigProvider wallets={[PhantomWallet()]}>
      <Connector>
        <ConnectButton />
      </Connector>
    </SolanaWeb3ConfigProvider>
  );
};

export default App;
```

For more examples, refer to [Solana - Ant Design Web3](https://web3.ant.design/components/solana).

## Documentation

- For more information, visit [Ant Design Web3](https://web3.ant.design).
- For an introduction to Solana, visit [Solana](https://solana.com).
