export interface LinkingRecord {
  redirect: string
  redirectUniversalLink?: string
  href: string
}


export type WalletForDeepLink = {
    id: string
  mobile_link?: string | null
  link_mode?: string | null
  name: string
}


export type DeepLinkResult = {
  deepLink?: string          // scheme 深链，例如 rainbow://wc?uri=...
  universalLink?: string     // http/https UL，例如 https://rainbow.me/app/wc?uri=...
  hrefBase?: string          // 基础 appUrl，用来自行记录
}