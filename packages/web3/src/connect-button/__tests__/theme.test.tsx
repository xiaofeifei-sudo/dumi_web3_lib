import { render } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import { ConnectButton } from 'pelican-web3-lib';
import { describe, expect, it } from 'vitest';

describe('ConnectButton style', () => {
  it('should use colorPrimary', async () => {
    const App = () => (
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#8442ff',
          },
        }}
      >
        <ConnectButton type="primary" />
      </ConfigProvider>
    );
    const { baseElement } = render(<App />);
    const buttonStyle = window.getComputedStyle(baseElement.querySelector('.ant-btn')!);
    expect(buttonStyle.backgroundColor).toBe('rgb(100, 46, 217)');
    expect(buttonStyle.color).toBe('rgb(255, 255, 255)');
  });
});
