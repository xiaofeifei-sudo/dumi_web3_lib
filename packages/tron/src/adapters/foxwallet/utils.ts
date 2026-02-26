import { CoreHelperUtil } from "pelican-web3-lib-common";

export function supportFoxWallet() {
    return (
        !!CoreHelperUtil.isMobile() && !!(window.foxwallet && window.foxwallet.tronLink && window.foxwallet.tronLink.tronWeb)
    );
}

export function openFoxWallet() {
    if (CoreHelperUtil.isMobile() && !supportFoxWallet()) {
        const { origin, pathname, search, hash } = window.location;
        const url = origin + pathname + search + hash;
        location.href = `foxwallet://dapp?url=${encodeURIComponent(url)}`;
        return true;
    }
    return false;
}
