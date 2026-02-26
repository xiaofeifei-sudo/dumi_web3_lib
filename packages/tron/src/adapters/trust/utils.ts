import { CoreHelperUtil } from "pelican-web3-lib-common";

/**
 * 判断是否支持 Trust 钱包（检测 window.trustwallet.tronLink 是否存在）
 */
export function supportTrust() {
    return typeof window !== 'undefined' && !!(window.trustwallet && window.trustwallet.tronLink);
}

/**
 * 判断当前是否运行在 Trust App 内置浏览器中
 */
export const isTrustApp = function () {
    if (typeof window !== 'undefined' && typeof window.navigator !== 'undefined') {
        return /Trust/i.test(window.navigator.userAgent);
    }
    return false;
};
/**
 * 在移动端环境尝试唤起 Trust App 并打开当前页面
 * - 非 Trust App 环境且为移动浏览器时，通过 DeepLink 跳转
 * - 返回是否已触发跳转
 */
export function openTrustWallet() {
    if (!isTrustApp() && CoreHelperUtil.isMobile()) {
        window.location.href = 'https://link.trustwallet.com/open_url?url=' + encodeURIComponent(window.location.href);
        return true;
    }

    return false;
}
