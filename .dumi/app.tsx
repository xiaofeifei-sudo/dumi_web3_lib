import React from 'react';
import { ConfigProvider } from 'antd';

export function rootContainer(container: React.ReactNode): React.ReactNode {
  console.log('运行时React版本:', React.version);

  return <ConfigProvider>{container}</ConfigProvider>;
}
