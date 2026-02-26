import { CoreHelperUtil } from "pelican-web3-lib-common";

export function supportBitgetWallet() {
    return !!window.tronLink && (window as any).isBitKeep;
}

export function openBitgetWallet() {
    if (CoreHelperUtil.isMobile() && !supportBitgetWallet()) {
        const { origin, pathname, search, hash } = window.location;
        const url = origin + pathname + search + hash;
        location.href = `https://bkcode.vip?action=dapp&url=${encodeURIComponent(url)}`;
        return true;
    }
    return false;
}
