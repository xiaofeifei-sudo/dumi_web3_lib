import { WalletNotSelectedError } from '@tronweb3/tronwallet-abstract-adapter';
import type {
    Adapter,
    WalletError,
    AdapterName,
    Transaction,
    WalletReadyState,
} from '@tronweb3/tronwallet-abstract-adapter';

import type { FC, ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Wallet } from './useWallet';
import { WalletContext } from './useWallet';
import { useLocalStorage } from './useLocalStorage';
import { TronLinkAdapter } from '../adapters/tronlink/index';

/**
 * 钱包 Provider 组件的属性
 * - children 需要被 Provider 包裹的子组件
 * - adapters 可选的适配器列表；默认提供 TronLink
 * - onError 发生错误时的回调
 * - onConnect 成功连接并获取地址时的回调
 * - onDisconnect 断开连接时的回调
 * - onAccountsChanged 钱包账户地址变更时的回调
 * - onReadyStateChanged 钱包就绪状态变更时的回调
 * - onChainChanged 链/网络变更时的回调
 * - onAdapterChanged 当前适配器变更时的回调
 * - localStorageKey 本地存储的适配器名称键名
 * - autoConnect 是否在条件允许时自动连接
 * - disableAutoConnectOnLoad 是否在初次加载时禁用自动连接
 */
export interface WalletProviderProps {
    children: ReactNode;
    adapters?: Adapter[];
    onError?: (error: WalletError) => void;
    onConnect?: (address: string) => unknown;
    onDisconnect?: () => unknown;
    onAccountsChanged?: (address: string, preAddr?: string) => unknown;
    onReadyStateChanged?: (state: WalletReadyState) => unknown;
    onChainChanged?: (chainData: unknown) => unknown;
    onAdapterChanged?: (adapter: Adapter | null) => unknown;
    localStorageKey?: string;
    reconnectOnMount?: boolean;
}

/**
 * Provider 内部初始状态
 * - wallet 当前选中的钱包（包含适配器与状态）
 * - address 当前账号地址
 * - connected 是否已连接
 * - adapter 当前选中的适配器
 */
const initialState: {
    wallet: Wallet | null;
    address: string | null;
    connected: boolean;
    adapter: Adapter | null;
} = {
    wallet: null,
    address: null,
    connected: false,
    adapter: null,
};

export const WalletProvider: FC<WalletProviderProps> = function ({
    children,
    adapters: adaptersPro = null,
    onError = (error) => console.error(error),
    onReadyStateChanged,
    onConnect,
    onDisconnect,
    onAccountsChanged,
    onChainChanged,
    onAdapterChanged,
    localStorageKey = 'tronAdapterName',
    reconnectOnMount = true,
}) {
    /**
     * 从 LocalStorage 持久化选中的适配器名称
     */
    const [name, setName] = useLocalStorage<AdapterName | null>(localStorageKey, null);
    const [manuallyDisconnected, setManuallyDisconnected] = useLocalStorage<boolean>(
        `${localStorageKey}:manualDisconnected`,
        false
    );
    const [{ wallet, connected, address, adapter }, setState] = useState(initialState);
    const [connecting, setConnecting] = useState(false);
    const [disconnecting, setDisconnecting] = useState(false);
    const isConnecting = useRef(false);
    const isDisconnecting = useRef(false);
    const hasManuallySetName = useRef(false);

    /**
     * 适配器列表
     * - 若未传入，则默认启用 TronLink 适配器
     */
    const adapters = useMemo(() => {
        if (adaptersPro === null) {
            return [new TronLinkAdapter()];
        }
        return adaptersPro;
    }, [adaptersPro]);
    /**
     * 根据适配器列表生成钱包数组
     * - 每个钱包包含适配器实例与当前状态
     */
    const [wallets, setWallets] = useState<Wallet[]>(() =>
        adapters.map((curAdapter) => ({
            adapter: curAdapter,
            state: curAdapter.state,
        }))
    );
    useEffect(
        function () {
            /**
             * 同步钱包数组中的状态与当前适配器状态
             */
            setWallets((prevWallets) =>
                adapters.map((curAdapter, index) => {
                    const walletItem = prevWallets[index];
                    if (walletItem && walletItem.adapter === curAdapter && walletItem.state === curAdapter.state) {
                        return walletItem;
                    }
                    return {
                        adapter: curAdapter,
                        state: curAdapter.state,
                    };
                })
            );

            function handleStateChange(this: Adapter) {
                /**
                 * 适配器状态变更时更新对应钱包项
                 */
                setWallets((prevWallets) => {
                    const index = prevWallets.findIndex((wItem) => wItem.adapter === this);
                    if (index === -1) {
                        return prevWallets;
                    }
                    return prevWallets.map((wItem, idx) => {
                        if (idx === index) {
                            return {
                                ...wItem,
                                state: wItem.adapter.state,
                            };
                        }
                        return wItem;
                    });
                });
            }
            /**
             * 监听各适配器的状态变更事件
             */
            adapters.forEach((curAdapter) => curAdapter.on('stateChanged', handleStateChange, curAdapter));
            return () => adapters.forEach((curAdapter) => curAdapter.off('stateChanged', handleStateChange, curAdapter));
        },
        [adapters]
    );

    /**
     * 当选中的钱包名称变化时，更新上下文中的当前钱包与适配器
     */
    useEffect(
        function () {
            const selectedWallet = name && wallets.find((item) => item.adapter.name === name);
            if (selectedWallet) {
                if (manuallyDisconnected) {
                    setState({
                        wallet: selectedWallet,
                        adapter: selectedWallet.adapter,
                        connected: false,
                        address: null,
                    });
                    selectedWallet.adapter.disconnect();
                } else {
                    const preventInitialConnect = !reconnectOnMount && !hasManuallySetName.current;
                    if (preventInitialConnect && !connected) {
                        setState({
                            wallet: selectedWallet,
                            adapter: selectedWallet.adapter,
                            connected: false,
                            address: null,
                        });
                        if (selectedWallet.adapter.connected) {
                            selectedWallet.adapter.disconnect();
                        }
                    } else {
                        setState({
                            wallet: selectedWallet,
                            adapter: selectedWallet.adapter,
                            connected: selectedWallet.adapter.connected,
                            address: selectedWallet.adapter.address,
                        });
                    }
                }
            } else {
                setState(initialState);
            }
        },
        [name, wallets, manuallyDisconnected, reconnectOnMount, connected]
    );

    const preAdapter = useRef<Adapter | null>(null);
    useEffect(
        function () {
            if (adapter !== preAdapter.current) {
                onAdapterChanged?.(adapter);
                preAdapter.current = adapter;
            }
        },
        [adapter, onAdapterChanged]
    );

    /**
     * 连接事件处理：同步连接状态与地址，并触发 onConnect
     */
    const handleConnect = useCallback(
        function (addr: string) {
            if (!adapter) {
                return setName(null);
            }
            setManuallyDisconnected(false);
            setState((state) => ({
                ...state,
                connected: adapter.connected,
                address: adapter.address,
            }));
            onConnect?.(addr);
        },
        [adapter, setName, onConnect, setManuallyDisconnected]
    );

    const handleError = useCallback(
        function (error: WalletError) {
            onError(error);
            return error;
        },
        [onError]
    );
    const handleAccountChange = useCallback(
        function (nextAddress: string, preAddr?: string) {
            setState((state) => ({ ...state, address: nextAddress }));
            onAccountsChanged?.(nextAddress, preAddr);
        },
        [onAccountsChanged, adapter]
    );
    const handleDisconnect = useCallback(
        function () {
            setName(null);
            setManuallyDisconnected(true);
            onDisconnect?.();
        },
        [onDisconnect, setName, setManuallyDisconnected]
    );
    const handleReadyStateChanged = useCallback(
        function (readyState: WalletReadyState) {
            onReadyStateChanged?.(readyState);
        },
        [onReadyStateChanged, adapter]
    );
    const handleChainChanged = useCallback(
        function (chainData: unknown) {
            onChainChanged?.(chainData);
        },
        [onChainChanged, adapter]
    );
    useEffect(
        function () {
            const allowListen = !!adapter && (reconnectOnMount || hasManuallySetName.current);
            if (allowListen) {
                // 监听当前适配器的生命周期与状态事件
                adapter.on('connect', handleConnect);
                adapter.on('error', handleError);
                adapter.on('accountsChanged', handleAccountChange);
                adapter.on('chainChanged', handleChainChanged);
                adapter.on('readyStateChanged', handleReadyStateChanged);
                adapter.on('disconnect', handleDisconnect);
                return () => {
                    // 在适配器变更或组件卸载时移除事件监听
                    adapter.off('connect', handleConnect);
                    adapter.off('error', handleError);
                    adapter.off('accountsChanged', handleAccountChange);
                    adapter.off('chainChanged', handleChainChanged);
                    adapter.off('readyStateChanged', handleReadyStateChanged);
                    adapter.off('disconnect', handleDisconnect);
                };
            }
            return undefined;
        },
        [
            adapter,
            reconnectOnMount,
            handleConnect,
            handleError,
            handleAccountChange,
            handleChainChanged,
            handleReadyStateChanged,
            handleDisconnect,
        ]
    );
    /**
     * 当适配器发生变更时，自动断开上一个适配器的连接
     */
    useEffect(() => {
        return () => {
            adapter?.disconnect();
        };
    }, [adapter]);

    useEffect(function () {}, []);
    /**
     * 选择适配器
     * - 记录用户已手动选择，用于后续自动连接的判断
     */
    const select = useCallback(
        (nextName: AdapterName) => {
            hasManuallySetName.current = true;
            setManuallyDisconnected(false);
            setName(nextName);
            try {
                if (typeof window !== 'undefined') {
                    window.localStorage.setItem(localStorageKey, JSON.stringify(nextName));
                }
            } catch {}
            const immediate = wallets.find((w) => w.adapter.name === nextName);
            if (immediate) {
                setState((state) => ({
                    ...state,
                    wallet: immediate,
                    adapter: immediate.adapter,
                    connected: immediate.adapter.connected,
                    address: immediate.adapter.address,
                }));
            } else {
                // no immediate adapter matched
            }
        },
        [setManuallyDisconnected, setName, wallets, localStorageKey]
    );

    /**
     * 连接当前选中的适配器
     * - 包含并发保护与错误清理逻辑
     */
    const connect = useCallback(
        async function () {
            if (isConnecting.current || isDisconnecting.current || connected) {
                return;
            }
            let actualName: AdapterName | null = name || null;
            if (!actualName && typeof window !== 'undefined') {
                const raw = window.localStorage.getItem(localStorageKey);
                if (raw) {
                    try {
                        actualName = JSON.parse(raw) as AdapterName | null;
                    } catch {
                        actualName = raw as unknown as AdapterName | null;
                    }
                }
            }
            const selectedWallet = actualName && wallets.find((item) => item.adapter.name === actualName);
            const targetAdapter =
                adapter ??
                selectedWallet?.adapter ??
                (actualName ? adapters.find((a) => a.name === actualName) ?? null : null);
            if (!targetAdapter) throw handleError(new WalletNotSelectedError());
            isConnecting.current = true;
            setConnecting(true);
            try {
                await targetAdapter.connect();
                setState((state) => ({
                    ...state,
                    wallet: targetAdapter
                        ? { adapter: targetAdapter, state: targetAdapter.state }
                        : state.wallet,
                    adapter: targetAdapter ?? state.adapter,
                    connected: targetAdapter.connected,
                    address: targetAdapter.address,
                }));
            } catch (error: unknown) {
                setName(null);
                throw error;
            } finally {
                setConnecting(false);
                isConnecting.current = false;
            }
        },
        [connected, name, wallets, adapter, adapters, handleError, localStorageKey, setName]
    );

    const disconnect = useCallback(
        async function () {
            if (isDisconnecting.current) return;
            if (!adapter) return setName(null);

            isDisconnecting.current = true;
            setDisconnecting(true);
            try {
                await adapter.disconnect();
                setName(null);
                setManuallyDisconnected(true);
            } catch (error: any) {
                setName(null);
                throw error;
            } finally {
                setDisconnecting(false);
                isDisconnecting.current = false;
            }
        },
        [adapter, isDisconnecting, setName, setManuallyDisconnected]
    );

    /**
     * 使用适配器签名交易
     * - 若未选择钱包则抛出 WalletNotSelectedError
     */
    const signTransaction = useCallback(
        async function (transaction: Transaction, privateKey?: string) {
            if (!adapter) throw handleError(new WalletNotSelectedError());
            return await adapter.signTransaction(transaction, privateKey);
        },
        [adapter, handleError]
    );

    /**
     * 使用适配器签名消息
     * - 若未选择钱包则抛出 WalletNotSelectedError
     */
    const signMessage = useCallback(
        async function (message: string, privateKey?: string) {
            if (!adapter) throw handleError(new WalletNotSelectedError());
            return await adapter.signMessage(message, privateKey);
        },
        [adapter, handleError]
    );

    /**
     * 提供钱包上下文
     */
    return (
        <WalletContext.Provider
            value={{
                reconnectOnMount,
                wallets,
                wallet,
                address,
                connecting,
                connected,
                disconnecting,

                select,
                connect,
                disconnect,
                signTransaction,
                signMessage,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
};
