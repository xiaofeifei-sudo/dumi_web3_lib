import { isInBrowser } from '@tronweb3/tronwallet-abstract-adapter';
import type { Tron } from './types';
import { CoreHelperUtil } from 'pelican-web3-lib-common';

/**
 * 检测是否存在 Tron 对象（TronLink 环境）
 */
export function supportTron() {
    return !!(window.tron && window.tron.isTronLink);
}
/**
 * 检测是否支持 TronLink（包含 tron / tronLink / tronWeb 三种注入）
 */
export function supportTronLink() {
    const hasTron = supportTron();
    const hasNew = !!window.tronLink;
    const hasLegacy =
        !!window.tronWeb &&
        !(window as any).okxwallet &&
        !(window as any).tokenpocket &&
        !(window as any).trustwallet;
    return hasTron || hasNew || hasLegacy;
}

/**
 * 检测是否处于 TronLink App 内部
 * 运行在 DApp Explorer 的 Tron DApp 会自动注入 iTron 对象以提供定制服务。
 * 参考：https://docs.tronlink.org/tronlink-app/dapp-support/dapp-explorer
 */
export function isInTronLinkApp() {
    return isInBrowser() && typeof (window as any).iTron !== 'undefined';
}

/**
 * 在移动端尝试通过 DeepLink 打开 TronLink App
 * - 若不支持 TronLink 且处于移动浏览器且非 TronLinkApp 内部，则尝试拉起 TronLink
 * - 参数包含 dapp 图标与名称，用于展示
 * @returns 是否已尝试跳转（true 表示已跳转）
 */
export function openTronLink(
    { dappIcon, dappName }: { dappIcon: string; dappName: string } = { dappIcon: '', dappName: '' }
) {
    if (!supportTronLink() && CoreHelperUtil.isMobile() && !isInTronLinkApp()) {
        let defaultDappName = '',
            defaultDappIcon = '';
        try {
            defaultDappName = document.title;
            const link = document.querySelector('link[rel*="icon"]');
            if (link) {
                defaultDappIcon = new URL(link.getAttribute('href') || '', location.href).toString();
            }
        } catch (e) {
            // console.error(e);
        }
        const { origin, pathname, search } = window.location;
        const url = origin + pathname + search;
        const params = {
            action: 'open',
            actionId: Date.now() + '',
            callbackUrl: 'http://someurl.com', // 无需回调
            dappIcon: dappIcon || defaultDappIcon,
            dappName: dappName || defaultDappName,
            url,
            protocol: 'TronLink',
            version: '1.0',
            chainId: '0x2b6653dc',
        };
        window.location.href = `tronlinkoutside://pull.activity?param=${encodeURIComponent(JSON.stringify(params))}`;
        return true;
    }
    return false;
}

/**
 * 等待 tronWeb 可用（TIP-1193 环境）
 * 轮询检测 tronObj.tronWeb 是否就绪，超时抛错
 */
export async function waitTronwebReady(tronObj: Tron) {
    return new Promise<void>((resolve, reject) => {
        const interval = setInterval(() => {
            if (tronObj.tronWeb) {
                clearInterval(interval);
                // eslint-disable-next-line @typescript-eslint/no-use-before-define
                clearTimeout(timeout);
                resolve();
            }
        }, 50);
        const timeout = setTimeout(() => {
            clearInterval(interval);
            reject('`window.tron.tronweb` 尚未就绪。');
        }, 2000);
    });
}
