export const CoreUtil = {
    WALLETCONNECT_DEEPLINK_CHOICE: "WALLETCONNECT_DEEPLINK_CHOICE",
    WCM_VERSION: "WCM_VERSION",

    // 推荐钱包数量
  RECOMMENDED_WALLET_AMOUNT: 9,

  // 是否为移动设备
  isMobile() {
    if (typeof window !== "undefined") {
      return Boolean(
        window.matchMedia("(pointer:coarse)").matches ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/u.test(navigator.userAgent)
      );
    }
    return false;
  },


  // 判断是安卓环境
  isAndroid() {
    return CoreUtil.isMobile() && navigator.userAgent.toLowerCase().includes("android");
  },


  // 判断是Ios环境
  isIos() {
    const ua = navigator.userAgent.toLowerCase();

    return CoreUtil.isMobile() && (ua.includes("iphone") || ua.includes("ipad"));
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
  formatNativeUrl(appUrl: string, wcUri: string, name: string): string {
    if (CoreUtil.isHttpUrl(appUrl)) {
      return this.formatUniversalUrl(appUrl, wcUri, name);
    }
    let safeAppUrl = appUrl;
    if (!safeAppUrl.includes("://")) {
      safeAppUrl = appUrl.replaceAll("/", "").replaceAll(":", "");
      safeAppUrl = `${safeAppUrl}://`;
    }
    if (!safeAppUrl.endsWith("/")) {
      safeAppUrl = `${safeAppUrl}/`;
    }
    // this.setWalletConnectDeepLink(safeAppUrl, name);
    const encodedWcUrl = encodeURIComponent(wcUri);
    return `${safeAppUrl}wc?uri=${encodedWcUrl}`;
  },


  /**
   * 控制地址连接到WalletConnect（Telegram 环境）
   * @param appUrl
   * @param wcUri
   * @param name
   */
   formatUniversalUrl(appUrl: string, wcUri: string, name: string): string {
    if (!CoreUtil.isHttpUrl(appUrl)) {
      return this.formatNativeUrl(appUrl, wcUri, name);
    }
    let safeAppUrl = appUrl;
    // 在 Telegram 环境中需要使用通用链接（Universal Link）
    if (safeAppUrl.startsWith("https://t.me")) {
      // eslint-disable-next-line require-unicode-regexp
      const formattedUri = Buffer.from(wcUri).toString("base64").replace(/[=]/g, "");
      if (safeAppUrl.endsWith("/")) {
        safeAppUrl = safeAppUrl.slice(0, -1);
      }

      // this.setWalletConnectDeepLink(safeAppUrl, name);

      const url = new URL(safeAppUrl);
      url.searchParams.set("startapp", formattedUri);
      return url.toString();
    }

    if (!safeAppUrl.endsWith("/")) {
      safeAppUrl = `${safeAppUrl}/`;
    }
    // this.setWalletConnectDeepLink(safeAppUrl, name);
    const encodedWcUrl = encodeURIComponent(wcUri);

    return `${safeAppUrl}wc?uri=${encodedWcUrl}`;
  },

   // 等待函数
  async wait(miliseconds: number) {
    return new Promise(resolve => {
      setTimeout(resolve, miliseconds);
    });
  },

  // 打开新页面
  openHref(href: string, target: "_blank" | "_self") {
    const adjustedTarget = this.isTelegram() ? "_blank" : target;
    window.open(href, adjustedTarget, "noreferrer noopener");
  }
  
}
