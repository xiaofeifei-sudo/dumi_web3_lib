# pelican-web3-lib-tron

This package provides a [TRON](https://tron.network) adapter for [pelican-web3-lib](https://www.npmjs.com/package/pelican-web3-lib).

## Usage

```bash
npm install pelican-web3-lib pelican-web3-lib-tron --save
```

```tsx
import { ConnectButton, Connector } from 'pelican-web3-lib';
import {
  BitgetWallet,
  BybitWallet,
  OkxTronWallet,
  TronlinkWallet,
  TronWeb3ConfigProvider,
} from 'pelican-web3-lib-tron';

const Basic = () => {
  return (
    <TronWeb3ConfigProvider wallets={[TronlinkWallet, OkxTronWallet, BitgetWallet, BybitWallet]}>
      <Connector>
        <ConnectButton />
      </Connector>
    </TronWeb3ConfigProvider>
  );
};

export default Basic;
```

For more examples, refer to [TRON - Ant Design Web3](https://web3.ant.design/components/tron).

## Documentation

- For more information, visit [Ant Design Web3](https://web3.ant.design).
- For an introduction to TRON, visit [TRON](https://tron.network).
