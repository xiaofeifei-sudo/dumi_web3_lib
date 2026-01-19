import React from 'react';
import type { UniversalWeb3ProviderInterface } from 'pelican-web3-lib-common';
import { getWeb3AssetUrl, parseNumberToBigint } from 'pelican-web3-lib-common';
import { Image, type ImageProps } from 'antd';

import useNFT from '../hooks/useNFT';

export interface NFTCardProps extends ImageProps {
  address?: string;
  tokenId?: bigint | number;
  getNFTMetadata?: UniversalWeb3ProviderInterface['getNFTMetadata'];
}

export const NFTImage: React.FC<NFTCardProps> = ({
  address,
  tokenId,
  getNFTMetadata,
  alt,
  ...rest
}) => {
  const { metadata } = useNFT(address, parseNumberToBigint(tokenId), getNFTMetadata);
  return (
    <Image
      style={{ imageRendering: 'pixelated' }}
      src={getWeb3AssetUrl(metadata.image)}
      alt={alt ?? metadata.name}
      {...rest}
    />
  );
};
