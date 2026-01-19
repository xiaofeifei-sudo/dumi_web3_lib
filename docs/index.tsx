import React from 'react';

export default function Index() {
  React.useEffect(() => {
    window.location.assign('/components/');
  }, []);
  return null;
}
