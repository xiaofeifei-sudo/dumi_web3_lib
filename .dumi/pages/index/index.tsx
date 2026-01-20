import React, { useEffect } from 'react';

const RedirectHome: React.FC = () => {
  useEffect(() => {
    const isZh =
      document.documentElement.getAttribute('lang') === 'zh-CN' ||
      window.location.pathname.includes('-cn');
    const target = isZh ? '/components/overview-cn' : '/components/overview';
    window.location.replace(target);
  }, []);
  return null;
};

export default RedirectHome;
