import { getDeepLink } from '@binance/w3w-utils';
import { isInBrowser } from '@tronweb3/tronwallet-abstract-adapter';
import { CoreHelperUtil } from 'pelican-web3-lib-common';

export function supportBinanceWallet() {
    return isInBrowser() && Boolean(window.isBinance);
}

export function openBinanceWallet() {
    if (CoreHelperUtil.isMobile() && !supportBinanceWallet()) {
        window.location.href = getDeepLink(window.location.href).bnc;
        return true;
    }
    return false;
}
