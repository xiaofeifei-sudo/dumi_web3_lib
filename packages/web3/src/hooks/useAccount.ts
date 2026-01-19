import type { ConfigConsumerProps } from 'pelican-web3-lib-common';

import useProvider from './useProvider';

export default function useAccount(): Pick<ConfigConsumerProps, 'account'> {
  const { account } = useProvider();

  return {
    account,
  };
}
