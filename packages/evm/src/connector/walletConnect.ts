import {
  ChainNotConfiguredError,
  type Connector,
  createConnector,
  extractRpcUrls,
  ProviderNotFoundError,
} from '@wagmi/core'
import type { Compute, ExactPartial, Omit } from '@wagmi/core/internal'
import type { EthereumProvider } from '@walletconnect/ethereum-provider'
import {
  type AddEthereumChainParameter,
  type Address,
  getAddress,
  numberToHex,
  type ProviderConnectInfo,
  type ProviderRpcError,
  type RpcError,
  SwitchChainError,
  UserRejectedRequestError,
} from 'viem'
import { walletConnect } from 'wagmi/connectors'

type WalletConnectConnector = Connector & {
  onDisplayUri: (uri: string) => void
  onSessionDelete: (data: { topic: string }) => void
}

type EthereumProviderOptions = Parameters<(typeof EthereumProvider)['init']>[0]

export type WalletConnectParameters = Compute<
  {
    /**
     * 当在已有的 `chains` 配置中新增链时，此标志位用于决定该链是否视为“过期（stale）”。
     * “过期链”指 WalletConnect 尚未与之建立关系（例如用户还未批准或拒绝该链）。
     *
     * 该标志主要影响钱包不支持 WalletConnect v2 动态链授权时的行为。
     *
     * 若为 `true`（默认值），新增链会被视为过期链。如果用户尚未在其 WalletConnect 会话中与该链
     * 建立关系（已批准/已拒绝），则在 dapp 自动连接时连接器会断开，用户需要重新连接 dapp（重新校验链）
     * 以批准新加入的链。此默认行为用于避免在切链时出现意料之外的错误与困惑的体验
     * （例如用户不知道需要重新连接，除非 dapp 主动处理相关错误）。
     *
     * 若为 `false`，新增链会被视为潜在有效链。这意味着若用户尚未在 WalletConnect 会话中与该链建立关系，
     * wagmi 仍会成功自动连接。其代价是：当尝试切换到未被批准的链且钱包不支持动态会话更新时，连接器会抛错。
     * 这在 dapp 频繁修改已配置链且不希望在自动连接时断开用户连接的场景下可能更合适。
     * 如果用户决定切换到未批准的链，dapp 需要妥善处理该错误并提示用户重新连接以批准该链。
     *
     * @default true
     */
    isNewChainsStale?: boolean
  } & Omit<
    EthereumProviderOptions,
    | 'chains'
    | 'events'
    | 'optionalChains'
    | 'optionalEvents'
    | 'optionalMethods'
    | 'methods'
    | 'rpcMap'
    | 'showQrModal'
  > &
    ExactPartial<Pick<EthereumProviderOptions, 'showQrModal'>>
>

walletConnect.type = 'walletConnect' as const
export function wcConnector(parameters: WalletConnectParameters) {
  const isNewChainsStale = parameters.isNewChainsStale ?? true

  type Provider = Awaited<ReturnType<(typeof EthereumProvider)['init']>>
  type Properties = {
    // TODO(v3)：将 `withCapabilities: true` 作为默认行为
    connect: <withCapabilities extends boolean = false>(parameters?: {
      chainId?: number | undefined
      isReconnecting?: boolean | undefined
      pairingTopic?: string | undefined
      withCapabilities?: withCapabilities | boolean | undefined
    }) => Promise<{
      accounts: withCapabilities extends true
        ? readonly { address: Address }[]
        : readonly Address[]
      chainId: number
    }>
    getNamespaceChainsIds: () => number[]
    getRequestedChainsIds: () => Promise<number[]>
    isChainsStale: () => Promise<boolean>
    onConnect: (connectInfo: ProviderConnectInfo) => void
    onDisplayUri: (uri: string) => void
    onSessionDelete: (data: { topic: string }) => void
    setRequestedChainsIds: (chains: number[]) => void
    requestedChainsStorageKey: `${string}.requestedChains`
  }
  type StorageItem = {
    [_ in Properties['requestedChainsStorageKey']]: number[]
  }

  let provider_: Provider | undefined
  let providerPromise: Promise<typeof provider_>
  const NAMESPACE = 'eip155'

  let accountsChanged: WalletConnectConnector['onAccountsChanged'] | undefined
  let chainChanged: WalletConnectConnector['onChainChanged'] | undefined
  let connect: WalletConnectConnector['onConnect'] | undefined
  let displayUri: WalletConnectConnector['onDisplayUri'] | undefined
  let sessionDelete: WalletConnectConnector['onSessionDelete'] | undefined
  let disconnect: WalletConnectConnector['onDisconnect'] | undefined

  return createConnector<Provider, Properties, StorageItem>((config) => ({
    id: 'walletConnect',
    name: 'WalletConnect',
    type: walletConnect.type,
    async setup() {
      const provider = await this.getProvider().catch(() => null)
      if (!provider) return
      console.debug('[WalletConnect] Provider 初始化完成，准备绑定事件监听')
      if (!connect) {
        connect = this.onConnect.bind(this)
        provider.on('connect', connect)
        console.debug('[WalletConnect] 已绑定 connect 事件监听')
      }
      if (!sessionDelete) {
        sessionDelete = this.onSessionDelete.bind(this)
        provider.on('session_delete', sessionDelete)
        console.debug('[WalletConnect] 已绑定 session_delete 事件监听')
      }
    },
    async connect({ chainId, withCapabilities, ...rest } = {}) {
      try {
        console.info('[WalletConnect] 开始连接', {
          targetChainId: chainId ?? 'auto',
        })
        const provider = await this.getProvider()
        if (!provider) throw new ProviderNotFoundError()
        if (!displayUri) {
          displayUri = this.onDisplayUri
          provider.on('display_uri', displayUri)
          console.debug('[WalletConnect] 已绑定 display_uri 事件监听（二维码）')
        }

        let targetChainId = chainId
        if (!targetChainId) {
          const state = (await config.storage?.getItem('state')) ?? {}
          const isChainSupported = config.chains.some(
            (x) => x.id === state.chainId,
          )
          if (isChainSupported) targetChainId = state.chainId
          else targetChainId = config.chains[0]?.id
        }
        if (!targetChainId) throw new Error('No chains found on connector.')
        console.debug('[WalletConnect] 目标链确定', { chainId: targetChainId })

        const isChainsStale = await this.isChainsStale()
        // If there is an active session with stale chains, disconnect current session.
        if (provider.session && isChainsStale) {
          console.warn('[WalletConnect] 检测到过期链，会话将断开以重新校验')
          await provider.disconnect()
        }

        // If there isn't an active session or chains are stale, connect.
        if (!provider.session || isChainsStale) {
          const optionalChains = config.chains
            .filter((chain) => chain.id !== targetChainId)
            .map((optionalChain) => optionalChain.id)
          console.debug('[WalletConnect] 正在建立会话', {
            requiredChainId: targetChainId,
            optionalChains,
          })
          await provider.connect({
            optionalChains: [targetChainId, ...optionalChains],
            ...('pairingTopic' in rest
              ? { pairingTopic: rest.pairingTopic }
              : {}),
          })

          this.setRequestedChainsIds(config.chains.map((x) => x.id))
          console.debug('[WalletConnect] 已记录请求的链 ID 列表')
        }

        // If session exists and chains are authorized, enable provider for required chain
        const accounts = (await provider.enable()).map((x) => getAddress(x))
        console.info('[WalletConnect] 账户授权成功', { count: accounts.length })

        // Switch to chain if provided
        let currentChainId = await this.getChainId()
        if (chainId && currentChainId !== chainId) {
          console.info('[WalletConnect] 尝试切换链', {
            from: currentChainId,
            to: chainId,
          })
          const chain = await this.switchChain!({ chainId }).catch(
            (error: RpcError) => {
              if (
                error.code === UserRejectedRequestError.code &&
                (error.cause as RpcError | undefined)?.message !==
                  'Missing or invalid. request() method: wallet_addEthereumChain'
              )
                throw error
              console.warn('[WalletConnect] 切链失败，保持当前链', {
                currentChainId,
              })
              return { id: currentChainId }
            },
          )
          currentChainId = chain?.id ?? currentChainId
          console.info('[WalletConnect] 当前链已确定', { chainId: currentChainId })
        }

        if (displayUri) {
          provider.removeListener('display_uri', displayUri)
          displayUri = undefined
          console.debug('[WalletConnect] 已移除 display_uri 事件监听')
        }
        if (connect) {
          provider.removeListener('connect', connect)
          connect = undefined
          console.debug('[WalletConnect] 已移除 connect 事件监听')
        }
        if (!accountsChanged) {
          accountsChanged = this.onAccountsChanged.bind(this)
          provider.on('accountsChanged', accountsChanged)
          console.debug('[WalletConnect] 已绑定 accountsChanged 事件监听')
        }
        if (!chainChanged) {
          chainChanged = this.onChainChanged.bind(this)
          provider.on('chainChanged', chainChanged)
          console.debug('[WalletConnect] 已绑定 chainChanged 事件监听')
        }
        if (!disconnect) {
          disconnect = this.onDisconnect.bind(this)
          provider.on('disconnect', disconnect)
          console.debug('[WalletConnect] 已绑定 disconnect 事件监听')
        }
        if (!sessionDelete) {
          sessionDelete = this.onSessionDelete.bind(this)
          provider.on('session_delete', sessionDelete)
          console.debug('[WalletConnect] 已绑定 session_delete 事件监听')
        }

        return {
          accounts: (withCapabilities
            ? accounts.map((address) => ({ address, capabilities: {} }))
            : accounts) as never,
          chainId: currentChainId,
        }
      } catch (error) {
        console.error('[WalletConnect] 连接失败', {
          message: (error as ProviderRpcError)?.message ?? String(error),
        })
        if (
          /(user rejected|connection request reset)/i.test(
            (error as ProviderRpcError)?.message,
          )
        ) {
          throw new UserRejectedRequestError(error as Error)
        }
        throw error
      }
    },
    async disconnect() {
      console.info('[WalletConnect] 开始断开连接')
      const provider = await this.getProvider()
      try {
        await provider?.disconnect()
        console.info('[WalletConnect] 断开连接成功')
      } catch (error) {
        console.warn('[WalletConnect] 断开连接出现非关键错误', {
          message: (error as Error).message,
        })
        if (!/No matching key/i.test((error as Error).message)) throw error
      } finally {
        if (chainChanged) {
          provider?.removeListener('chainChanged', chainChanged)
          chainChanged = undefined
          console.debug('[WalletConnect] 已移除 chainChanged 事件监听')
        }
        if (disconnect) {
          provider?.removeListener('disconnect', disconnect)
          disconnect = undefined
          console.debug('[WalletConnect] 已移除 disconnect 事件监听')
        }
        if (!connect) {
          connect = this.onConnect.bind(this)
          provider?.on('connect', connect)
          console.debug('[WalletConnect] 已重新绑定 connect 事件监听')
        }
        if (accountsChanged) {
          provider?.removeListener('accountsChanged', accountsChanged)
          accountsChanged = undefined
          console.debug('[WalletConnect] 已移除 accountsChanged 事件监听')
        }
        if (sessionDelete) {
          provider?.removeListener('session_delete', sessionDelete)
          sessionDelete = undefined
          console.debug('[WalletConnect] 已移除 session_delete 事件监听')
        }

        this.setRequestedChainsIds([])
        console.debug('[WalletConnect] 已清空请求的链 ID 列表')
      }
    },
    async getAccounts() {
      const provider = await this.getProvider()
      const list = provider.accounts.map((x) => getAddress(x))
      console.debug('[WalletConnect] 获取账户列表', { count: list.length })
      return list
    },
    async getProvider({ chainId } = {}) {
      async function initProvider() {
        const optionalChains = config.chains.map((x) => x.id) as [number]
        if (!optionalChains.length) return
        const { EthereumProvider } = await import(
          '@walletconnect/ethereum-provider'
        )
        console.debug('[WalletConnect] 初始化 WalletConnect Provider', {
          optionalChains,
        })
        return await EthereumProvider.init({
          ...parameters,
          disableProviderPing: true,
          optionalChains,
          projectId: parameters.projectId,
          rpcMap: Object.fromEntries(
            config.chains.map((chain) => {
              const [url] = extractRpcUrls({
                chain,
                transports: config.transports,
              })
              return [chain.id, url]
            }),
          ),
          showQrModal: parameters.showQrModal ?? true,
        })
      }

      if (!provider_) {
        if (!providerPromise) providerPromise = initProvider()
        provider_ = await providerPromise
        provider_?.events.setMaxListeners(Number.POSITIVE_INFINITY)
        console.debug('[WalletConnect] Provider 实例创建完成，事件监听已扩容')
      }
      if (chainId) {
        console.debug('[WalletConnect] 初始化后切换至指定链', { chainId })
        await this.switchChain?.({ chainId })
      }
      return provider_!
    },
    async getChainId() {
      const provider = await this.getProvider()
      const id = provider.chainId
      console.debug('[WalletConnect] 读取当前链 ID', { chainId: id })
      return id
    },
    async isAuthorized() {
      try {
        const [accounts, provider] = await Promise.all([
          this.getAccounts(),
          this.getProvider(),
        ])

        // If an account does not exist on the session, then the connector is unauthorized.
        if (!accounts.length) {
          console.debug('[WalletConnect] 授权检查：无账户，未授权')
          return false
        }

        // If the chains are stale on the session, then the connector is unauthorized.
        const isChainsStale = await this.isChainsStale()
        if (isChainsStale && provider.session) {
          await provider.disconnect().catch(() => {})
          console.debug('[WalletConnect] 授权检查：链过期，断开并标记未授权')
          return false
        }
        console.debug('[WalletConnect] 授权检查：通过')
        return true
      } catch {
        console.debug('[WalletConnect] 授权检查：异常，视为未授权')
        return false
      }
    },
    async switchChain({ addEthereumChainParameter, chainId }) {
      const provider = await this.getProvider()
      if (!provider) throw new ProviderNotFoundError()

      const chain = config.chains.find((x) => x.id === chainId)
      if (!chain) throw new SwitchChainError(new ChainNotConfiguredError())

      try {
        console.info('[WalletConnect] 开始切换链', { to: chainId })
        await Promise.all([
          new Promise<void>((resolve) => {
            const listener = ({
              chainId: currentChainId,
            }: {
              chainId?: number | undefined
            }) => {
              if (currentChainId === chainId) {
                config.emitter.off('change', listener)
                resolve()
              }
            }
            config.emitter.on('change', listener)
          }),
          provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: numberToHex(chainId) }],
          }),
        ])

        const requestedChains = await this.getRequestedChainsIds()
        this.setRequestedChainsIds([...requestedChains, chainId])

        console.info('[WalletConnect] 切换链成功', { chainId })
        return chain
      } catch (err) {
        const error = err as RpcError

        if (/(user rejected)/i.test(error.message))
          throw new UserRejectedRequestError(error)

        // Indicates chain is not added to provider
        try {
          console.warn('[WalletConnect] 钱包未添加目标链，尝试添加链到钱包', {
            chainId,
          })
          let blockExplorerUrls: string[] | undefined
          if (addEthereumChainParameter?.blockExplorerUrls)
            blockExplorerUrls = addEthereumChainParameter.blockExplorerUrls
          else
            blockExplorerUrls = chain.blockExplorers?.default.url
              ? [chain.blockExplorers?.default.url]
              : []

          let rpcUrls: readonly string[]
          if (addEthereumChainParameter?.rpcUrls?.length)
            rpcUrls = addEthereumChainParameter.rpcUrls
          else rpcUrls = [...chain.rpcUrls.default.http]

          const addEthereumChain = {
            blockExplorerUrls,
            chainId: numberToHex(chainId),
            chainName: addEthereumChainParameter?.chainName ?? chain.name,
            iconUrls: addEthereumChainParameter?.iconUrls,
            nativeCurrency:
              addEthereumChainParameter?.nativeCurrency ?? chain.nativeCurrency,
            rpcUrls,
          } satisfies AddEthereumChainParameter

          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [addEthereumChain],
          })

          const requestedChains = await this.getRequestedChainsIds()
          this.setRequestedChainsIds([...requestedChains, chainId])
          console.info('[WalletConnect] 已添加链并更新记录', { chainId })
          return chain
        } catch (addErr) {
          console.error('[WalletConnect] 添加链被拒绝或失败', {
            message: (addErr as Error).message,
          })
          throw new UserRejectedRequestError(addErr as Error)
        }
      }
    },
    onAccountsChanged(accounts) {
      if (accounts.length === 0) {
        console.info('[WalletConnect] 账户变更：无账户，触发断开')
        this.onDisconnect()
      } else {
        console.debug('[WalletConnect] 账户变更', { count: accounts.length })
        config.emitter.emit('change', {
          accounts: accounts.map((x) => getAddress(x)),
        })
      }
    },
    onChainChanged(chain) {
      const chainId = Number(chain)
      console.info('[WalletConnect] 链变更事件', { chainId })
      config.emitter.emit('change', { chainId })
    },
    async onConnect(connectInfo) {
      const chainId = Number(connectInfo.chainId)
      const accounts = await this.getAccounts()
      console.info('[WalletConnect] 连接事件', {
        chainId,
        accounts: accounts.length,
      })
      config.emitter.emit('connect', { accounts, chainId })
    },
    async onDisconnect(_error) {
      console.info('[WalletConnect] 断开事件触发')
      this.setRequestedChainsIds([])
      config.emitter.emit('disconnect')

      const provider = await this.getProvider()
      if (accountsChanged) {
        provider.removeListener('accountsChanged', accountsChanged)
        accountsChanged = undefined
        console.debug('[WalletConnect] 断开后移除 accountsChanged 监听')
      }
      if (chainChanged) {
        provider.removeListener('chainChanged', chainChanged)
        chainChanged = undefined
        console.debug('[WalletConnect] 断开后移除 chainChanged 监听')
      }
      if (disconnect) {
        provider.removeListener('disconnect', disconnect)
        disconnect = undefined
        console.debug('[WalletConnect] 断开后移除 disconnect 监听')
      }
      if (sessionDelete) {
        provider.removeListener('session_delete', sessionDelete)
        sessionDelete = undefined
        console.debug('[WalletConnect] 断开后移除 session_delete 监听')
      }
      if (!connect) {
        connect = this.onConnect.bind(this)
        provider.on('connect', connect)
        console.debug('[WalletConnect] 断开后重新绑定 connect 监听')
      }
    },
    onDisplayUri(uri) {
      console.info('[WalletConnect] 二维码链接已生成', uri)
      config.emitter.emit('message', { type: 'display_uri', data: uri })
    },
    onSessionDelete() {
      console.warn('[WalletConnect] 会话删除事件触发，执行断开')
      this.onDisconnect()
    },
    getNamespaceChainsIds() {
      if (!provider_) return []
      const chainIds = provider_.session?.namespaces[NAMESPACE]?.accounts?.map(
        (account) => Number.parseInt(account.split(':')[1] || '', 10),
      )
      console.debug('[WalletConnect] 命名空间链 ID 解析', {
        count: chainIds?.length ?? 0,
      })
      return chainIds ?? []
    },
    async getRequestedChainsIds() {
      const ids =
        (await config.storage?.getItem(this.requestedChainsStorageKey)) ?? []
      console.debug('[WalletConnect] 读取已请求链 ID 列表', { count: ids.length })
      return ids
    },
    /**
     * 检查目标链是否与 WalletConnect 会话中连接器最初请求的链一致。
     * 若存在不一致，则表明连接器上的链被视为“过期”，需要在之后（通过重新连接）重新校验。
     *
     * 也可能出现 dapp 后续向连接器新增链，但该链尚未被钱包批准或拒绝的情况。
     * 在这种情况下，该链被视为过期链。
     */
    async isChainsStale() {
      if (!isNewChainsStale) return false

      const connectorChains = config.chains.map((x) => x.id)
      const namespaceChains = this.getNamespaceChainsIds()
      if (
        namespaceChains.length &&
        !namespaceChains.some((id) => connectorChains.includes(id))
      )
        return false

      const requestedChains = await this.getRequestedChainsIds()
      return !connectorChains.every((id) => requestedChains.includes(id))
    },
    async setRequestedChainsIds(chains) {
      await config.storage?.setItem(this.requestedChainsStorageKey, chains)
      console.debug('[WalletConnect] 写入已请求链 ID 列表', { count: chains.length })
    },
    get requestedChainsStorageKey() {
      return `${this.id}.requestedChains` as Properties['requestedChainsStorageKey']
    },
  }))
}
