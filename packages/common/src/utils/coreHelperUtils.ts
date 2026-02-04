import type { Chain } from "../types"
import { buildCustomDeeplinkUrlForChain, isCustomDeeplinkWalletForChain } from "./mobileWallet"
import type { DeepLinkResult, LinkingRecord, WcWallet } from "./typeUtils"

export type OpenTarget = '_blank' | '_self' | 'popupWindow' | '_top'


export const CoreHelperUtil = {
    WALLETCONNECT_DEEPLINK_CHOICE: "WALLETCONNECT_DEEPLINK_CHOICE",
    WCM_VERSION: "WCM_VERSION",

    /// 获取浏览器窗口对象
    getWindow(): Window | undefined {
    if (typeof window === 'undefined') {
      return undefined
    }
    return window
  },

  
   isClient() {
    return typeof window !== 'undefined'
  },

  // 是否为移动设备
  isMobile() {
    if (this.isClient()) {
      return Boolean(
        (window?.matchMedia &&
          typeof window.matchMedia === 'function' &&
          window.matchMedia('(pointer:coarse)')?.matches) ||
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/u.test(navigator.userAgent)
      )
    }

    return false
  },


    /// 判断是否为 Iframe 环境
   isIframe() {
    try {
      return window?.self !== window?.top
    } catch (e) {
      return false
    }
  },


  /// 判断是否为安全的应用环境
  isSafeApp() {
    if (this.isClient() && window.self !== window.top) {
      try {
        const ancestor = window?.location?.ancestorOrigins?.[0]

        const safeAppUrl = 'https://app.safe.global'
        if (ancestor) {
          const ancestorUrl = new URL(ancestor)
          const safeUrl = new URL(safeAppUrl)

          return ancestorUrl.hostname === safeUrl.hostname
        }
      } catch {
        return false
      }
    }

    return false
  },


  // 判断是安卓环境
   isAndroid() {
    if (!this.isMobile()) {
      return false
    }

    const ua = window?.navigator.userAgent.toLowerCase()

    return CoreHelperUtil.isMobile() && ua.includes('android')
  },


  // 判断是Ios环境
  isIos() {
    if (!this.isMobile()) {
      return false
    }

    const ua = window?.navigator.userAgent.toLowerCase()

    return ua.includes('iphone') || ua.includes('ipad')
  },


  // 判断是否为 HTTP 或 HTTPS URL
  isHttpUrl(url: string) {
    return url.startsWith("http://") || url.startsWith("https://");
  },


  /// 判断是否为数组且非空
  isArray<T>(data?: T | T[]): data is T[] {
    return Array.isArray(data) && data.length > 0;
  },


  /// 判断是否为 Telegram 环境
  isTelegram() {
    return (
      typeof window !== "undefined" &&
      (Boolean((window as any).TelegramWebviewProxy) ||
        Boolean((window as any).Telegram) ||
        Boolean((window as any).TelegramWebviewProxyProto))
    );
  },


  /**
   * 控制地址连接到WalletConnect
   * @param appUrl
   * @param wcUri
   * @param name
   */
   formatNativeUrl(
    appUrl: string,
    wcUri: string,
    universalLink: string | null = null
  ): LinkingRecord {
    if (CoreHelperUtil.isHttpUrl(appUrl)) {
      return this.formatUniversalUrl(appUrl, wcUri)
    }
    let safeAppUrl = appUrl
    let safeUniversalLink = universalLink
    if (!safeAppUrl.includes('://')) {
      safeAppUrl = appUrl.replaceAll('/', '').replaceAll(':', '')
      safeAppUrl = `${safeAppUrl}://`
    }
    if (!safeAppUrl.endsWith('/')) {
      safeAppUrl = `${safeAppUrl}/`
    }
    if (safeUniversalLink && !safeUniversalLink?.endsWith('/')) {
      safeUniversalLink = `${safeUniversalLink}/`
    }

    
    // 在 Telegram 环境下，Android 的 deeplink 需要对 URI 进行两次编码
    if (this.isTelegram() && this.isAndroid()) {
      // eslint-disable-next-line no-param-reassign
      wcUri = encodeURIComponent(wcUri)
    }
    const encodedWcUrl = encodeURIComponent(wcUri)

    return {
      redirect: `${safeAppUrl}wc?uri=${encodedWcUrl}`,
      redirectUniversalLink: safeUniversalLink
        ? `${safeUniversalLink}wc?uri=${encodedWcUrl}`
        : undefined,
      href: safeAppUrl
    }
  },

  
    /// 格式化通用 URL
    formatUniversalUrl(appUrl: string, wcUri: string): LinkingRecord {
    if (!CoreHelperUtil.isHttpUrl(appUrl)) {
      return this.formatNativeUrl(appUrl, wcUri)
    }
    let safeAppUrl = appUrl
    if (!safeAppUrl.endsWith('/')) {
      safeAppUrl = `${safeAppUrl}/`
    }
    const encodedWcUrl = encodeURIComponent(wcUri)

    return {
      redirect: `${safeAppUrl}wc?uri=${encodedWcUrl}`,
      href: safeAppUrl
    }
  },


  /// 构建 WalletConnect 深链
 buildWalletConnectDeepLink(
  wallet: WcWallet,
  wcUri: string
): DeepLinkResult | undefined {
  if (!wallet.mobile_link || !wcUri) {
    return
  }

  const { redirect, redirectUniversalLink, href } = this.formatNativeUrl(
    wallet.mobile_link,
    wcUri,
    wallet.link_mode ?? null
  )

  return {
    deepLink: redirect,
    universalLink: redirectUniversalLink,
    hrefBase: href
  }
},

/// 打开钱包连接深链
openWalletWithDeepLink(
  wallet: WcWallet,
  chain: Chain,
  wcUri: string,
  { preferUniversalLinks = false }: { preferUniversalLinks?: boolean } = {}
): string | undefined {
  const currentUrl = window.location.href;
    const target = this.isIframe() ? '_top' : '_self'
   if (isCustomDeeplinkWalletForChain(wallet.id, chain)) {
    const customUrl = buildCustomDeeplinkUrlForChain(wallet.id, chain, currentUrl)
    if (customUrl) {
      this.openHref(customUrl, target);
      return
    }
  }
  const result = this.buildWalletConnectDeepLink(wallet, wcUri)
  if (!result) return
  const { deepLink, universalLink } = result
  const finalUrl =
    preferUniversalLinks && universalLink
      ? universalLink
      : deepLink ?? universalLink // 兜底用一个

  if (!finalUrl) return
  this.openHref(finalUrl, target);
  return finalUrl
},

   // 等待函数
  async wait(miliseconds: number) {
    return new Promise(resolve => {
      setTimeout(resolve, miliseconds);
    });
  },

  // 打开新页面
  openHref(href: string, target: OpenTarget) {
    const adjustedTarget = this.isTelegram() ? "_blank" : target;
    if (adjustedTarget === "_self") {
      window.location.href = href
      return
    }
    if (adjustedTarget === "_top") {
      try {
        window.top?.location?.assign(href)
      } catch {
        window.location.href = href
      }
      return
    }
    window.open(href, adjustedTarget, "noreferrer noopener");
  }
  
}
