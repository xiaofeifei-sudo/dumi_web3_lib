import type { ConfigConsumerProps } from 'pelican-web3-lib-common';

import useProvider from './useProvider';

export default function useConnection(): Pick<ConfigConsumerProps, 'connect' | 'disconnect'> {
  const { connect, disconnect } = useProvider();

  return {
    connect,
    disconnect,
  };
}
