// 说明：补充浏览器环境下的全局对象声明，便于类型安全地访问钱包提供者
declare interface Window {
  unisat?: Unisat.Provider;
  // TODO: 与其他 okx 冲突
  okxwallet?: any;
  phantom?: any;
}

declare namespace Unisat {
  // 说明：Unisat 钱包的 Provider 能力声明
  interface Provider {
    requestAccounts: () => Promise<string[]>;
    getBalance: () => Promise<{ confirmed: number; unconfirmed: number; total: number }>;
    getInscriptions: (
      cursor: number,
      size: number,
    ) => Promise<{ total: number; list: Inscription[] }>;
    sendBitcoin: (
      toAddress: string,
      satoshis: number,
      options?: { feeRate: number },
    ) => Promise<string>;
    signMessage: (msg: string, type?: string) => Promise<string>;
    signPsbt: (
      psbtHex: string,
      options?: {
        autoFinalized: boolean;
        toSignInputs?: {
          index: number;
          address: string;
          publicKey: string;
          sighashTypes?: number[];
          disableTweakSigner?: boolean;
        }[];
      },
    ) => Promise<string>;
  }

  // 说明：Ordinals 铭文对象结构定义
  interface Inscription {
    address: string;
    content: string;
    contentLength: number;
    contentType: string;
    genesisTransaction: string;
    inscriptionId: string;
    inscriptionNumber: number;
    location: string;
    offset: number;
    output: string;
    outputValue: number;
    preview: string;
    timestamp: number;
  }
}
