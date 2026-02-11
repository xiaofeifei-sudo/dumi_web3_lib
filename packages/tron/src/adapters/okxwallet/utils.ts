import { isInMobileBrowser } from '@tronweb3/tronwallet-abstract-adapter';

/**
 * 检测是否支持 OKX Wallet（存在 okxwallet.tronLink 注入）
 */
export function supportOkxWallet() {
    return !!(window.okxwallet && window.okxwallet.tronLink);
}

/** 当前环境是否为 OKApp（根据 UA 判断） */
export const isOKApp = typeof navigator !== 'undefined' && /OKApp/i.test(navigator.userAgent);
/**
 * 运行环境是否在 OKApp 内部
 */
export function isInOKApp() {
    if (typeof window !== 'undefined' && typeof window.navigator !== 'undefined') {
        return /OKApp/i.test(window.navigator.userAgent);
    }
    return false;
}
/**
 * 在移动端尝试通过 DeepLink 打开 OKX Wallet
 * @returns 是否已尝试跳转（true 表示已跳转）
 */
export function openOkxWallet() {
    if (!isInOKApp() && isInMobileBrowser()) {
        window.location.href = 'okx://wallet/dapp/url?dappUrl=' + encodeURIComponent(window.location.href);
        return true;
    }
    return false;
}
