import type { Chain} from "../types";
import { ChainType } from "../types"

/// 自定义deeplink钱包
export const CUSTOM_DEEPLINK_WALLETS = {
  PHANTOM: {
    id: 'a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393',
    url: 'https://phantom.app'
  },
  SOLFLARE: {
    id: '1ca0bdd4747578705b1939af023d120677c64fe6ca76add81fda36e350605e79',
    url: 'https://solflare.com'
  },
  COINBASE: {
    id: 'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa',
    url: 'https://go.cb-w.com',
    evmDeeplink: 'cbwallet://miniapp'
  },
  BINANCE: {
    id: '2fafea35bb471d22889ccb49c08d99dd0a18a37982602c33f696a5723934ba25',
    appId: 'yFK5FCqYprrXDiVFbhyRx7',
    deeplink: 'bnc://app.binance.com/mp/app',
    url: 'https://app.binance.com/en/download'
  }
} as const


/// 判断自定义deeplink钱包是否支持指定链
export function isCustomDeeplinkWalletForChain(walletId: string, chain: Chain): boolean {
  const { PHANTOM, SOLFLARE, COINBASE, BINANCE } = CUSTOM_DEEPLINK_WALLETS;

  const isSolana = chain.type == ChainType.SVM;
  const isBitcoin = chain.type == ChainType.Bitcoin;
  const isEvm = chain.type == ChainType.EVM;

  if (walletId === PHANTOM.id) {
    return isSolana || isBitcoin || isEvm;
  }

  if (walletId === SOLFLARE.id) {
    return isSolana;
  }

  if (walletId === COINBASE.id) {
    return isSolana || isEvm;
  }
  if (walletId === BINANCE.id) {
    return isBitcoin;
  }

  return false
}


/// 构建自定义deeplink钱包的深链URL
export function buildCustomDeeplinkUrlForChain(
  walletId: string,
  chain: Chain,
  currentDappUrl: string
): string | undefined {
  const isSolana = chain.type == ChainType.SVM;
  const isBitcoin = chain.type == ChainType.Bitcoin;
  const isEvm = chain.type == ChainType.EVM;

  const { PHANTOM, SOLFLARE, COINBASE, BINANCE } = CUSTOM_DEEPLINK_WALLETS
  const href = currentDappUrl
  const encodedHref = encodeURIComponent(href)

  if (walletId === PHANTOM.id) {
    const protocol = href.startsWith('https') ? 'https' : 'http'
    const host = href.split('/')[2]
    const encodedRef = encodeURIComponent(`${protocol}://${host}`)

    return `${PHANTOM.url}/ul/browse/${encodedHref}?ref=${encodedRef}`
  }

  if (walletId === SOLFLARE.id && isSolana) {
    return `${SOLFLARE.url}/ul/v1/browse/${encodedHref}`
  }

  if (walletId === COINBASE.id) {
    if (isSolana) {
      return `${COINBASE.url}/dapp?cb_url=${encodedHref}`
    }
    if (isEvm) {
      return `${COINBASE.evmDeeplink}?url=${encodedHref}`
    }
  }
  if (walletId === BINANCE.id && isBitcoin) {
    const startPagePath = btoa('/pages/browser/index')
    const startPageQuery = btoa(`url=${encodedHref}`)
    const deeplink = new URL(BINANCE.deeplink)
    deeplink.searchParams.set('appId', BINANCE.appId)
    deeplink.searchParams.set('startPagePath', startPagePath)
    deeplink.searchParams.set('startPageQuery', startPageQuery)
    const universalLink = new URL(BINANCE.url)
    universalLink.searchParams.set('_dp', btoa(deeplink.toString()))
    return universalLink.toString()
  }
  return undefined
}