# pelican-web3-lib-sui

This package provides a [Sui](https://sui.io) adapter for [pelican-web3-lib](https://www.npmjs.com/package/pelican-web3-lib).

## Installation

```bash
npm install pelican-web3-lib pelican-web3-lib-sui --save
```

## Usage

```tsx
import { ConnectButton, Connector } from 'pelican-web3-lib';
import { Slush, SuiWeb3ConfigProvider } from 'pelican-web3-lib-sui';

const App: React.FC = () => {
  return (
    <SuiWeb3ConfigProvider>
      <Connector>
        <ConnectButton />
      </Connector>
    </SuiWeb3ConfigProvider>
  );
};

export default App;
```


## Documentation

- For an introduction to Sui, visit [Sui](https://sui.io).
