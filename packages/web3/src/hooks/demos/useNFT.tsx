import React from 'react';
import { Image, Space, Spin } from 'antd';
import { useNFT } from 'pelican-web3-lib';

const getNFTMetadata = async (params: { address: string; tokenId?: bigint }) => {
  const tokenId = params.tokenId ?? 0n;
  const selector = '0xc87b56dd';
  const idHex = tokenId.toString(16);
  const padded = idHex.padStart(64, '0');
  const data = selector + padded;
  const res = await fetch('https://cloudflare-eth.com', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_call',
      params: [{ to: params.address, data }, 'latest'],
    }),
  });
  const json = await res.json();
  const hex = json?.result as string;
  const clean = hex.startsWith('0x') ? hex.slice(2) : hex;
  const lenHex = clean.slice(64, 128);
  const length = Number(BigInt('0x' + lenHex));
  const strHex = clean.slice(128, 128 + length * 2);
  const bytes = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    bytes[i] = parseInt(strHex.slice(i * 2, i * 2 + 2), 16);
  }
  const uri = new TextDecoder().decode(bytes);
  const httpUri = uri.startsWith('ipfs://') ? `https://ipfs.io/ipfs/${uri.replace('ipfs://', '')}` : uri;
  const mRes = await fetch(httpUri);
  const m = await mRes.json();
  return { name: m?.name, image: m?.image };
};

const App: React.FC = () => {
  const { metadata, error, loading } = useNFT(
    '0x79fcdef22feed20eddacbb2587640e45491b757f',
    42n,
    getNFTMetadata,
  );
  if (error) {
    return <div>{error.message}</div>;
  }
  return (
    <Spin spinning={loading}>
      <Space direction="vertical">
        <div>{metadata.name}</div>
        {metadata.image ? <Image src={metadata.image} width={240} /> : null}
      </Space>
    </Spin>
  );
};

export default App;
