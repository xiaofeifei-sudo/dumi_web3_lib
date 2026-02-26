import { isInBrowser } from '@tronweb3/tronwallet-abstract-adapter';
import { CoreHelperUtil } from 'pelican-web3-lib-common';

/**
 * 判断是否支持 TokenPocket（窗口存在 tokenpocket 对象且注入了 tronWeb）。
 */
export function supportTokenPocket() {
    const tp = (window as any).tokenpocket;
    return typeof tp !== 'undefined' && !!(tp?.tronWeb || tp?.tron);
}

/**
 * Detect if in TokenPocketApp
 * There will be a `tokenpocket` object on window
 * 检测当前是否运行在 TokenPocket App 内置的 WebView 中。
 * 若在 App 中，window 上会存在 `tokenpocket` 对象。
 */
export function isInTokenPocket() {
    return isInBrowser() && typeof (window as any).tokenpocket !== 'undefined';
}

/**
 * 在移动端环境下尝试通过 DeepLink 唤起 TokenPocket 并打开当前页面。
 * 当不支持 TokenPocket 且处于移动端浏览器且不在 TokenPocket App 内时：
 * - 构造 tpdapp://open 链接并跳转，以引导用户在 TokenPocket 中打开本页面。
 * @returns 是否已触发 DeepLink 跳转
 */
export function openTokenPocket() {
    if (!supportTokenPocket() && CoreHelperUtil.isMobile() && !isInTokenPocket()) {
        const { origin, pathname, search, hash } = window.location;
        const url = origin + pathname + search + hash;
        const params = {
            action: 'open',
            actionId: Date.now() + '',
            callbackUrl: 'http://someurl.com', // 无需回调，仅占位
            blockchain: 'Tron',
            chain: 'Tron',
            url,
            protocol: 'TokenPocket',
            version: '1.0',
        };
        window.location.href = `tpdapp://open?params=${encodeURIComponent(JSON.stringify(params))}`;
        return true;
    }
    return false;
}
