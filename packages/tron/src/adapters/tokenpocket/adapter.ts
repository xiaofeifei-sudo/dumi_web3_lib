import {
    Adapter,
    AdapterState,
    isInBrowser,
    WalletReadyState,
    WalletSignMessageError,
    WalletNotFoundError,
    WalletDisconnectedError,
    WalletSignTransactionError,
    WalletGetNetworkError,
    WalletSwitchChainError,
    WalletConnectionError,
    isInMobileBrowser,
    WalletError,
} from '@tronweb3/tronwallet-abstract-adapter';
import type {
    Transaction,
    SignedTransaction,
    AdapterName,
    BaseAdapterConfig,
    Network,
    TronWeb,
} from '@tronweb3/tronwallet-abstract-adapter';
import { openTokenPocket, supportTokenPocket } from './utils';
import type { TIP6963AnnounceProviderEvent } from '@tronweb3/tronwallet-abstract-adapter';
import {
    TIP6963AnnounceProviderEventName,
    TIP6963RequestProviderEventName,
} from '@tronweb3/tronwallet-abstract-adapter';
import type { Tron, TronAccountsChangedCallback } from '../tronlink/types';

export interface TokenPocketAdapterConfig extends BaseAdapterConfig {
    /**
     * Timeout in millisecond for checking if is in TokenPocket App.
     * Default is 2 * 1000ms
     * 检测是否处于 TokenPocket 应用环境的超时时间（毫秒）。
     * 默认值为 2000ms。
     */
    checkTimeout?: number;
    /**
     * Set if open TokenPocket app using DeepLink.
     * Default is true.
     * 是否通过 DeepLink 唤起 TokenPocket 应用。
     * 默认启用（true）。
     */
    openAppWithDeeplink?: boolean;
}

export const TokenPocketAdapterName = 'TokenPocket' as AdapterName<'TokenPocket'>;

export interface TokenPocketWallet {
    ready: boolean;
    tronWeb: TronWeb;
    tron: Tron;
}

declare global {
    interface Window {
        // @ts-ignore
        tokenpocket?: TokenPocketWallet | undefined;
    }
}

/**
 * TokenPocket 适配器
 * 封装 TokenPocket 与 TronWeb 的交互，统一连接、签名与事件处理。
 * 支持桌面浏览器扩展与移动端（App 内置 WebView）两种运行环境。
 * 通过 TIP-6963 事件机制自动发现并注册钱包提供者。
 */
export class TokenPocketAdapter extends Adapter {
    name = TokenPocketAdapterName;
    url = 'https://tokenpocket.pro/';
    icon =
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGc+CjxwYXRoIGQ9Ik0xMDQxLjUyIDBILTI3VjEwMjRIMTA0MS41MlYwWiIgZmlsbD0iIzI5ODBGRSIvPgo8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDBfNDA4XzIyNSkiPgo8cGF0aCBkPSJNNDA2Ljc5NiA0MzguNjQzSDQwNi45MjdDNDA2Ljc5NiA0MzcuODU3IDQwNi43OTYgNDM2Ljk0IDQwNi43OTYgNDM2LjE1NFY0MzguNjQzWiIgZmlsbD0iIzI5QUVGRiIvPgo8cGF0aCBkPSJNNjY3LjYwMiA0NjMuNTMzSDUyMy4yNDlWNzI0LjA3NkM1MjMuMjQ5IDczNi4zODkgNTMzLjIwNCA3NDYuMzQ1IDU0NS41MTcgNzQ2LjM0NUg2NDUuMzMzQzY1Ny42NDcgNzQ2LjM0NSA2NjcuNjAyIDczNi4zODkgNjY3LjYwMiA3MjQuMDc2VjQ2My41MzNaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNDUzLjU2MyAyNzdINDQ4LjcxNkgxOTAuMjY5QzE3Ny45NTUgMjc3IDE2OCAyODYuOTU1IDE2OCAyOTkuMjY5VjM4OS42NTNDMTY4IDQwMS45NjcgMTc3Ljk1NSA0MTEuOTIyIDE5MC4yNjkgNDExLjkyMkgyNTAuOTE4SDI3NS4wMjFWNDM4LjY0NFY3MjQuNzMxQzI3NS4wMjEgNzM3LjA0NSAyODQuOTc2IDc0NyAyOTcuMjg5IDc0N0gzOTIuMTI4QzQwNC40NDEgNzQ3IDQxNC4zOTYgNzM3LjA0NSA0MTQuMzk2IDcyNC43MzFWNDM4LjY0NFY0MzYuMTU2VjQxMS45MjJINDM4LjQ5OUg0NDguMzIzSDQ1My4xN0M0OTAuMzcyIDQxMS45MjIgNTIwLjYzMSAzODEuNjYzIDUyMC42MzEgMzQ0LjQ2MUM1MjEuMDI0IDMwNy4yNTkgNDkwLjc2NSAyNzcgNDUzLjU2MyAyNzdaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNjY3LjczNSA0NjMuNTMzVjY0NS4zNUM2NzIuNzEzIDY0Ni41MjkgNjc3LjgyMSA2NDcuNDQ2IDY4My4wNjEgNjQ4LjIzMkM2OTAuMzk3IDY0OS4yOCA2OTcuOTk0IDY0OS45MzUgNzA1LjU5MiA2NTAuMDY2QzcwNS45ODUgNjUwLjA2NiA3MDYuMzc4IDY1MC4wNjYgNzA2LjkwMiA2NTAuMDY2VjUwNS40NUM2ODUuMDI2IDUwNC4wMDkgNjY3LjczNSA0ODUuODAxIDY2Ny43MzUgNDYzLjUzM1oiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcl80MDhfMjI1KSIvPgo8cGF0aCBkPSJNNzA5Ljc4MSAyNzdDNjA2LjgyMiAyNzcgNTIzLjI0OSAzNjAuNTczIDUyMy4yNDkgNDYzLjUzM0M1MjMuMjQ5IDU1Mi4wODQgNTg0Ljk0NiA2MjYuMjI1IDY2Ny43MzMgNjQ1LjM1VjQ2My41MzNDNjY3LjczMyA0NDAuMzQ3IDY4Ni41OTYgNDIxLjQ4NCA3MDkuNzgxIDQyMS40ODRDNzMyLjk2NyA0MjEuNDg0IDc1MS44MyA0NDAuMzQ3IDc1MS44MyA0NjMuNTMzQzc1MS44MyA0ODMuMDUxIDczOC42IDQ5OS40MjUgNzIwLjUyMyA1MDQuMTRDNzE3LjExNyA1MDUuMDU3IDcxMy40NDkgNTA1LjU4MSA3MDkuNzgxIDUwNS41ODFWNjUwLjA2NkM3MTMuNDQ5IDY1MC4wNjYgNzE2Ljk4NiA2NDkuOTM1IDcyMC41MjMgNjQ5LjgwNEM4MTguNTA1IDY0NC4xNzEgODk2LjMxNCA1NjIuOTU2IDg5Ni4zMTQgNDYzLjUzM0M4OTYuNDQ1IDM2MC41NzMgODEyLjg3MiAyNzcgNzA5Ljc4MSAyNzdaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNzA5Ljc4IDY1MC4wNjZWNTA1LjU4MUM3MDguNzMzIDUwNS41ODEgNzA3LjgxNiA1MDUuNTgxIDcwNi43NjggNTA1LjQ1VjY1MC4wNjZDNzA3LjgxNiA2NTAuMDY2IDcwOC44NjQgNjUwLjA2NiA3MDkuNzggNjUwLjA2NloiIGZpbGw9IndoaXRlIi8+CjwvZz4KPC9nPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzQwOF8yMjUiIHgxPSI3MDkuODQ0IiB5MT0iNTU2LjgyNyIgeDI9IjY2Ny43NTMiIHkyPSI1NTYuODI3IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IndoaXRlIi8+CjxzdG9wIG9mZnNldD0iMC45NjY3IiBzdG9wLWNvbG9yPSJ3aGl0ZSIgc3RvcC1vcGFjaXR5PSIwLjMyMzMiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSJ3aGl0ZSIgc3RvcC1vcGFjaXR5PSIwLjMiLz4KPC9saW5lYXJHcmFkaWVudD4KPGNsaXBQYXRoIGlkPSJjbGlwMF80MDhfMjI1Ij4KPHJlY3Qgd2lkdGg9IjcyOC40NDgiIGhlaWdodD0iNDcwIiBmaWxsPSJ3aGl0ZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTY4IDI3NykiLz4KPC9jbGlwUGF0aD4KPC9kZWZzPgo8L3N2Zz4K';

    config: Required<TokenPocketAdapterConfig>;
    private _readyState: WalletReadyState = isInBrowser() ? WalletReadyState.Loading : WalletReadyState.NotFound;
    private _state: AdapterState = AdapterState.Loading;
    private _connecting: boolean;
    private _wallet: TokenPocketWallet | null;
    private _address: string | null;

    constructor(config: TokenPocketAdapterConfig = {}) {
        super();
        const { checkTimeout = 2 * 1000, openUrlWhenWalletNotFound = true, openAppWithDeeplink = true } = config;
        if (typeof checkTimeout !== 'number') {
            throw new Error('[TokenPocketAdapter] config.checkTimeout should be a number');
        }
        this.config = {
            checkTimeout,
            openAppWithDeeplink,
            openUrlWhenWalletNotFound,
        };
        this._connecting = false;
        this._wallet = null;
        this._address = null;

        if (isInMobileBrowser() && supportTokenPocket()) {
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

    get address() {
        return this._address;
    }

    get state() {
        return this._state;
    }
    get readyState() {
        return this._readyState;
    }

    get connecting() {
        return this._connecting;
    }

    /**
     * Get network information.
     * 获取当前网络信息（Network）。
     * @returns {Network} Current network information.
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
     * 连接 TokenPocket 钱包，请求账户授权。
     * 桌面端通过 TIP-6963 获取 provider；移动端可通过 DeepLink 唤起 App。
     */
    async connect(): Promise<void> {
        try {
            this.checkIfOpenApp();
            if (this.connected || this.connecting) return;
            await this._checkWallet();
            if (this.readyState === WalletReadyState.NotFound) {
                if (this.config.openUrlWhenWalletNotFound !== false && isInBrowser()) {
                    window.open(this.url, '_blank');
                }
                throw new WalletNotFoundError();
            }
            if (!this._wallet) return;
            this._connecting = true;
            const wallet = this._wallet as TokenPocketWallet;
            try {
                const res = await wallet.tron.request({ method: 'eth_requestAccounts' });
                if (!res?.[0]) {
                    throw new WalletConnectionError('Request connect error.');
                }
                const address = res[0];

                this.setAddress(address);
                this.setState(AdapterState.Connected);
                this.emit('connect', this.address || '');
            } catch (e: any) {
                if (e instanceof WalletError) {
                    throw e;
                } else {
                    throw new WalletConnectionError(e?.message, e);
                }
            }
        } catch (error: any) {
            this.emit('error', error);
            throw error;
        } finally {
            this._connecting = false;
        }
    }

    /**
     * 断开连接，清理当前地址与状态。
     */
    async disconnect(): Promise<void> {
        if (this.state !== AdapterState.Connected) {
            return;
        }
        this.setAddress(null);
        this.setState(AdapterState.Disconnect);
        this.emit('disconnect');
    }

    /**
     * 交易签名（单签）。
     * @param transaction 待签名交易
     * @param privateKey 可选私钥（由钱包托管时可不传）
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
     * 交易多重签名（多签）。
     * @param transaction 待签名交易
     * @param privateKey 私钥或 false（由钱包控制）
     * @param permissionId 权限 ID（多签场景）
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
     * 消息签名（TronWeb V2）。
     * @param message 待签名的消息字符串
     * @param privateKey 可选私钥
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
     * 切换到目标链；若 TokenPocket 不支持将抛出 WalletSwitchChainError。
     * 具体支持的 chainId 需参考 TokenPocket 文档配置。
     * @param chainId 目标链 ID（如 Tron 主网/测试网对应的 EVM 风格链 ID）
     */
    async switchChain(chainId: string) {
        try {
            this.checkIfOpenApp();
            await this._checkWallet();
            if (this.readyState === WalletReadyState.NotFound) {
                if (this.config.openUrlWhenWalletNotFound !== false && isInBrowser()) {
                    window.open(this.url, '_blank');
                }
                throw new WalletNotFoundError();
            }
            if (!this._wallet) return;
            const wallet = this._wallet as TokenPocketWallet;
            try {
                await wallet.tron.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId }],
                });
            } catch (e: any) {
                throw new WalletSwitchChainError(e?.message || e, e instanceof Error ? e : new Error(e));
            }
        } catch (error: any) {
            this.emit('error', error);
            throw error;
        }
    }

    private onAccountsChanged: TronAccountsChangedCallback = (accounts) => {
        const preAddr = this.address || '';
        const curAddr = accounts?.[0] || '';
        if (!curAddr) {
            this.setAddress(null);
            this.setState(AdapterState.Disconnect);
        } else {
            const address = curAddr as string;
            this.setAddress(address);
            this.setState(AdapterState.Connected);
        }
        this.emit('accountsChanged', this.address || '', preAddr);
        if (!preAddr && this.address) {
            this.emit('connect', this.address);
        } else if (preAddr && !this.address) {
            this.emit('disconnect');
        }
    };
    /**
     * 监听 Tron 账户变更事件（桌面浏览器环境）。
     */
    private listenTronEvent() {
        if (isInMobileBrowser()) {
            return;
        }
        this.stopListenTronEvent();
        const wallet = this._wallet;
        if (!wallet || !wallet.tron) return;
        wallet.tron.on('accountsChanged', this.onAccountsChanged);
    }

    /**
     * 取消监听 Tron 账户变更事件。
     */
    private stopListenTronEvent() {
        if (isInMobileBrowser()) {
            return;
        }
        const wallet = this._wallet;
        if (!wallet || !wallet.tron) return;
        wallet.tron.removeListener('accountsChanged', this.onAccountsChanged);
    }

    /**
     * 校验并返回钱包对象（需已连接，否则抛出 WalletDisconnectedError）。
     */
    private async checkAndGetWallet() {
        this.checkIfOpenApp();
        await this._checkWallet();
        if (!this.connected) throw new WalletDisconnectedError();
        const wallet = this._wallet;
        if (!wallet || !wallet.tronWeb) throw new WalletDisconnectedError();
        return wallet as TokenPocketWallet;
    }

    /**
     * 根据配置在移动端尝试通过 DeepLink 唤起 TokenPocket。
     * 若已触发唤起流程，将抛出 WalletNotFoundError 中断当前逻辑。
     */
    private checkIfOpenApp() {
        if (this.config.openAppWithDeeplink === false) {
            return;
        }
        if (openTokenPocket()) {
            throw new WalletNotFoundError();
        }
    }

    private checkReadyInterval: ReturnType<typeof setInterval> | null = null;
    /**
     * 轮询检查钱包是否就绪（已暴露地址）。
     * 移动端检测 window.tronWeb.ready；桌面端检测 provider.tronWeb.defaultAddress.base58。
     */
    private checkForWalletReady() {
        if (this.checkReadyInterval) {
            return;
        }
        let times = 0;
        const maxTimes = Math.floor(this.config.checkTimeout / 200);
        const check = () => {
            if (isInMobileBrowser() && window.tronWeb?.ready) {
                if (this.checkReadyInterval) {
                    clearInterval(this.checkReadyInterval);
                }
                this.checkReadyInterval = null;
                this._updateWallet();
                this.emit('connect', this.address || '');
            } else if (this._wallet?.tronWeb?.defaultAddress?.base58) {
                if (this.checkReadyInterval) {
                    clearInterval(this.checkReadyInterval);
                }
                this.checkReadyInterval = null;
                this._wallet.ready = true;
                const address = this._wallet.tronWeb.defaultAddress.base58;
                const state = address ? AdapterState.Connected : AdapterState.Disconnect;
                this.setAddress(address);
                this.setState(state);
                this.emit('connect', this.address || '');
            } else if (times > maxTimes) {
                if (this.checkReadyInterval) {
                    clearInterval(this.checkReadyInterval);
                }
                this.checkReadyInterval = null;
            } else {
                times++;
            }
        };
        this.checkReadyInterval = setInterval(check, 200);
    }

    private _checkPromise: Promise<boolean> | null = null;
    /**
     * check if wallet exists by interval, the promise only resolve when wallet detected or timeout
     * @returns if wallet exists
     * 通过轮询检测钱包是否存在，仅在检测到或超时后 resolve。
     * 返回值表示是否检测到 TokenPocket。
     */
    private _checkWallet(): Promise<boolean> {
        if (this.readyState === WalletReadyState.Found) {
            return Promise.resolve(true);
        }
        if (this._checkPromise) {
            return this._checkPromise;
        }

        if (isInBrowser() && !isInMobileBrowser()) {
            this._checkPromise = new Promise((resolve) => {
                const timer = setTimeout(() => {
                    // eslint-disable-next-line @typescript-eslint/no-use-before-define
                    window.removeEventListener(TIP6963AnnounceProviderEventName, handler);
                    this._updateWallet();
                    if (supportTokenPocket()) {
                        this._readyState = WalletReadyState.Found;
                        resolve(true);
                    } else {
                        this._readyState = WalletReadyState.NotFound;
                        resolve(false);
                    }
                    this.emit('readyStateChanged', this._readyState);
                }, this.config.checkTimeout);
                const handler = (event: TIP6963AnnounceProviderEvent) => {
                    const { info, provider } = event.detail;
                    if (info.name === 'TokenPocket') {
                        this._wallet = {
                            ready: !!provider.tronWeb?.defaultAddress?.base58,
                            tron: provider as unknown as Tron,
                            tronWeb: provider.tronWeb,
                        };
                        this.listenTronEvent();
                        this._readyState = WalletReadyState.Found;
                        const address = this._wallet.tronWeb.defaultAddress?.base58 || null;
                        const state = address ? AdapterState.Connected : AdapterState.Disconnect;
                        this.setState(state);
                        this.setAddress(address);
                        this.emit('readyStateChanged', this.readyState);
                        window.removeEventListener(TIP6963AnnounceProviderEventName, handler);
                        clearTimeout(timer);
                        resolve(true);

                        if (!this.connected) {
                            this.checkForWalletReady();
                        }
                    }
                };
                window.addEventListener(TIP6963AnnounceProviderEventName, handler);
                window.dispatchEvent(new Event(TIP6963RequestProviderEventName));
            });
            return this._checkPromise;
        }
        // Support TIP-6963 with wallet extension

        const interval = 100;
        const maxTimes = Math.floor(this.config.checkTimeout / interval);
        let times = 0,
            timer: ReturnType<typeof setInterval>;
        this._checkPromise = new Promise((resolve) => {
            const check = () => {
                times++;
                const isSupport = supportTokenPocket();
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
     * 更新内部钱包引用与地址/状态。
     * 根据运行环境组装 TokenPocketWallet 对象；未检测到钱包时设置为 NotFound。
     */
    private _updateWallet = () => {
        let state = this.state;
        let address = this.address;
        if (supportTokenPocket()) {
            const tron = window.tokenpocket?.tron as Tron;
            this._wallet = isInMobileBrowser()
                ? ({
                      tron,
                      ready: window.tronWeb?.ready,
                      tronWeb: window.tokenpocket?.tronWeb,
                  } as TokenPocketWallet)
                : {
                      tron,
                      ready: !!(tron?.tronWeb as TronWeb).defaultAddress?.base58 || false,
                      tronWeb: tron?.tronWeb as TronWeb,
                  };
            address = this._wallet.tronWeb.defaultAddress?.base58 || null;
            state = address ? AdapterState.Connected : AdapterState.Disconnect;
            if (!address) {
                this.checkForWalletReady();
            }
        } else {
            this._wallet = null;
            address = null;
            state = AdapterState.NotFound;
        }
        this.setAddress(address);
        this.setState(state);
    };

    /**
     * 设置当前地址（内部状态）。
     */
    private setAddress(address: string | null) {
        this._address = address;
    }

    /**
     * 设置适配器状态，并触发状态变更事件。
     */
    private setState(state: AdapterState) {
        const preState = this.state;
        if (state !== preState) {
            this._state = state;
            this.emit('stateChanged', state);
        }
    }
}
/**
 * 从 TronWeb 实例获取网络信息。
 * TODO: 需根据 TronWeb 提供的 API 补充实现。
 */
function getNetworkInfoByTronWeb(_tronWeb: TronWeb): Network | PromiseLike<Network> {
    throw new Error('Function not implemented.');
}
