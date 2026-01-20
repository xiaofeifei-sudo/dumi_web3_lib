import React from 'react';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { Suiet, SuiWeb3ConfigProvider } from 'pelican-web3-lib-sui';

const queryClient = new QueryClient();

const persister = createSyncStoragePersister({
  storage: typeof window !== 'undefined' ? window.localStorage : undefined,
});

const App: React.FC = () => {
  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
      <SuiWeb3ConfigProvider wallets={[Suiet()]}></SuiWeb3ConfigProvider>
    </PersistQueryClientProvider>
  );
};

export default App;
