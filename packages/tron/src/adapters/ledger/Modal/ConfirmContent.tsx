import React, { useMemo } from 'preact/compat';
import { getLangText } from './lang';
import { LedgerIcon } from './LedgerIcon';
import { LoadingIcon } from './LoadingIcon';
export function ConfirmContent(props: { address: string }) {
    const langText = useMemo(() => getLangText(), []);
    return (
        <div style={{ textAlign: 'center' }} data-testid="confirm-content">
            <LedgerIcon />
            <div className="ledger-connecting-pop">
                <ul className="ledger-connecting-pop-content">
                    <li className="title" style={{ wordBreak: 'break-word' }}>
                        {langText.checkTitle}
                    </li>
                    <li>
                        <strong
                            style={{ color: '#B0170D', textAlign: 'left', fontWeight: '600' }}
                            data-testid="confirm-content-address"
                        >
                            {props.address}
                        </strong>
                    </li>
                    <li>{langText.checkTip0}</li>
                    <li>{langText.checkTip1}</li>
                </ul>
                <div className="mt-4">
                    <LoadingIcon />
                    <div>
                        <div className="text-muted">
                            <span>{langText.confirmTip}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
