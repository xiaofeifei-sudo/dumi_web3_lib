/* eslint-disable react/no-unknown-property */
import type { ReactNode } from 'react';
import { useContext, useMemo } from 'react';

import { getPlatform } from '../utils';
import { connectModalContext } from '../context';
import MainPanelHeader from './MainPanelHeader';

const CardItem: React.FC<{
  icon: ReactNode;
  link?: string;
  onClick?: () => void;
}> = ({ icon, link, onClick }) => {
  const { prefixCls } = useContext(connectModalContext);
  const content = (
    <>
      <div className={`${prefixCls}-card-icon`}>{icon}</div>
    </>
  );
  return link ? (
    <a className={`${prefixCls}-card-item`} target="_blank" href={link} rel="noreferrer">
      {content}
    </a>
  ) : (
    // biome-ignore lint/a11y/useKeyWithClickEvents: by design
    <div className={`${prefixCls}-card-item`} onClick={onClick}>
      {content}
    </div>
  );
};

const WalletCard: React.FC = () => {
  const { prefixCls, selectedWallet, updatePanelRoute } =
    useContext(connectModalContext);
  const selectedExtension = useMemo(
    () =>
      selectedWallet?.extensions
        ? selectedWallet.extensions.find((item) => item.key === getPlatform())
        : undefined,
    [selectedWallet?.extensions],
  );
  return (
    <>
      <MainPanelHeader />
      <div className={`${prefixCls}-card-list`}>
        {selectedExtension && (
          <CardItem
            link={selectedExtension.link}
            icon={
              typeof selectedExtension.browserIcon === 'string' ? (
                <img alt="selected extension browser icon" src={selectedExtension.browserIcon} />
              ) : (
                selectedExtension.browserIcon
              )
            }
          />
        )}
        {selectedWallet?.app && (
          <CardItem
            icon={
              typeof selectedWallet.icon === 'string' ? (
                <img alt="selected wallet icon" src={selectedWallet.icon} />
              ) : (
                selectedWallet.icon
              )
            }
            onClick={() => {
              updatePanelRoute('downloadQrCode');
            }}
          />
        )}
      </div>
    </>
  );
};

export default WalletCard;
