import React, { useMemo } from 'preact/compat';
import { getLangText } from './lang';
import { LedgerIcon } from './LedgerIcon';
import { LoadingIcon } from './LoadingIcon';
export function ConnectingContent() {
    const langText = useMemo(() => getLangText(), []);
    return (
        <div style={{ textAlign: 'center' }} data-testid="connecting-content">
            <LedgerIcon />
            <div className="ledger-connecting-pop">
                <ul className="ledger-connecting-pop-content">
                    <li className="title">{langText.loadingTip0}</li>
                </ul>
                <div className="mt-4">
                    <LoadingIcon />
                    <div>
                        <div className="text-muted">
                            <span>{langText.loadingTip4}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
