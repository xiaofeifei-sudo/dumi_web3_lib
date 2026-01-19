import { render } from '@testing-library/react';
import { ConnectButton } from 'pelican-web3-lib';
import { WagmiWeb3ConfigProvider } from 'pelican-web3-lib-wagmi';
import { describe, expect, it } from 'vitest';
import { createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';

describe('WagmiWeb3ConfigProvider', () => {
  it('mount correctly', () => {
    const config = createConfig({
      chains: [mainnet],
      transports: {
        [mainnet.id]: http(),
      },
      connectors: [],
    });

    const App = () => (
      <WagmiWeb3ConfigProvider
        locale={{
          ConnectButton: {
            connect: 'test intl',
          },
        }}
        config={config}
      >
        <ConnectButton />
      </WagmiWeb3ConfigProvider>
    );
    const { baseElement } = render(<App />);
    expect(baseElement.querySelector('.ant-btn')?.textContent).toBe('test intl');
  });
});
