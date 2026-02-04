export interface LinkingRecord {
  redirect: string
  redirectUniversalLink?: string
  href: string
}



export type DeepLinkResult = {
  deepLink?: string          // scheme 深链，例如 rainbow://wc?uri=...
  universalLink?: string     // http/https UL，例如 https://rainbow.me/app/wc?uri=...
  hrefBase?: string          // 基础 appUrl，用来自行记录
}


export type InternalChainNamespace =
  | 'eip155'
  | 'solana'
  | 'polkadot'
  | 'bip122'
  | 'cosmos'
  | 'sui'
  | 'stacks'
  | 'ton' | string


  export type ChainId = string | number


  export type ChainNamespace<T extends string = InternalChainNamespace> = T | InternalChainNamespace


export type CaipNetworkId<N extends string = InternalChainNamespace> =
  `${ChainNamespace<N>}:${ChainId}`


export type BadgeType = 'none' | 'certified'


// -- ApiController Types -------------------------------------------------------
export interface WcWallet {
  id: string
  name: string
  badge_type?: BadgeType
  description?: string
  chains?: CaipNetworkId[]
  homepage?: string
  image_id?: string
  icon?: string | React.ReactNode
  rdns_web_wallet?: string | null
  order?: number
  link_mode?: string | null
  mobile_link?: string | null
  desktop_link?: string | null
  webapp_link?: string | null
  app_store?: string | null
  play_store?: string | null
  chrome_store?: string | null
  rdns?: string | null
  is_top_wallet?: boolean
  injected?:
    | {
        namespace?: string
        injected_id?: string
      }[]
    | null
    categories?: string[]
  display_index?: number
  supports_wc?: boolean
  supports_wcpay?: boolean
}