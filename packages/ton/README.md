# pelican-web3-lib-ton

This package provides a [TON](https://ton.org) adapter for [pelican-web3-lib](https://www.npmjs.com/package/pelican-web3-lib).

## Usage

```bash
npm install pelican-web3-lib pelican-web3-lib-ton --save
```

```tsx
import { ConnectButton, Connector } from 'pelican-web3-lib';
import { okxTonWallet, tonkeeper, TonWeb3ConfigProvider } from 'pelican-web3-lib-ton';

const Basic = () => {
  return (
    <TonWeb3ConfigProvider wallets={[tonkeeper, okxTonWallet, { key: 'safepalwallet' }]}>
      <Connector>
        <ConnectButton />
      </Connector>
    </TonWeb3ConfigProvider>
  );
};

export default Basic;
```

For more examples, refer to [TON - Ant Design Web3](https://web3.ant.design/components/ton).

## Documentation

- For more information, visit [Ant Design Web3](https://web3.ant.design).
- For an introduction to TON, visit [TON](https://ton.org).
