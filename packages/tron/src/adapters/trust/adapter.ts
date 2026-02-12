import {
    Adapter,
    AdapterState,
    isInBrowser,
    WalletReadyState,
    WalletSignMessageError,
    WalletNotFoundError,
    WalletDisconnectedError,
    WalletConnectionError,
    WalletSignTransactionError,
    WalletGetNetworkError,
} from '@tronweb3/tronwallet-abstract-adapter';
import type {
    Transaction,
    SignedTransaction,
    AdapterName,
    BaseAdapterConfig,
    Network,
} from '@tronweb3/tronwallet-abstract-adapter';

import { openTrustWallet, supportTrust } from './utils';
import { getNetworkInfoByTronWeb, type TronLinkWallet } from '../tronlink/adapter';
import type { TronLinkMessageEvent, AccountsChangedEventData } from '../tronlink/types';

/**
 * Trust 钱包适配器
 * - 集成 Trust Wallet 提供的 tronLink 能力，在 Web dApp 中完成账户连接、网络信息获取、消息/交易签名等操作
 * - 通过轮询方式检测钱包是否存在，并在移动端可选地使用 DeepLink 唤起 Trust App
 */
declare global {
    interface Window {
        trustwallet?: {
            tronLink: TronLinkWallet;
        };
    }
}

export interface TrustAdapterConfig extends BaseAdapterConfig {
    /**
     * Timeout in millisecond for checking if Trust wallet exists.
     * Default is 2 * 1000ms
     *
     * 检测 Trust 钱包是否存在的超时时间（毫秒）
     * 默认 2000ms；在此时间内以固定间隔轮询页面环境是否注入了 trustwallet.tronLink
     */
    checkTimeout?: number;

    /**
     * Set if open app using DeepLink.
     * Default is true.
     *
     * 是否在移动端使用 DeepLink 唤起 Trust App
     * 默认开启；当检测到当前为移动浏览器且非 Trust App 内环境时，会尝试跳转唤起
     */
    openAppWithDeeplink?: boolean;
}

export const TrustAdapterName = 'Trust' as AdapterName<'Trust'>;

export class TrustAdapter extends Adapter {
    /** 适配器名称（用于展示与区分） */
    name = TrustAdapterName;
    /** 钱包主页地址（用于未安装时的引导） */
    url = 'https://trustwallet.com';
    /** 钱包图标（Base64 SVG） */
    icon =
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTgiIGhlaWdodD0iNjUiIHZpZXdCb3g9IjAgMCA1OCA2NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgOS4zODk0OUwyOC44OTA3IDBWNjUuMDA0MkM4LjI1NDUgNTYuMzM2OSAwIDM5LjcyNDggMCAzMC4zMzUzVjkuMzg5NDlaIiBmaWxsPSIjMDUwMEZGIi8+CjxwYXRoIGQ9Ik01Ny43ODIyIDkuMzg5NDlMMjguODkxNSAwVjY1LjAwNDJDNDkuNTI3NyA1Ni4zMzY5IDU3Ljc4MjIgMzkuNzI0OCA1Ny43ODIyIDMwLjMzNTNWOS4zODk0OVoiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcl8yMjAxXzY5NDIpIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfMjIwMV82OTQyIiB4MT0iNTEuMzYxNSIgeTE9Ii00LjE1MjkzIiB4Mj0iMjkuNTM4NCIgeTI9IjY0LjUxNDciIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agb2Zmc2V0PSIwLjAyMTEyIiBzdG9wLWNvbG9yPSIjMDAwMEZGIi8+CjxzdG9wIG9mZnNldD0iMC4wNzYyNDIzIiBzdG9wLWNvbG9yPSIjMDA5NEZGIi8+CjxzdG9wIG9mZnNldD0iMC4xNjMwODkiIHN0b3AtY29sb3I9IiM0OEZGOTEiLz4KPHN0b3Agb2Zmc2V0PSIwLjQyMDA0OSIgc3RvcC1jb2xvcj0iIzAwOTRGRiIvPgo8c3RvcCBvZmZzZXQ9IjAuNjgyODg2IiBzdG9wLWNvbG9yPSIjMDAzOEZGIi8+CjxzdG9wIG9mZnNldD0iMC45MDI0NjUiIHN0b3AtY29sb3I9IiMwNTAwRkYiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K';

    config: Required<TrustAdapterConfig>;

    private _readyState: WalletReadyState = isInBrowser() ? WalletReadyState.Loading : WalletReadyState.NotFound;
    private _state: AdapterState = AdapterState.Loading;
    /** 当前是否处于连接流程（防重入） */
    private _connecting: boolean;
    /** 注入的 tronLink 钱包对象（由 Trust App 提供） */
    private _wallet: TronLinkWallet | null;
    /** 当前已连接地址（base58） */
    private _address: string | null;

    constructor(config: TrustAdapterConfig = {}) {
        super();
        const { checkTimeout = 2 * 1000, openUrlWhenWalletNotFound = true, openAppWithDeeplink = true } = config;

        if (typeof checkTimeout !== 'number') {
            throw new Error('[TrustAdapter] config.checkTimeout should be a number');
        }

        this.config = {
            checkTimeout,
            openAppWithDeeplink,
            openUrlWhenWalletNotFound,
        };
        this._connecting = false;
        this._wallet = null;
        this._address = null;

        if (!isInBrowser()) {
            this._readyState = WalletReadyState.NotFound;
            this.setState(AdapterState.NotFound);
            return;
        }
        if (supportTrust()) {
            this._readyState = WalletReadyState.Found;
            this._updateWallet();
        } else {
            this._checkWallet().then(() => {
                if (this.connected) {
                    this.emit('connect', this.address || '');
                }
            });
        }
    }

    /** 当前连接地址（可能为空） */
    get address() {
        return this._address;
    }

    /** 适配器状态（加载中/未找到/已连接/已断开等） */
    get state() {
        return this._state;
    }

    /** 钱包就绪状态（未找到/加载中/已找到） */
    get readyState() {
        return this._readyState;
    }

    /** 是否正在连接中 */
    get connecting() {
        return this._connecting;
    }

    /**
     * Get network information used by Trust.
     * @returns {Network} Current network information.
     *
     * 获取当前网络信息（通过 tronWeb 推断链 ID、节点、主网/测试网等）
     */
    async network(): Promise<Network> {
        try {
            await this._checkWallet();
            if (this.state !== AdapterState.Connected) throw new WalletDisconnectedError();
            const wallet = this._wallet;
            if (!wallet || !wallet.tronWeb) throw new WalletDisconnectedError();
            try {
                return await getNetworkInfoByTronWeb(wallet.tronWeb);
            } catch (e: any) {
                throw new WalletGetNetworkError(e?.message, e);
            }
        } catch (e: any) {
            this.emit('error', e);
            throw e;
        }
    }

    /**
     * 连接钱包
     * - 移动端可选地唤起 Trust App
     * - 触发 tron_requestAccounts 以获取账户授权
     * - 成功后设置地址、状态并开始监听账户事件
     */
    async connect(): Promise<void> {
        try {
            this.checkIfopenTrustWallet();
            if (this.connected || this.connecting) return;
            await this._checkWallet();
            if (this.state === AdapterState.NotFound) {
                if (this.config.openUrlWhenWalletNotFound !== false && isInBrowser()) {
                    window.open(this.url, '_blank');
                }
                throw new WalletNotFoundError();
            }
            if (!this._wallet) return;
            this._connecting = true;
            const wallet = this._wallet as TronLinkWallet;
            try {
                const res = await wallet.request({ method: 'tron_requestAccounts' });
                if (!res) {
                    throw new WalletConnectionError('Request connect error.');
                }
                if (res.code === 4000) {
                    throw new WalletConnectionError(
                        'The same DApp has already initiated a request to connect to trustwallet, and the pop-up window has not been closed.'
                    );
                }
                if (res.code === 4001) {
                    throw new WalletConnectionError('The user rejected connection.');
                }
            } catch (error: any) {
                throw new WalletConnectionError(error?.message, error);
            }

            const address = wallet.tronWeb.defaultAddress?.base58 || '';
            this.setAddress(address);
            this.setState(AdapterState.Connected);
            this._listenEvent();
            if (this.connected) {
                this.emit('connect', this.address || '');
            }
        } catch (error: any) {
            this.emit('error', error);
            throw error;
        } finally {
            this._connecting = false;
        }
    }

    /**
     * 断开连接
     * - 清理事件监听
     * - 清空地址并更新状态
     */
    async disconnect(): Promise<void> {
        this._stopListenEvent();
        if (this.state !== AdapterState.Connected) {
            return;
        }
        this.setAddress(null);
        this.setState(AdapterState.Disconnect);
        this.emit('disconnect');
    }

    /**
     * 交易签名
     * @param transaction 原始交易对象
     * @param privateKey 可选私钥（通常留空由钱包签名）
     * @returns 已签名的交易
     */
    async signTransaction(transaction: Transaction, privateKey?: string): Promise<SignedTransaction> {
        try {
            const wallet = await this.checkAndGetWallet();

            try {
                return await wallet.tronWeb.trx.sign(transaction, privateKey);
            } catch (error: any) {
                if (error instanceof Error || (typeof error === 'object' && error.message)) {
                    throw new WalletSignTransactionError(error.message, error);
                } else if (typeof error === 'string') {
                    throw new WalletSignTransactionError(error, new Error(error));
                } else {
                    throw new WalletSignTransactionError('Unknown error', error);
                }
            }
        } catch (error: any) {
            this.emit('error', error);
            throw error;
        }
    }

    /**
     * 多重签名
     * @param transaction 交易对象
     * @param privateKey 私钥或 false（false 表示使用钱包持有的密钥）
     * @param permissionId 权限 ID（多签权限）
     * @returns 已签名的交易
     */
    async multiSign(
        transaction: Transaction,
        privateKey?: string | false,
        permissionId?: number
    ): Promise<SignedTransaction> {
        try {
            const wallet = await this.checkAndGetWallet();

            try {
                return await wallet.tronWeb.trx.multiSign(transaction, privateKey, permissionId);
            } catch (error: any) {
                if (error instanceof Error || (typeof error === 'object' && error.message)) {
                    throw new WalletSignTransactionError(error.message, error);
                } else if (typeof error === 'string') {
                    throw new WalletSignTransactionError(error, new Error(error));
                } else {
                    throw new WalletSignTransactionError('Unknown error', error);
                }
            }
        } catch (error: any) {
            this.emit('error', error);
            throw error;
        }
    }

    /**
     * 消息签名（EIP-191 V2）
     * @param message 文本消息
     * @param privateKey 可选私钥（通常留空）
     * @returns 签名字符串
     */
    async signMessage(message: string, privateKey?: string): Promise<string> {
        try {
            const wallet = await this.checkAndGetWallet();
            try {
                return await wallet.tronWeb.trx.signMessageV2(message, privateKey);
            } catch (error: any) {
                if (error instanceof Error || (typeof error === 'object' && error.message)) {
                    throw new WalletSignMessageError(error.message, error);
                } else if (typeof error === 'string') {
                    throw new WalletSignMessageError(error, new Error(error));
                } else {
                    throw new WalletSignMessageError('Unknown error', error);
                }
            }
        } catch (error: any) {
            this.emit('error', error);
            throw error;
        }
    }

    /**
     * 检查并返回有效钱包实例
     * - 确保已连接且 tronWeb 可用
     */
    private async checkAndGetWallet() {
        this.checkIfopenTrustWallet();
        await this._checkWallet();
        if (this.state !== AdapterState.Connected) throw new WalletDisconnectedError();
        const wallet = this._wallet;
        if (!wallet || !wallet.tronWeb) throw new WalletDisconnectedError();
        return wallet as TronLinkWallet;
    }

    /** 开始监听来自钱包的消息事件（账户变化/连接/断开） */
    private _listenEvent() {
        this._stopListenEvent();
        window.addEventListener('message', this.messageHandler);
    }

    /** 停止事件监听 */
    private _stopListenEvent() {
        window.removeEventListener('message', this.messageHandler);
    }

    /**
     * 处理钱包消息事件
     * - accountsChanged：账户切换或登出
     * - connect：完成连接并同步地址
     * - disconnect：断开连接
     */
    private messageHandler = (e: TronLinkMessageEvent) => {
        const message = e.data?.message;
        if (!message) {
            return;
        }
        if (message.action === 'accountsChanged') {
            setTimeout(() => {
                const preAddr = this.address || '';
                if ((this._wallet as TronLinkWallet)?.ready) {
                    const address = (message.data as AccountsChangedEventData).address;
                    this.setAddress(address);
                    this.setState(AdapterState.Connected);
                } else {
                    this.setAddress(null);
                    this.setState(AdapterState.Disconnect);
                }
                const address = this.address || '';
                if (address !== preAddr) {
                    this.emit('accountsChanged', this.address || '', preAddr);
                }
                if (!preAddr && this.address) {
                    this.emit('connect', this.address);
                } else if (preAddr && !this.address) {
                    this.emit('disconnect');
                }
            }, 200);
        } else if (message.action === 'connect') {
            const isCurConnected = this.connected;
            const preAddress = this.address || '';
            const address = (this._wallet as TronLinkWallet).tronWeb?.defaultAddress?.base58 || '';
            this.setAddress(address);
            this.setState(AdapterState.Connected);
            if (!isCurConnected) {
                this.emit('connect', address);
            } else if (address !== preAddress) {
                this.emit('accountsChanged', this.address || '', preAddress);
            }
        } else if (message.action === 'disconnect') {
            this.setAddress(null);
            this.setState(AdapterState.Disconnect);
            this.emit('disconnect');
        }
    };

    /**
     * 在移动端环境中可选地尝试唤起 Trust App（DeepLink）
     * - 若成功跳转，则抛出 WalletNotFoundError 以中断当前流程（等待用户回到 App 内继续）
     */
    private checkIfopenTrustWallet() {
        if (this.config.openAppWithDeeplink === false) {
            return;
        }
        if (openTrustWallet()) {
            throw new WalletNotFoundError();
        }
    }

    private _checkPromise: Promise<boolean> | null = null;
    /**
     * check if wallet exists by interval, the promise only resolve when wallet detected or timeout
     * @returns if trustwallet exists
     *
     * 通过定时轮询检查钱包是否存在；当检测到或超时后结束
     * 返回是否检测到 Trust 钱包
     */
    private _checkWallet(): Promise<boolean> {
        if (this.readyState === WalletReadyState.Found) {
            return Promise.resolve(true);
        }
        if (this._checkPromise) {
            return this._checkPromise;
        }
        const interval = 100;
        const maxTimes = Math.floor(this.config.checkTimeout / interval);
        let times = 0,
            timer: ReturnType<typeof setInterval>;
        this._checkPromise = new Promise((resolve) => {
            const check = () => {
                times++;
                const isSupport = supportTrust();
                if (isSupport || times > maxTimes) {
                    if (timer) clearInterval(timer);
                    this._readyState = isSupport ? WalletReadyState.Found : WalletReadyState.NotFound;
                    this._updateWallet();
                    this.emit('readyStateChanged', this.readyState);
                    resolve(isSupport);
                }
            };
            timer = setInterval(check, interval);
            check();
        });
        return this._checkPromise;
    }

    /**
     * 根据当前环境更新钱包实例、地址与状态
     * - 若支持 Trust，则注入 tronLink 并同步地址与状态
     * - 否则清空并标记为未找到
     */
    private _updateWallet = () => {
        let state = this.state;
        let address = this.address;
        if (supportTrust()) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this._wallet = window.trustwallet!.tronLink;
            this._listenEvent();
            address = this._wallet.tronWeb?.defaultAddress?.base58 || null;
            state = this._wallet.ready ? AdapterState.Connected : AdapterState.Disconnect;
        } else {
            this._wallet = null;
            address = null;
            state = AdapterState.NotFound;
        }
        this.setAddress(address);
        this.setState(state);
    };

    /** 设置当前地址（内部状态持久） */
    private setAddress(address: string | null) {
        this._address = address;
    }

    /**
     * 更新适配器状态并触发变更事件
     * @param state 新状态
     */
    private setState(state: AdapterState) {
        const preState = this.state;
        if (state !== preState) {
            this._state = state;
            this.emit('stateChanged', state);
        }
    }
}
