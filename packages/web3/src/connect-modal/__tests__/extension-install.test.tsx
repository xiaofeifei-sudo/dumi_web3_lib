import { fireEvent, render, waitFor } from '@testing-library/react';
import { ConnectModal } from 'pelican-web3-lib';
import { metadata_MetaMask } from 'pelican-web3-lib-assets';
import { describe, expect, it, vi } from 'vitest';

describe('ConnectModal with hasExtensionInstalled', () => {
  it('hasExtensionInstalled => true', async () => {
    const onWalletSelected = vi.fn();
    const wallet = {
      ...metadata_MetaMask,
      hasWalletReady: async () => {
        return true;
      },
      hasExtensionInstalled: async () => {
        return true;
      },
    };
    const App = () => (
      <ConnectModal
        open
        title="ConnectModal"
        footer="Powered by AntChain"
        mode="normal"
        onWalletSelected={onWalletSelected}
        walletList={[wallet]}
      />
    );
    const { baseElement } = render(<App />);

    fireEvent.click(baseElement.querySelector('.ant-web3-connect-modal-wallet-item') as Element);
    await waitFor(() => {
      expect(onWalletSelected).toBeCalledWith(wallet, {
        connectType: 'extension',
      });
    });
  });

  it('hasExtensionInstalled => false & hasWalletReady => true', async () => {
    const onWalletSelected = vi.fn();
    const wallet = {
      ...metadata_MetaMask,
      hasWalletReady: async () => {
        return true;
      },
      hasExtensionInstalled: async () => {
        return false;
      },
    };
    const App = () => (
      <ConnectModal
        open
        title="ConnectModal"
        footer="Powered by AntChain"
        mode="normal"
        onWalletSelected={onWalletSelected}
        walletList={[wallet]}
      />
    );
    const { baseElement } = render(<App />);

    fireEvent.click(baseElement.querySelector('.ant-web3-connect-modal-wallet-item') as Element);
    await waitFor(() => {
      expect(onWalletSelected).toBeCalledWith(wallet, {});
      expect(
        baseElement.querySelector('.ant-web3-connect-modal-main-panel-header-title'),
      ).toBeNull();
    });
  });

  it('hasExtensionInstalled => false & getQrCode', async () => {
    const onWalletSelected = vi.fn();
    const wallet = {
      ...metadata_MetaMask,
      name: 'MyWallet',
      hasWalletReady: async () => {
        return true;
      },
      hasExtensionInstalled: async () => {
        return false;
      },
      getQrCode: async () => {
        return Promise.resolve({
          uri: 'https://qr.com',
        });
      },
    };
    const App = () => (
      <ConnectModal
        open
        title="ConnectModal"
        footer="Powered by AntChain"
        mode="normal"
        onWalletSelected={onWalletSelected}
        walletList={[wallet]}
      />
    );
    const { baseElement } = render(<App />);

    fireEvent.click(baseElement.querySelector('.ant-web3-connect-modal-wallet-item') as Element);
    await waitFor(() => {
      expect(onWalletSelected).toBeCalledWith(wallet, {
        connectType: 'qrCode',
      });
      expect(
        baseElement.querySelector('.ant-web3-connect-modal-main-panel-header-title')?.textContent,
      ).toBe('Scan with MyWallet');
    });
  });

  it('hasWalletReady => false', async () => {
    const onWalletSelected = vi.fn();
    const wallet = {
      ...metadata_MetaMask,
      name: 'CustomWallet',
      hasWalletReady: async () => {
        return false;
      },
      hasExtensionInstalled: async () => {
        return true;
      },
    };
    const App = () => (
      <ConnectModal
        open
        title="ConnectModal"
        footer="Powered by AntChain"
        mode="normal"
        onWalletSelected={onWalletSelected}
        walletList={[wallet]}
      />
    );
    const { baseElement } = render(<App />);

    fireEvent.click(baseElement.querySelector('.ant-web3-connect-modal-wallet-item') as Element);
    await waitFor(() => {
      expect(
        baseElement.querySelector('.ant-web3-connect-modal-main-panel-header-title')?.textContent,
      ).toBe('Get CustomWallet');
    });
  });
});
