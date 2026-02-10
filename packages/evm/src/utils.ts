import { metadata_WalletConnect } from 'pelican-web3-lib-assets';
import type {Connector as WagmiConnector} from 'wagmi';
import {injected} from 'wagmi/connectors';

/**
 * 判断是否为 EIP-6963 注入式连接器
 * 满足 injected 类型且包含 icon、id、name 视为 EIP-6963
 */
const isEIP6963Connector = (connector: WagmiConnector) => {
  return !!(connector.type === injected.type && connector.icon && connector.id && connector.name);
};

const isWalletConnectConnector = (connector?: WagmiConnector) => {
  return (
    connector?.name === metadata_WalletConnect.name
  );
};

export {isEIP6963Connector, isWalletConnectConnector};
