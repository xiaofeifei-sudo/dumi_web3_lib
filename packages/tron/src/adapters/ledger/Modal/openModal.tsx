import React, { render } from 'preact/compat';
import type { Account, GetAccounts } from '../LedgerWallet';
import { ConfirmContent } from './ConfirmContent';
import { ConnectingContent } from './ConnectingContent';
import { getLangText } from './lang';
import { Modal } from './Modal';
import { SelectAccount } from './SelectAccount';
import { modalStyleSheetContent } from './style';

function prepareDomNode() {
    const div = document.createElement('div');
    const style = document.createElement('style');
    style.innerHTML = modalStyleSheetContent;
    document.body.append(style);
    document.body.append(div);
    function onClose() {
        div.remove();
        style.remove();
    }
    return {
        onClose,
        div,
    };
}
export function openConnectingModal() {
    const { onClose, div } = prepareDomNode();
    const langText = getLangText();
    render(
        <Modal title={langText.loadingTitle} onClose={onClose}>
            <ConnectingContent />
        </Modal>,
        div
    );

    return onClose;
}

export function openVerifyAddressModal(address: string) {
    const { onClose, div } = prepareDomNode();
    const langText = getLangText();
    render(
        <Modal width={550} title={langText.loadingTitle} onClose={onClose}>
            <ConfirmContent address={address} />
        </Modal>,
        div
    );

    return onClose;
}

export function openSelectAccountModal(options: {
    accounts: Account[];
    selectedIndex?: number;
    getAccounts: GetAccounts;
}): Promise<Account> {
    const { onClose, div } = prepareDomNode();
    const langText = getLangText();
    return new Promise((resolve, reject) => {
        function onConfirm(account: Account) {
            resolve(account);
            onClose();
        }
        function onCancel() {
            reject(new Error('Operation is canceled.'));
            onClose();
        }
        render(
            <Modal title={langText.loadingTitle} onClose={onCancel}>
                <SelectAccount
                    accounts={options.accounts}
                    selectedIndex={options.selectedIndex || 0}
                    onConfirm={onConfirm}
                    onCancel={onCancel}
                    getAccounts={options.getAccounts}
                 />
            </Modal>,
            div
        );
    });
}
