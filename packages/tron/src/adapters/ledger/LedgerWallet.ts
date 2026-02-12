/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Trx from '@ledgerhq/hw-app-trx';
import type Transport from '@ledgerhq/hw-transport';
import TransportWebHID from '@ledgerhq/hw-transport-webhid';
import type { BaseAdapterConfig, SignedTransaction, Transaction } from '@tronweb3/tronwallet-abstract-adapter';
import { openConnectingModal, openSelectAccountModal, openVerifyAddressModal } from './Modal/openModal';

/**
 * 辅助：等待指定毫秒
 * - Ledger 在地址/签名获取期间不支持并发操作，必要时需要做轻量等待
 */
async function wait(timeout: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);
    });
}
function isFunction(fn: unknown) {
    return typeof fn === 'function';
}

export type SelectAccount = (params: { accounts: Account[]; ledgerUtils: LedgerUtils }) => Promise<Account>;

export interface LedgerWalletConfig extends BaseAdapterConfig {
    /**
     * 初始账户加载数量（建立连接后一次性拉取），默认 1
     */
    accountNumber?: number;
    /**
     * 连接 Ledger 并获取账户前的钩子函数。
     * 默认会弹出一个提示模态框，提醒用户准备好设备并进入 Tron 应用。
     * 若设置该函数，将执行你的自定义逻辑并禁用默认模态框。
     */
    beforeConnect?: () => Promise<unknown> | unknown;
    /**
     * 连接成功并获取初始账户后的选择钩子。
     * 该函数需返回选中的账户（包含账户索引 index），后续如 signMessage 将使用该账户。
     */
    selectAccount?: SelectAccount;

    /**
     * 根据索引生成 BIP44 派生路径的函数。
     * Tron 默认路径：`44'/195'/${index}'/0/0`（195 为 Tron 的 coin type）
     */
    getDerivationPath?: (index: number) => string;
}
/**
 * 从 Ledger 获取多个账户（区间 [from, to)）
 */
export type GetAccounts = (from: number, to: number) => Promise<Account[]>;

export type Account = {
    /**
     * 账户索引（用于生成 BIP44 派生路径）
     */
    index: number;
    /**
     * BIP44 派生路径
     */
    path: string;
    /**
     * 派生得到的地址
     */
    address: string;
};
export interface LedgerUtils {
    /**
     * 按索引从 Ledger 批量获取账户（from 含，to 不含）。
     * 可用于“加载更多账户”的场景。
     */
    getAccounts: GetAccounts;
    /**
     * 使用指定索引获取地址（内部通过 getDerivationPath(index) 生成路径）。
     * 若 display 为 true，将在设备上请求用户确认；用户确认则 resolve，取消则 reject。
     */
    getAddress: (index: number, display: boolean) => Promise<{ publicKey: string; address: string }>;
}

const defaultSelectAccount: SelectAccount = async function ({ accounts, ledgerUtils }) {
    const account = await openSelectAccountModal({
        accounts,
        getAccounts: ledgerUtils.getAccounts,
    });
    const closeConfirm = openVerifyAddressModal(account.address);
    try {
        await ledgerUtils.getAddress(account.index, true);
    } finally {
        closeConfirm?.();
    }

    return account;
};
/**
 * Ledger 钱包核心类
 * - 封装与 Ledger 设备的交互，包括：建立 WebHID 传输、地址派生、消息/交易签名
 * - 以“选定账户索引”为当前上下文，所有签名操作均基于该索引的 BIP44 路径
 * - 并发限制：Ledger 不支持并发获取地址或签名，内部以 fetchState/等待机制串行化
 * - 生命周期：
 *   - makeApp：创建 WebHID Transport 与 Trx 应用实例
 *   - cleanUp：关闭 Transport 并释放应用实例，避免占用设备
 */
export class LedgerWallet {
    /** 已缓存的账户列表（按索引存储，可能存在稀疏） */
    private accounts: Account[];
    /** Ledger Tron 应用实例（Trx），需搭配 WebHID Transport 使用 */
    private app: Trx | null = null;
    /** WebHID 传输对象，负责与浏览器的 HID 通道通信 */
    private transport: Transport | null = null;
    /** 获取状态：Initial（空闲）/ Fetching（获取中）/ Finished（完成） */
    private fetchState: 'Initial' | 'Fetching' | 'Finished' = 'Initial';
    /** 当前选定账户索引（影响派生路径与签名行为） */
    private selectedIndex = 0;
    /** 构造时传入的配置项（包含钩子/路径生成等） */
    private config: LedgerWalletConfig;

    /** 当前选定地址（来自 selectedIndex 对应的账户） */
    private _address = '';
    constructor(config: LedgerWalletConfig = {}) {
        this.accounts = [];
        const { accountNumber = 1 } = config;
        (['beforeConnect', 'selectAccount', 'getDerivationPath'] as (keyof LedgerWalletConfig)[]).forEach((func) => {
            if (config[func] && !isFunction(config[func])) {
                throw new Error(`[Ledger]: ${func} must be a function!`);
            }
        });

        if (accountNumber && !Number.isInteger(+accountNumber)) {
            throw new Error('[Ledger]: accountNumber must be an integer!');
        }
        this.config = {
            ...config,
            accountNumber,
        };
    }

    get address() {
        return this._address;
    }

    /**
     * 建立与 Ledger 的交互上下文并选定账户
     * - 若传入 options.account（包含 index/address），则直接使用该账户并跳过设备交互
     * - 默认流程：
     *   1) 执行 beforeConnect 或弹出“请进入 Tron 应用”的提示模态框
     *   2) makeApp 创建 WebHID 传输与 Trx 实例
     *   3) 获取索引 0 的账户并缓存，清理连接（释放设备），再按需求批量加载更多账户
     *   4) 弹出账户选择模态框，支持在选择前进行“在设备上显示地址并确认”
     *   5) 记录选定索引与地址
     * - 任意阶段发生异常都会在 finally 中进行 cleanUp，避免设备通道被占用
     */
    async connect(options?: { account: Omit<Account, 'path'> }) {
        if (options?.account && typeof options.account === 'object') {
            const account = options.account;
            this.selectedIndex = +account.index;
            this._address = account.address;
            if (account.index === undefined || account.address === undefined) {
                console.warn(
                    '[LedgerWallet] account parameter passed to connect() should have valid index and address property'
                );
            }
            return;
        }
        const ledgerUtils = {
            getAccounts: this.getAccounts,
            getAddress: this.getAddress,
        };
        this.accounts = [];
        this._address = '';
        this.selectedIndex = 0;
        const { accountNumber = 1, beforeConnect, selectAccount = defaultSelectAccount } = this.config;

        let closeConnectingModal: (() => void) | null = null;
        try {
            if (beforeConnect) {
                await beforeConnect();
            } else {
                closeConnectingModal = openConnectingModal();
            }
            await this.makeApp();

            const firstAccount = await this.getAccount(0);
            this.accounts[0] = firstAccount;

            await this.cleanUp();
            if (accountNumber > 1) {
                await this.getAccounts(1, accountNumber);
            }
            closeConnectingModal?.();
            const accounts = this.accounts.slice(0, accountNumber);
            const selectedAccount = await selectAccount!({
                accounts,
                ledgerUtils,
            });

            this.selectedIndex = selectedAccount.index;
            this._address = selectedAccount.address;
        } finally {
            await this.cleanUp();
        }
    }
    disconnect() {
        this.selectedIndex = 0;
        this._address = '';
    }
    /**
     * 个人消息签名（personal message）
     * - 使用当前选定索引的派生路径
     * - 将原始字符串转为十六进制后交由 Ledger 进行签名
     * - 过程中创建/释放设备连接，避免通道长期占用
     */
    async signPersonalMessage(message: string) {
        await this.waitForIdle();
        try {
            const index = this.selectedIndex;
            await this.makeApp();
            const path = this.getPathForIndex(index);
            const hex = Buffer.from(message).toString('hex');
            const res = await this.app!.signPersonalMessage(path, hex);
            return res;
        } finally {
            await this.cleanUp();
        }
    }
    /**
     * 事务签名
     * - 优先调用 app.signTransaction(path, raw_data_hex, [])
     * - 若遇到 “Too many bytes to encode” 则回退为 app.signTransactionHash(path, txID)
     * - 对返回的签名进行合并（追加进 signature 数组），保持事务结构完整
     */
    async signTransaction(transaction: Transaction | SignedTransaction): Promise<SignedTransaction> {
        await this.waitForIdle();
        try {
            const index = this.selectedIndex;
            const path = this.getPathForIndex(index);
            await this.makeApp();
            let signedResponse;
            try {
                signedResponse = await this.app!.signTransaction(path, transaction.raw_data_hex, []);
            } catch (e: any) {
                if (/Too many bytes to encode/.test(e.message)) {
                    signedResponse = await this.app!.signTransactionHash(path, transaction.txID);
                } else {
                    throw e;
                }
            }
            let signature = (transaction as SignedTransaction).signature;
            if (Array.isArray(signature)) {
                if (!signature.includes(signedResponse)) signature.push(signedResponse);
            } else {
                signature = [signedResponse];
            }
            return {
                ...transaction,
                signature,
            } as SignedTransaction;
        } finally {
            await this.cleanUp();
        }
    }
    /**
     * 批量获取账户
     * - 参数校验：from >= 0 且 from < to
     * - 串行化：若当前处于 Fetching，等待后递归调用，保证不会并发占用设备
     * - 过程：
     *   1) makeApp 建立连接
     *   2) 逐个索引调用 getAccount(i) 并缓存在 this.accounts
     *   3) cleanUp 释放连接
     * - 返回区间切片（from 到 to，不含 to）
     */
    getAccounts = async (from: number, to: number): Promise<Account[]> => {
        if (from < 0) {
            throw new Error('getAccount parameter error: from cannot be smaller than 0.');
        }
        if (from >= to) {
            throw new Error('getAccount parameter error: from cannot be bigger than to.');
        }
        if (this.fetchState === 'Fetching') {
            await wait(500);
            return this.getAccounts(from, to);
        }
        this.fetchState = 'Fetching';

        // ledger can not get address concurrently.
        await this.makeApp();
        try {
            const obj: Record<string, Account> = {};
            for (let i = from; i < to; i++) {
                const account = await this.getAccount(i);
                obj[account.index] = account;
            }
            Object.keys(obj).forEach((key) => {
                this.accounts[+key] = obj[key];
            });
            return this.accounts.slice(from, to);
        } finally {
            this.fetchState = 'Initial';
            await this.cleanUp();
        }
    };

    /**
     * 获取指定索引的地址/公钥
     * - display 为 true 时，将在设备上要求用户确认；取消则抛错
     * - 每次调用均建立连接并在 finally 中释放
     */
    public getAddress = async (index: number, display = false): Promise<{ publicKey: string; address: string }> => {
        try {
            const path = this.getPathForIndex(index);
            await this.makeApp();
            return await this.app!.getAddress(path, display);
        } finally {
            await this.cleanUp();
        }
    };

    private async getAccount(index: number) {
        const path = this.getPathForIndex(index);
        const { address } = await this.app!.getAddress(path);
        return {
            path,
            address,
            index,
        };
    }

    /**
     * 等待当前取数流程空闲
     * - 若处于 Fetching，则短暂等待并再次检查，直到恢复 Initial
     */
    private async waitForIdle() {
        if (this.fetchState === 'Fetching') {
            await wait(300);
            await this.waitForIdle();
        }
    }
    /**
     * 根据索引生成 BIP44 路径
     * - 默认：Tron 路径 `44'/195'/${index}'/0/0`
     * - 可通过 config.getDerivationPath 覆盖
     */
    private getPathForIndex(index: number) {
        return this.config.getDerivationPath ? this.config.getDerivationPath(index) : `44'/195'/${index}'/0/0`;
    }
    /**
     * 创建 WebHID Transport 与 Ledger Tron 应用实例
     * - 若已存在可用实例则复用
     * - 需在后续 finally 中调用 cleanUp 进行关闭
     */
    private async makeApp() {
        if (this.transport && this.app) {
            return;
        }
        this.transport = await TransportWebHID.create();
        this.app = new Trx(this.transport as any);
    }

    /**
     * 释放 Ledger 连接资源
     * - 关闭 Transport，置空应用实例，避免占用设备 HID 通道
     */
    private async cleanUp() {
        this.app = null as unknown as Trx;
        await this.transport?.close();
        this.transport = null as unknown as Transport;
    }
}
