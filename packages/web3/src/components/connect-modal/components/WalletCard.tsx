/**
 * WalletCard 钱包安装卡片
 * - 根据当前平台展示浏览器扩展安装入口
 * - 同时提供移动端 App 的下载二维码入口
 *
 * 逻辑说明
 * - selectedExtension：依据 getPlatform() 从 extensions 中选出当前平台项
 * - 点击 App 卡片切换到 downloadQrCode 面板
 */
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
