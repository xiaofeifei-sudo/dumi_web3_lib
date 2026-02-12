import type { SessionData } from '@metamask/multichain-api-client';
import {
    type CaipAccountId,
    type MultichainApiClient,
    type Transport,
    getDefaultTransport,
    getMultichainClient,
    isMetamaskInstalled,
} from '@metamask/multichain-api-client';
import type { TronAddress } from '@metamask/multichain-api-client/dist/types/scopes/tron.types.cjs';
import {
    Adapter,
    AdapterState,
    WalletConnectionError,
    WalletDisconnectedError,
    WalletReadyState,
    WalletSignMessageError,
    WalletSignTransactionError,
} from '@tronweb3/tronwallet-abstract-adapter';
import type { AdapterName, Network, SignedTransaction, Transaction } from '@tronweb3/tronwallet-abstract-adapter';
import { Scope } from './types';
import {
    chainIdToScope,
    getAddressFromCaipAccountId,
    isAccountChangedEvent,
    scopeToChainId,
    scopeToNetworkType,
    isSessionChangedEvent,
} from './utils';

export const MetaMaskAdapterName = 'MetaMask' as AdapterName<'MetaMask'>;

export class MetaMaskAdapter extends Adapter {
    name = MetaMaskAdapterName;
    // @prettier-ignore
    icon =
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjIzIiBoZWlnaHQ9IjIzIiB4PSIzLjUiIHk9IjMuNSIgdmlld0JveD0iMCAwIDE0MS41MSAxMzYuNDIiPjxwYXRoIGZpbGw9IiNGRjVDMTYiIGQ9Im0xMzIuMjQgMTMxLjc1LTMwLjQ4LTkuMDctMjIuOTkgMTMuNzQtMTYuMDMtLjAxLTIzLTEzLjc0LTMwLjQ3IDkuMDhMMCAxMDAuNDdsOS4yNy0zNC43M0wwIDM2LjQgOS4yNyAwbDQ3LjYgMjguNDRoMjcuNzZMMTMyLjI0IDBsOS4yNyAzNi4zOC05LjI3IDI5LjM2IDkuMjcgMzQuNzItOS4yNyAzMS4zWiIvPjxwYXRoIGZpbGw9IiNGRjVDMTYiIGQ9Im05LjI3IDAgNDcuNjEgMjguNDZMNTQuOTggNDggOS4yOSAwWm0zMC40NyAxMDAuNDggMjAuOTUgMTUuOTUtMjAuOTUgNi4yNHYtMjIuMlpNNTkuMDEgNzQuMSA1NSA0OCAyOS4yMiA2NS43NWgtLjAybC4wOCAxOC4yNyAxMC40NS05LjkyaDE5LjI5Wk0xMzIuMjUgMGwtNDcuNiAyOC40Nkw4Ni41MSA0OGw0NS43Mi00OFptLTMwLjQ3IDEwMC40OC0yMC45NCAxNS45NSAyMC45NCA2LjI0di0yMi4yWm0xMC41My0zNC43M0w4Ni41MyA0OCA4Mi41IDc0LjFoMTkuMjdsMTAuNDYgOS45LjA3LTE4LjI2WiIvPjxwYXRoIGZpbGw9IiNFMzQ4MDciIGQ9Im0zOS43MyAxMjIuNjctMzAuNDYgOS4wOEwwIDEwMC40OGgzOS43M3YyMi4yWk01OS4wMiA3NC4xbDUuODIgMzcuNzEtOC4wNy0yMC45Ny0yNy40OS02LjgyIDEwLjQ2LTkuOTJINTlabTQyLjc2IDQ4LjU5IDMwLjQ3IDkuMDcgOS4yNy0zMS4yN2gtMzkuNzR6TTgyLjUgNzQuMDlsLTUuODIgMzcuNzEgOC4wNi0yMC45NyAyNy41LTYuODItMTAuNDctOS45MnoiLz48cGF0aCBmaWxsPSIjRkY4RDVEIiBkPSJtMCAxMDAuNDcgOS4yNy0zNC43M0gyOS4ybC4wNyAxOC4yNyAyNy41IDYuODIgOC4wNiAyMC45Ny00LjE1IDQuNjItMjAuOTQtMTUuOTZIMFptMTQxLjUgMC05LjI2LTM0LjczaC0xOS45M2wtLjA3IDE4LjI3LTI3LjUgNi44Mi04LjA2IDIwLjk3IDQuMTUgNC42MiAyMC45NC0xNS45NmgzOS43NFpNODQuNjQgMjguNDRINTYuODhsLTEuODkgMTkuNTQgOS44NCA2My44aDExLjg1bDkuODUtNjMuOC0xLjktMTkuNTRaIi8+PHBhdGggZmlsbD0iIzY2MTgwMCIgZD0iTTkuMjcgMCAwIDM2LjM4bDkuMjcgMjkuMzZIMjkuMkw1NC45OCA0OHptNDMuOTggODEuNjdoLTkuMDNsLTQuOTIgNC44MSAxNy40NyA0LjMzLTMuNTItOS4xNVpNMTMyLjI0IDBsOS4yNyAzNi4zOC05LjI3IDI5LjM2aC0xOS45M0w4Ni41MyA0OHpNODguMjcgODEuNjdoOS4wNGw0LjkyIDQuODItMTcuNDkgNC4zNCAzLjUzLTkuMTdabS05LjUgNDIuMyAyLjA2LTcuNTQtNC4xNS00LjYySDY0LjgybC00LjE0IDQuNjIgMi4wNSA3LjU0Ii8+PHBhdGggZmlsbD0iI0MwQzRDRCIgZD0iTTc4Ljc3IDEyMy45N3YxMi40NUg2Mi43NHYtMTIuNDVoMTYuMDJaIi8+PHBhdGggZmlsbD0iI0U3RUJGNiIgZD0ibTM5Ljc0IDEyMi42NiAyMyAxMy43NnYtMTIuNDZsLTIuMDUtNy41NHptNjIuMDMgMC0yMyAxMy43NnYtMTIuNDZsMi4wNi03LjU0eiIvPjwvc3ZnPjwvc3ZnPg==';
    url = 'https://metamask.io';

    private _readyState: WalletReadyState = WalletReadyState.Loading;
    private _state: AdapterState = AdapterState.Disconnect;
    private _connecting = false;
    private _switchingChain = false;
    private _address: string | null = null;
    private _scope: Scope | undefined;
    private _selectedAddressOnPageLoadPromise: Promise<string | undefined> | undefined;
    private _checkWalletPromise: Promise<boolean> | undefined;
    private _removeAccountsChangedListener: (() => void) | undefined;
    private _transport: Transport;
    private _client: MultichainApiClient;

    /**
     * 创建 MetaMaskAdapter 实例。
     * @param config - 适配器的配置项。
     */
    constructor() {
        super();
        this._transport = getDefaultTransport();
        this._client = getMultichainClient({ transport: this._transport });
        this._checkWalletPromise = this.checkWallet();
        this._selectedAddressOnPageLoadPromise = this.getInitialSelectedAddress();
        // 页面刷新后自动恢复会话
        this._checkWalletPromise.then((walletReady) => {
            if (walletReady) {
                this.tryRestoringSession()
                    .then(() => {
                        if (this.address) {
                            this.startListeners();
                            this.setState(AdapterState.Connected);
                            this.emit('connect', this.address);
                        }
                    })
                    .catch((error) => {
                        console.warn('Failed to auto-restore session:', error);
                    });
            }
        });
    }

    /** 获取当前已连接的地址。 */
    get address() {
        return this._address;
    }

    /** 获取适配器当前状态。 */
    get state() {
        return this._state;
    }

    /** 获取钱包的就绪状态。 */
    get readyState() {
        return this._readyState;
    }

    /** 获取适配器当前是否处于连接中。 */
    get connecting() {
        return this._connecting;
    }

    /**
     * 连接 MetaMask 钱包。
     * @returns 连接成功时解析的 Promise。
     */
    async connect(): Promise<void> {
        try {
            if (this.connected || this.connecting) {
                return;
            }
            if (this._readyState !== WalletReadyState.Found) {
                throw new WalletConnectionError('Wallet not found or not ready');
            }
            const walletReady = await this._checkWalletPromise;
            if (!walletReady) {
                throw new WalletConnectionError('Wallet not found after initialization');
            }
            this._connecting = true;
            try {
                // 尝试恢复已有会话
                await this.tryRestoringSession();
                // 若无法恢复则默认在主网创建会话
                if (!this.address) {
                    await this.createSession(Scope.MAINNET);
                }
                // 若用户未选择任何 Tron 作用域/账户则直接返回
                if (!this.address) {
                    return;
                }
                this.startListeners();

                this.setState(AdapterState.Connected);
                this.emit('connect', this.address);
            } catch (error: any) {
                throw new WalletConnectionError(error?.message, error);
            }
        } catch (error: any) {
            this.emit('error', error);
            throw error;
        } finally {
            this._connecting = false;
        }
    }

    /**
     * 从 MetaMask 钱包断开连接。
     * @returns 断开成功时解析的 Promise。
     */
    async disconnect(): Promise<void> {
        if (this.state !== AdapterState.Connected) {
            return;
        }

        this.stopListeners();

        this.setAddress(null);
        this.setScope(undefined, false);
        this.setState(AdapterState.Disconnect);
        this.emit('disconnect');

        await this._client.revokeSession({ scopes: [Scope.MAINNET, Scope.NILE, Scope.SHASTA] });
    }

    /**
     * 使用 MetaMask 钱包对交易进行签名。
     * @param transaction - 需要签名的交易对象。
     * @param privateKey - 可选的私钥（不建议在生产环境使用）。
     * @returns 解析为已签名交易的 Promise。
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async signTransaction(transaction: Transaction, _?: string): Promise<SignedTransaction> {
        try {
            if (!this._scope) {
                throw new WalletDisconnectedError('Wallet not connected');
            }
            const contractType = transaction.raw_data.contract[0]?.type;
            if (!contractType) {
                throw new WalletSignTransactionError('Transaction contract type is required');
            }

            const result = await this._client.invokeMethod({
                scope: this._scope,
                request: {
                    method: 'signTransaction',
                    params: {
                        address: this._address as TronAddress,
                        transaction: {
                            rawDataHex: transaction.raw_data_hex,
                            type: contractType,
                        },
                    },
                },
            });

            return {
                ...transaction,
                signature: [result.signature],
            };
        } catch (error: any) {
            if (error instanceof Error || (typeof error === 'object' && error.message)) {
                throw new WalletSignTransactionError(error.message, error);
            }
            if (typeof error === 'string') {
                throw new WalletSignTransactionError(error, new Error(error));
            }
            throw new WalletSignTransactionError('Unknown error', error);
        }
    }

    /**
     * 使用 MetaMask 钱包对消息进行签名。
     * @param message - 需要签名的消息内容。
     * @param privateKey - 可选的私钥（不建议在生产环境使用）。
     * @returns 解析为签名字符串的 Promise。
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async signMessage(message: string, _?: string): Promise<string> {
        try {
            if (!this._scope) {
                throw new WalletDisconnectedError('Wallet not connected');
            }

            const base64Message = Buffer.from(message).toString('base64');
            const result = await this._client.invokeMethod({
                scope: this._scope,
                request: {
                    method: 'signMessage',
                    params: { message: base64Message, address: this._address as TronAddress },
                },
            });
            return result.signature;
        } catch (error: any) {
            if (error instanceof Error || (typeof error === 'object' && error.message)) {
                throw new WalletSignMessageError(error.message, error);
            }
            if (typeof error === 'string') {
                throw new WalletSignMessageError(error, new Error(error));
            }
            throw new WalletSignMessageError('Unknown error', error);
        }
    }

    /**
     * 切换 MetaMask 钱包所使用的链。
     * 在 TronWallet 的初始连接过程中，该方法可能会被并行调用多次；
     * 如果并行多次调用 createSession，会导致失败。
     * 因此我们加入了 _switchingChain 标志位以避免并发重复调用。
     * @param chainId - 目标链的 chainId。
     */
    async switchChain(chainId: string): Promise<void> {
        if (this._switchingChain) {
            return;
        }
        this._switchingChain = true;
        if (!this._scope) {
            this._switchingChain = false;
            throw new WalletDisconnectedError('Wallet not connected');
        }

        const newScope = chainIdToScope(chainId);
        if (newScope === this._scope) {
            // 仍然触发事件以协调 dapp 与适配器的状态差异
            this.emit('chainChanged', { chainId });
            this._switchingChain = false;
            return;
        }

        let session = await this._client.getSession();
        let isChainInSession = session?.sessionScopes[newScope]?.accounts?.includes(`${newScope}:${this._address}`);
        if (!isChainInSession) {
            // 为新的作用域创建会话
            await this.createSession(newScope, this.address ? [this.address] : undefined);
            session = await this._client.getSession();
            isChainInSession = session?.sessionScopes[newScope]?.accounts?.includes(`${newScope}:${this._address}`);
            if (!isChainInSession) {
                this._switchingChain = false;
                throw new WalletConnectionError('Failed to switch chain');
            }
        }

        this.setScope(newScope);
        this._switchingChain = false;
    }

    /**
     * 获取 MetaMask 使用的网络信息。
     * @returns {Network} 当前网络信息。
     */
    async network(): Promise<Network> {
        try {
            if (this.state !== AdapterState.Connected || !this._scope) {
                throw new WalletDisconnectedError('Wallet not connected');
            }

            const chainId = scopeToChainId(this._scope);
            const networkType = scopeToNetworkType(this._scope);

            return {
                networkType,
                chainId,
                fullNode: '',
                solidityNode: '',
                eventServer: '',
            };
        } catch (e: any) {
            this.emit('error', e);
            throw e;
        }
    }

    /**
     * 在页面加载时最多监听 2 秒的 accountsChanged 事件。
     * @returns 若存在则返回初始选择的地址，否则为 undefined。
     */
    protected getInitialSelectedAddress(): Promise<string | undefined> {
        return new Promise((resolve) => {
            const timeout = setTimeout(() => {
                resolve(undefined);
            }, 2000);
            const handleAccountChange = (data: any) => {
                if (isAccountChangedEvent(data)) {
                    const address = data?.params?.notification?.params?.[0];
                    if (address) {
                        clearTimeout(timeout);
                        // eslint-disable-next-line @typescript-eslint/no-use-before-define
                        removeNotification?.();
                        resolve(address);
                    }
                }
            };

            const removeNotification = this._client.onNotification(handleAccountChange);
        });
    }

    /**
     * 检查浏览器中是否可用 MetaMask 钱包。
     * 默认将 _readyState 设置为 Found，以避免页面刷新时的问题；
     * 如果钱包实际不可用，需要相应更新 _readyState。
     * 钱包可用的平均时间约为 50ms。
     * @returns 若找到钱包则返回 true 的 Promise。
     */
    private async checkWallet(): Promise<boolean> {
        const metamaskInstalled = await isMetamaskInstalled();
        if (metamaskInstalled) {
            this._readyState = WalletReadyState.Found;
            this.emit('readyStateChanged', this.readyState);
            return true;
        }
        this._readyState = WalletReadyState.NotFound;
        this.emit('readyStateChanged', this.readyState);
        return false;
    }

    /**
     * 尝试恢复已有会话。
     * @returns 会话恢复完成（或不可恢复）时解析的 Promise。
     */
    private async tryRestoringSession(): Promise<void> {
        try {
            const existingSession = await this._client.getSession();
            if (!existingSession) {
                return;
            }
            // 获取页面加载时触发的 accountChanged 事件中的地址（如有）
            const address = await this._selectedAddressOnPageLoadPromise;
            const scope = this.restoreScope();
            this.updateSession(existingSession, scope, address);
        } catch (error) {
            console.warn(`Error restoring session`, error);
        }
    }

    /**
     * 为指定作用域创建会话。
     * @param scope - 要创建会话的 Tron 作用域。
     * @param addresses - 可选的地址列表，加入到会话中。
     */
    private async createSession(scope: Scope, addresses?: string[]): Promise<void> {
        let resolvePromise: (value: string) => void;
        const waitForAccountChangedPromise = new Promise<string>((resolve) => {
            resolvePromise = resolve;
        });

        // 若存在多个账户，等待首个 accountChanged 事件以确定使用的地址
        const handleAccountChange = (data: any) => {
            if (!isAccountChangedEvent(data)) {
                return;
            }
            const selectedAddress = data?.params?.notification?.params?.[0];

            if (selectedAddress) {
                // eslint-disable-next-line @typescript-eslint/no-use-before-define
                removeNotification();
                resolvePromise(selectedAddress);
            }
        };

        const removeNotification = this._client.onNotification(handleAccountChange);

        const session = await this._client.createSession({
            optionalScopes: {
                [scope]: {
                    accounts: (addresses ? addresses.map((addr) => `${scope}:${addr}`) : []) as CaipAccountId[],
                    methods: [],
                    notifications: [],
                },
            },
            sessionProperties: {
                tron_accountChanged_notifications: true,
            },
        });

        // 等待 accountChanged 事件以确定要使用的地址，超时时间为 2000ms
        const selectedAddress = await Promise.race([
            waitForAccountChangedPromise,
            new Promise<undefined>((resolve) => setTimeout(() => resolve(undefined), 2000)),
        ]);

        this.updateSession(session, undefined, selectedAddress);
    }

    /**
     * 更新会话以及要连接的地址。
     * 该方法按如下优先级选择合适的 Tron 网络作用域和地址：
     * 1. 作用域优先级：已选择的作用域（若提供） > 主网 > Shasta > Nile
     * 2. 地址选择：
     *    - 首选 selectedAddress 参数（通常来源于 accountsChanged 事件）
     *    - 若当前作用域包含历史保存的地址，则回退使用历史地址
     *    - 否则默认使用该作用域中的第一个地址
     *
     * @param session - 包含可用作用域与账户的会话数据
     * @param selectedAddress - 用户选择的地址（如有）
     */
    private updateSession(session: SessionData, selectedScope?: Scope, selectedAddress?: string) {
        const currentScope = this._scope;

        const scope = this.selectScopeFromSessionWithPriority(session, selectedScope);

        // 若无可用作用域，不进行断连，以便后续创建/更新新会话
        if (!scope) {
            this.setAddress(null);
            return;
        }
        const scopeAccounts = session?.sessionScopes[scope]?.accounts;
        // 当 Tron 作用域可用但没有任何账户时：
        // 例如用户通过以太坊注入的 provider 或 SDK 已创建过会话；
        // 此时不进行断连，以便后续创建/更新新会话
        if (!scopeAccounts?.[0]) {
            this.setAddress(null);
            return;
        }
        let addressToConnect;
        // 优先使用 selectedAddress
        if (selectedAddress && scopeAccounts.includes(`${scope}:${selectedAddress}`)) {
            addressToConnect = selectedAddress;
        }
        // 否则尝试使用之前保存的地址 this._address
        else if (this._address && scopeAccounts.includes(`${scope}:${this._address}`)) {
            addressToConnect = this._address;
        }
        // 再否则选择作用域中的第一个地址
        else {
            addressToConnect = getAddressFromCaipAccountId(scopeAccounts[0]);
        }
        // 更新地址与作用域
        this.setAddress(addressToConnect);
        this.setScope(scope, currentScope !== scope);
    }

    /**
     * 开始监听 accountsChanged 事件。
     * @param handler 可选的自定义事件处理函数。
     */
    private startListeners(handler?: (data: any) => void) {
        this._removeAccountsChangedListener = this._client.onNotification(handler ?? this.handleEvents.bind(this));
    }

    /**
     * 停止监听 accountsChanged 事件。
     */
    private stopListeners() {
        this._removeAccountsChangedListener?.();
        this._removeAccountsChangedListener = undefined;
    }

    /**
     * 处理 accountsChanged 及 sessionChanged 事件。
     * @param data - 事件数据。
     */
    private async handleEvents(data: any) {
        if (isAccountChangedEvent(data)) {
            const newAddressSelected = data?.params?.notification?.params?.[0];
            if (!newAddressSelected) {
                // 未选择地址则断开连接
                await this.disconnect();
                return;
            }
            const session = await this._client.getSession();
            if (!session) {
                return;
            }
            this.updateSession(session, this._scope, newAddressSelected);
        } else if (isSessionChangedEvent(data)) {
            const session = data?.params;
            if (!session) {
                return;
            }
            const scope = this.selectScopeFromSessionWithPriority(session);

            if (!scope) {
                // 未选择作用域则断开连接
                await this.disconnect();
                return;
            }
            const isAccountsEmpty = !(session?.sessionScopes?.[scope]?.accounts?.length > 0);
            if (isAccountsEmpty) {
                // 未选择地址则断开连接
                await this.disconnect();
                return;
            }
            this.updateSession(session, scope);
        }
    }

    /**
     * 设置当前地址。
     * 若地址发生变更则触发 accountsChanged 事件。
     * @param address - 要设置的地址；断开连接时为 null。
     */
    private setAddress(address: string | null) {
        if (this._address === address) {
            return;
        }

        if (address) {
            this.emit('accountsChanged', address, this._address || '');
        }

        this._address = address;
    }

    /**
     * 设置适配器状态；必要时触发状态变更事件。
     * @param state - 新的适配器状态。
     */
    private setState(state: AdapterState) {
        const preState = this.state;
        if (state !== preState) {
            this._state = state;
            this.emit('stateChanged', state);
        }
    }

    /**
     * 设置当前作用域。
     * @param scope - 新的作用域。
     */
    private setScope(scope?: Scope, emitChainChanged = true) {
        if (this._scope === scope) {
            return;
        }
        localStorage.setItem('metamaskAdapterScope', scope ?? '');
        this._scope = scope;

        if (!this._scope) {
            return;
        }

        if (emitChainChanged) {
            const newChainId = scopeToChainId(this._scope);
            this.emit('chainChanged', { chainId: newChainId });
        }
    }

    /**
     * 从本地存储恢复作用域。
     * @returns 已恢复的作用域；若不存在则为 undefined。
     */
    private restoreScope(): Scope | undefined {
        const scope = localStorage.getItem('metamaskAdapterScope');
        return scope ? (scope as Scope) : undefined;
    }

    /**
     * 按优先级选择会话中的作用域：主网 > Shasta > Nile。
     * @param session - 包含可用作用域的会话数据。
     * @returns 选中的作用域；若无可用作用域则为 undefined。
     */
    private selectScopeFromSessionWithPriority(session: SessionData, selectedScope?: Scope): Scope | undefined {
        const sessionScopes = new Set(Object.keys(session?.sessionScopes ?? {}));
        const scopePriorityOrder = (selectedScope ? [selectedScope] : []).concat([
            Scope.MAINNET,
            Scope.SHASTA,
            Scope.NILE,
        ]);

        return scopePriorityOrder.find((scope) => sessionScopes.has(scope));
    }
}
