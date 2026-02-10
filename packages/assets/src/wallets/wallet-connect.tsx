// 说明：WalletConnect 通用协议的元数据展示（支持移动端扫码连接）
import type { WalletMetadata, WcWallet } from 'pelican-web3-lib-common';
import { getWalletImageUrl } from 'pelican-web3-lib-common';
import {
  BnbCircleColorful,
  BitgetWalletColorful,
  GeminiColorful,
  OkxWalletColorful,
  TokenPocketColorful,
  TrustWalletColorful,
  UniswapColorful,
  WalletConnectArk,
  MetaMaskArk,
} from 'pelican-web3-lib-icons';

export const metadata_WalletConnect: WalletMetadata = {
  icon: <WalletConnectArk />,
  name: 'WalletConnect',
  remark: 'Connect with mobile APP',
  universalProtocol: {
    link: 'https://walletconnect.com/',
  },
};

const WALLET_CONNECT_PROJECT_ID = '516c0404ce78defabd49030fb0c95b22';


/// WalletConnect 钱包列表
export const WalletConnectWallets: WcWallet[] = [
    {
            "id": "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96",
            "name": "MetaMask",
            "homepage": "https://metamask.io/",
            "image_id": "eebe4a7f-7166-402f-92e0-1f64ca2aa800",
            "order": 20,
            "mobile_link": "metamask://",
            "desktop_link": null,
            "link_mode": null,
            "webapp_link": null,
            "rdns_web_wallet": null,
            "app_store": "https://apps.apple.com/us/app/metamask/id1438144202",
            "play_store": "https://play.google.com/store/apps/details?id=io.metamask",
            "rdns": "io.metamask",
            "chrome_store": "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn",
            "injected": [
                {
                    "namespace": "eip155",
                    "injected_id": "isMetaMask"
                }
            ],
            "categories": [
                "b7c081de-c6d6-447e-ada6-a6f8e6e1480a",
                "e127a2ef-09e5-417b-9304-3e2e567a0f87"
            ],
            "description": "Whether you are an experienced user or brand new to blockchain, MetaMask helps you connect to the decentralized web: a new internet.",
            "badge_type": "certified",
            "supports_wc": true,
            "is_top_wallet": false,
            "supports_wcpay": false,
            "icon": <MetaMaskArk />,
        },
        {
            "id": "8a0ee50d1f22f6651afcae7eb4253e52a3310b90af5daef78a8c4929a9bb99d4",
            "name": "Binance Wallet",
            "homepage": "https://www.binance.com/en/web3wallet",
            "image_id": "ebac7b39-688c-41e3-7912-a4fefba74600",
            "order": 10,
            "mobile_link": "bnc://app.binance.com/cedefi/",
            "desktop_link": null,
            "link_mode": "https://app.binance.com/cedefi",
            "webapp_link": "https://www.binance.com/en/web3wallet",
            "rdns_web_wallet": null,
            "app_store": "https://www.binance.com/en/download",
            "play_store": "https://www.binance.com/en/download",
            "rdns": "com.binance.wallet",
            "chrome_store": "https://chromewebstore.google.com/detail/binance-wallet/cadiboklkpojfamcoggejbbdjcoiljjk?utm_source=walletconnect",
            "injected": [
                {
                    "namespace": "eip155",
                    "injected_id": "isBinance"
                }
            ],
            "categories": [
                "1778cd7f-a539-49fd-9de1-52d9c2101921",
                "b7c081de-c6d6-447e-ada6-a6f8e6e1480a",
                "e127a2ef-09e5-417b-9304-3e2e567a0f87"
            ],
            "description": "Binance Wallet is a keyless, multi-chain and self-custody wallet.",
            "badge_type": "certified",
            "supports_wc": true,
            "is_top_wallet": false,
            "supports_wcpay": false,
            "icon": <BnbCircleColorful />,
        },
        {
            "id": "1aedbcfc1f31aade56ca34c38b0a1607b41cccfa3de93c946ef3b4ba2dfab11c",
            "name": "OneKey",
            "homepage": "https://onekey.so",
            "image_id": "2067c771-93e8-4b32-b388-b2a0e1d4dc00",
            "order": 350,
            "mobile_link": "onekey-wallet://",
            "desktop_link": "onekey-wallet://",
            "link_mode": null,
            "webapp_link": "https://app.onekey.so/wc/connect",
            "rdns_web_wallet": null,
            "app_store": "https://apps.apple.com/us/app/onekey-open-source-wallet/id1609559473",
            "play_store": "https://play.google.com/store/apps/details?id=so.onekey.app.wallet&hl=en_US&gl=US",
            "rdns": "so.onekey.app.wallet",
            "chrome_store": "https://chrome.google.com/webstore/detail/onekey/jnmbobjmhlngoefaiojfljckilhhlhcj",
            "injected": [
                {
                    "namespace": "eip155",
                    "injected_id": "isOneKey"
                },
                {
                    "namespace": "solana",
                    "injected_id": "isOneKey"
                }
            ],
            "categories": [
                "1778cd7f-a539-49fd-9de1-52d9c2101921",
                "1e6917ca-16b1-4e03-aaf2-7b9a1229cd0d",
                "b7c081de-c6d6-447e-ada6-a6f8e6e1480a",
                "e127a2ef-09e5-417b-9304-3e2e567a0f87"
            ],
            "description": "Open source multi-chain crypto wallet runs on all platforms: iOS, Android, Windows, macOS, Linux, Chrome, Firefox... and more.",
            "badge_type": "none",
            "supports_wc": true,
            "is_top_wallet": false,
            "supports_wcpay": false
        },
        
        {
            "id": "0b415a746fb9ee99cce155c2ceca0c6f6061b1dbca2d722b3ba16381d0562150",
            "name": "SafePal",
            "homepage": "https://safepal.com/",
            "image_id": "252753e7-b783-4e03-7f77-d39864530900",
            "order": 30,
            "mobile_link": "safepalwallet://",
            "desktop_link": null,
            "link_mode": null,
            "webapp_link": "https://chrome.google.com/webstore/detail/safepal-extension-wallet/lgmpcpglpngdoalbgeoldeajfclnhafa",
            "rdns_web_wallet": null,
            "app_store": "https://apps.apple.com/app/safepal-wallet/id1548297139",
            "play_store": "https://play.google.com/store/apps/details?id=io.safepal.wallet",
            "rdns": null,
            "chrome_store": "https://chrome.google.com/webstore/detail/safepal-extension-wallet/lgmpcpglpngdoalbgeoldeajfclnhafa",
            "injected": [
                {
                    "namespace": "eip155",
                    "injected_id": "isSafePal"
                }
            ],
            "categories": [
                "1778cd7f-a539-49fd-9de1-52d9c2101921",
                "b7c081de-c6d6-447e-ada6-a6f8e6e1480a",
                "e127a2ef-09e5-417b-9304-3e2e567a0f87"
            ],
            "description": "SafePal is a cryptocurrency wallet that aims to provide a secure and user-friendly crypto management platform for the masses. ",
            "badge_type": "certified",
            "supports_wc": true,
            "is_top_wallet": false,
            "supports_wcpay": false
        },
        {
            "id": "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0",
            "name": "Trust Wallet",
            "homepage": "https://trustwallet.com/",
            "image_id": "7677b54f-3486-46e2-4e37-bf8747814f00",
            "order": 40,
            "mobile_link": "trust://",
            "desktop_link": null,
            "link_mode": null,
            "webapp_link": null,
            "rdns_web_wallet": null,
            "app_store": "https://apps.apple.com/app/apple-store/id1288339409",
            "play_store": "https://play.google.com/store/apps/details?id=com.wallet.crypto.trustapp",
            "rdns": "com.trustwallet.app",
            "chrome_store": "https://chrome.google.com/webstore/detail/trust-wallet/egjidjbpglichdcondbcbdnbeeppgdph",
            "injected": [
                {
                    "namespace": "eip155",
                    "injected_id": "isTrust"
                },
                {
                    "namespace": "eip155",
                    "injected_id": "isTrustWallet"
                }
            ],
        
            "categories": [
                "b7c081de-c6d6-447e-ada6-a6f8e6e1480a",
                "e127a2ef-09e5-417b-9304-3e2e567a0f87"
            ],
            "description": "Trust Wallet supports over 10 Million tokens including Ethereum, Solana, Polygon Matic, BNB, and Avalanche.",
            "badge_type": "certified",
            "supports_wc": true,
            "is_top_wallet": false,
            "supports_wcpay": false,
            "icon": <TrustWalletColorful />,
        },
        {
            "id": "5864e2ced7c293ed18ac35e0db085c09ed567d67346ccb6f58a0327a75137489",
            "name": "Fireblocks",
            "homepage": "https://www.fireblocks.com/",
            "image_id": "7e1514ba-932d-415d-1bdb-bccb6c2cbc00",
            "order": 50,
            "mobile_link": "fireblocks-wc://",
            "desktop_link": null,
            "link_mode": null,
            "webapp_link": "https://console.fireblocks.io/v2/",
            "rdns_web_wallet": null,
            "app_store": "https://apps.apple.com/us/app/fireblocks/id1439296596",
            "play_store": "https://play.google.com/store/apps/details?id=com.fireblocks.client&gl=IL",
            "rdns": null,
            "chrome_store": null,
            "injected": null,
        
            "categories": [
                "1778cd7f-a539-49fd-9de1-52d9c2101921",
                "e127a2ef-09e5-417b-9304-3e2e567a0f87"
            ],
            "description": "#1 Crypto and Digital Asset Platform for Institutions",
            "badge_type": "certified",
            "supports_wc": true,
            "is_top_wallet": false,
            "supports_wcpay": false
        },
        {
            "id": "971e689d0a5be527bac79629b4ee9b925e82208e5168b733496a09c0faed0709",
            "name": "OKX Wallet",
            "homepage": "https://www.okx.com/web3",
            "image_id": "45f2f08e-fc0c-4d62-3e63-404e72170500",
            "order": 60,
            "mobile_link": "okex://main",
            "desktop_link": null,
            "link_mode": "https://www.okx.com/download?appendQuery=true&deeplink=okx://web3/wallet/walletConnect",
            "webapp_link": null,
            "rdns_web_wallet": null,
            "app_store": "https://apps.apple.com/us/app/okx-buy-bitcoin-eth-crypto/id1327268470",
            "play_store": "https://play.google.com/store/apps/details?id=com.okinc.okex.gp",
            "rdns": "com.okex.wallet",
            "chrome_store": "https://chrome.google.com/webstore/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge",
            "injected": [
                {
                    "namespace": "eip155",
                    "injected_id": "isPLC"
                },
                {
                    "namespace": "solana",
                    "injected_id": "isPLC"
                }
            ],
           
            "categories": [
                "b7c081de-c6d6-447e-ada6-a6f8e6e1480a",
                "e127a2ef-09e5-417b-9304-3e2e567a0f87"
            ],
            "description": "One Web3 portal to rule them all",
            "badge_type": "certified",
            "supports_wc": true,
            "is_top_wallet": false,
            "supports_wcpay": false,
            "icon": <OkxWalletColorful />,
        },
        {
            "id": "20459438007b75f4f4acb98bf29aa3b800550309646d375da5fd4aac6c2a2c66",
            "name": "TokenPocket",
            "homepage": "https://tokenpocket.pro/",
            "image_id": "cfe00608-cb9e-45e3-0d08-5ffc7f5ad200",
            "order": 70,
            "mobile_link": "tpoutside://",
            "desktop_link": null,
            "link_mode": null,
            "webapp_link": "https://chrome.google.com/webstore/detail/tokenpocket/mfgccjchihfkkindfppnaooecgfneiii",
            "rdns_web_wallet": null,
            "app_store": "https://apps.apple.com/us/app/tp-wallet/id6444625622?l=en",
            "play_store": "https://play.google.com/store/apps/details?id=vip.mytokenpocket",
            "rdns": "pro.tokenpocket",
            "chrome_store": "https://chrome.google.com/webstore/detail/tokenpocket/mfgccjchihfkkindfppnaooecgfneiii",
            "injected": [
                {
                    "namespace": "eip155",
                    "injected_id": "isTokenPocket"
                }
            ],
            "categories": [
                "1778cd7f-a539-49fd-9de1-52d9c2101921",
                "b7c081de-c6d6-447e-ada6-a6f8e6e1480a",
                "e127a2ef-09e5-417b-9304-3e2e567a0f87"
            ],
            "description": "The leading multi-chain self-custodial wallet, which supports mainstream networks including BTC, ETH, BSC, TRON, zkSync Era∎, etc.",
            "badge_type": "certified",
            "supports_wc": true,
            "is_top_wallet": false,
            "supports_wcpay": false,
            "icon": <TokenPocketColorful />,
        },
        {
            "id": "38f5d18bd8522c244bdd70cb4a68e0e718865155811c043f052fb9f1c51de662",
            "name": "Bitget Wallet",
            "homepage": "https://web3.bitget.com",
            "image_id": "2b569b7f-e6c6-4faa-8e5a-ecd4dec8cf00",
            "order": 80,
            "mobile_link": "bitkeep://",
            "desktop_link": null,
            "link_mode": null,
            "webapp_link": "https://bitkeep.com",
            "rdns_web_wallet": null,
            "app_store": "https://web3.bitget.com/en/wallet-download?type=0",
            "play_store": "https://web3.bitget.com/en/wallet-download?type=0",
            "rdns": "com.bitget.web3",
            "chrome_store": "https://chrome.google.com/webstore/detail/bitkeep-crypto-nft-wallet/jiidiaalihmmhddjgbnbgdfflelocpak",
            "injected": [
                {
                    "namespace": "eip155",
                    "injected_id": "isBitKeep"
                }
            ],
            "categories": [
                "b7c081de-c6d6-447e-ada6-a6f8e6e1480a",
                "e127a2ef-09e5-417b-9304-3e2e567a0f87"
            ],
            "description": "Bitget Wallet",
            "badge_type": "certified",
            "supports_wc": true,
            "is_top_wallet": false,
            "supports_wcpay": false,
            "icon": <BitgetWalletColorful />,
        },
        {
            "id": "c03dfee351b6fcc421b4494ea33b9d4b92a984f87aa76d1663bb28705e95034a",
            "name": "Uniswap Wallet",
            "homepage": "https://uniswap.org",
            "image_id": "bff9cf1f-df19-42ce-f62a-87f04df13c00",
            "order": 90,
            "mobile_link": "uniswap://",
            "desktop_link": null,
            "link_mode": "https://uniswap.org/app",
            "webapp_link": null,
            "rdns_web_wallet": null,
            "app_store": "https://apps.apple.com/us/app/uniswap-wallet/id6443944476",
            "play_store": "https://play.google.com/store/apps/details?id=com.uniswap.mobile",
            "rdns": null,
            "chrome_store": "https://chromewebstore.google.com/detail/uniswap-extension/nnpmfplkfogfpmcngplhnbdnnilmcdcg",
            "injected": [
                {
                    "namespace": "eip155",
                    "injected_id": "isUniswapWallet"
                }
            ],
            "categories": [
                "b7c081de-c6d6-447e-ada6-a6f8e6e1480a",
                "e127a2ef-09e5-417b-9304-3e2e567a0f87"
            ],
            "description": "Built by the most trusted team in DeFi, Uniswap Wallet allows you to maintain full custody and control of your assets. ",
            "badge_type": "certified",
            "supports_wc": true,
            "is_top_wallet": false,
            "supports_wcpay": false,
            "icon": <UniswapColorful />,
        },
        {
            "id": "19177a98252e07ddfc9af2083ba8e07ef627cb6103467ffebb3f8f4205fd7927",
            "name": "Ledger Live",
            "homepage": "https://www.ledger.com/ledger-live",
            "image_id": "a7f416de-aa03-4c5e-3280-ab49269aef00",
            "order": 100,
            "mobile_link": "ledgerlive://",
            "desktop_link": "ledgerlive://",
            "link_mode": null,
            "webapp_link": null,
            "rdns_web_wallet": null,
            "app_store": "https://itunes.apple.com/app/id1361671700",
            "play_store": "https://play.google.com/store/apps/details?id=com.ledger.live",
            "rdns": null,
            "chrome_store": null,
            "injected": null,
            "categories": [
                "1e6917ca-16b1-4e03-aaf2-7b9a1229cd0d",
                "e127a2ef-09e5-417b-9304-3e2e567a0f87"
            ],
            "description": "Web3 Wallet from the company that produced the world's most secure crypto hardware device.",
            "badge_type": "certified",
            "supports_wc": true,
            "is_top_wallet": false,
            "supports_wcpay": false
        },
        {
            "id": "ecc4036f814562b41a5268adc86270fba1365471402006302e70169465b7ac18",
            "name": "Zerion",
            "homepage": "https://zerion.io/",
            "image_id": "73f6f52f-7862-49e7-bb85-ba93ab72cc00",
            "order": 110,
            "mobile_link": "zerion://",
            "desktop_link": "zerion://",
            "link_mode": "https://wallet.zerion.io/wc",
            "webapp_link": "https://wallet.zerion.io",
            "rdns_web_wallet": null,
            "app_store": "https://apps.apple.com/app/id1456732565",
            "play_store": "https://play.google.com/store/apps/details?id=io.zerion.android&hl=en&gl=US",
            "rdns": "io.zerion.wallet",
            "chrome_store": "https://chrome.google.com/webstore/detail/zerion-wallet-for-web3-nf/klghhnkeealcohjjanjjdaeeggmfmlpl",
            "injected": [
                {
                    "namespace": "eip155",
                    "injected_id": "isZerion"
                }
            ],
            "categories": [
                "1778cd7f-a539-49fd-9de1-52d9c2101921",
                "1e6917ca-16b1-4e03-aaf2-7b9a1229cd0d",
                "b7c081de-c6d6-447e-ada6-a6f8e6e1480a",
                "e127a2ef-09e5-417b-9304-3e2e567a0f87"
            ],
            "description": "Smart Web3 Wallet",
            "badge_type": "certified",
            "supports_wc": true,
            "is_top_wallet": false,
            "supports_wcpay": false
        },
        {
            "id": "fe68cea63541aa53ce020de7398968566dfe8f3725663a564cac89490247ed49",
            "name": "Best Wallet",
            "homepage": "https://bestwallet.com/",
            "image_id": "7f9574ed-eb42-4e04-0888-be2939936700",
            "order": 120,
            "mobile_link": "bw://app/connect",
            "desktop_link": null,
            "link_mode": null,
            "webapp_link": null,
            "rdns_web_wallet": null,
            "app_store": "https://apps.apple.com/app/best-wallet/id6451312105",
            "play_store": "https://play.google.com/store/apps/details?id=com.bestwallet.mobile",
            "rdns": null,
            "chrome_store": null,
            "injected": null,
            "categories": [
                "e127a2ef-09e5-417b-9304-3e2e567a0f87"
            ],
            "description": "The best independent crypto wallet\n",
            "badge_type": "certified",
            "supports_wc": true,
            "is_top_wallet": false,
            "supports_wcpay": false
        },
        {
            "id": "f2436c67184f158d1beda5df53298ee84abfc367581e4505134b5bcf5f46697d",
            "name": "Crypto.com Onchain",
            "homepage": "https://crypto.com/onchain",
            "image_id": "88388eb4-4471-4e72-c4b4-852d496fea00",
            "order": 130,
            "mobile_link": "dfw://",
            "desktop_link": null,
            "link_mode": "https://wallet.crypto.com/deeplink",
            "webapp_link": null,
            "rdns_web_wallet": null,
            "app_store": "https://apps.apple.com/US/app/id1512048310?mt=8",
            "play_store": "https://play.google.com/store/apps/details?id=com.defi.wallet",
            "rdns": "com.crypto.wallet",
            "chrome_store": "https://chromewebstore.google.com/detail/cryptocom-wallet-extensio/hifafgmccdpekplomjjkcfgodnhcellj",
            "injected": null,
            "categories": [
                "b7c081de-c6d6-447e-ada6-a6f8e6e1480a",
                "e127a2ef-09e5-417b-9304-3e2e567a0f87"
            ],
            "description": "A non-custodial wallet that gives you access to a full suite of DeFi services in one place.",
            "badge_type": "certified",
            "supports_wc": true,
            "is_top_wallet": false,
            "supports_wcpay": false
        },
        {
            "id": "37a686ab6223cd42e2886ed6e5477fce100a4fb565dcd57ed4f81f7c12e93053",
            "name": "Bifrost Wallet",
            "homepage": "https://bifrostwallet.com",
            "image_id": "27c999c6-3492-4161-bbb8-1b75bdb97500",
            "order": 140,
            "mobile_link": "bifrostwallet://",
            "desktop_link": null,
            "link_mode": "https://app.bifrostwallet.com/",
            "webapp_link": null,
            "rdns_web_wallet": null,
            "app_store": "https://apps.apple.com/us/app/bifrost-wallet/id1577198351",
            "play_store": "https://play.google.com/store/apps/details?id=com.bifrostwallet.app",
            "rdns": "com.bifrostwallet",
            "chrome_store": null,
            "injected": null,
            "categories": [
                "e127a2ef-09e5-417b-9304-3e2e567a0f87"
            ],
            "description": "A multi-chain wallet for Flare, XRP, Dogecoin, Bitcoin and beyond.",
            "badge_type": "certified",
            "supports_wc": true,
            "is_top_wallet": false,
            "supports_wcpay": false
        },
        {
            "id": "4119a5b3e5ebc809b6a3680a280ae517b92fead02e4c07b7cec0d3385c87aee2",
            "name": "xPortal",
            "homepage": "https://xportal.com",
            "image_id": "1bc53e49-1e7f-4129-4c87-3f8c7b91cb00",
            "order": 150,
            "mobile_link": "xportal://",
            "desktop_link": null,
            "link_mode": "https://xportal.app.link",
            "webapp_link": null,
            "rdns_web_wallet": null,
            "app_store": "https://apps.apple.com/ro/app/xportal/id1519405832",
            "play_store": "https://play.google.com/store/apps/details?id=com.elrond.maiar.wallet",
            "rdns": "com.elrond.maiar.wallet",
            "chrome_store": "-",
            "injected": null,
            "categories": [
                "b7c081de-c6d6-447e-ada6-a6f8e6e1480a",
                "e127a2ef-09e5-417b-9304-3e2e567a0f87"
            ],
            "description": "Buy, sell, stake, and swap crypto cross-chain. Spend it with xPortal debit cards. Play with blockchain and win rewards.",
            "badge_type": "certified",
            "supports_wc": true,
            "is_top_wallet": false,
            "supports_wcpay": false
        },
        {
            "id": "107bb20463699c4e614d3a2fb7b961e66f48774cb8f6d6c1aee789853280972c",
            "name": "Bitcoin.com Wallet",
            "homepage": "https://www.bitcoin.com/",
            "image_id": "b567c9d7-bd3f-4184-0dc8-297a0e44de00",
            "order": 160,
            "mobile_link": "bitcoincom://",
            "desktop_link": null,
            "link_mode": "https://wallet.bitcoin.com/",
            "webapp_link": "https://wallet.bitcoin.com/",
            "rdns_web_wallet": null,
            "app_store": "https://apps.apple.com/us/app/bitcoin-wallet-by-bitcoin-com/id1252903728",
            "play_store": "https://play.google.com/store/apps/details?id=com.bitcoin.mwallet",
            "rdns": null,
            "chrome_store": null,
            "injected": null,
            "categories": [
                "1778cd7f-a539-49fd-9de1-52d9c2101921",
                "e127a2ef-09e5-417b-9304-3e2e567a0f87"
            ],
            "description": "Buy, sell, store, trade, and use cryptocurrency with the Bitcoin.com Wallet, trusted by millions.",
            "badge_type": "certified",
            "supports_wc": true,
            "is_top_wallet": false,
            "supports_wcpay": false
        },
        {
            "id": "c286eebc742a537cd1d6818363e9dc53b21759a1e8e5d9b263d0c03ec7703576",
            "name": "1inch Wallet",
            "homepage": "http://wallet.1inch.io",
            "image_id": "3e60118c-b9a9-43df-7975-33ebc8014400",
            "order": 170,
            "mobile_link": "oneinch://open/nobodywilleveruseit",
            "desktop_link": null,
            "link_mode": "https://wallet.1inch.io/app/nobodywilleveruseit",
            "webapp_link": null,
            "rdns_web_wallet": null,
            "app_store": "https://apps.apple.com/us/app/1inch-defi-wallet/id1546049391",
            "play_store": "https://play.google.com/store/apps/details?id=io.oneinch.android",
            "rdns": null,
            "chrome_store": null,
            "injected": null,
            "categories": [
                "e127a2ef-09e5-417b-9304-3e2e567a0f87"
            ],
            "description": "1inch Wallet - the DeFi wallet app that puts you in control. With 1inch Swap built-in, scam protection and pro-level efficiency features, 1inch Wallet brings you everything you need to run crypto from your pocket.",
            "badge_type": "certified",
            "supports_wc": true,
            "is_top_wallet": false,
            "supports_wcpay": false
        },
        {
            "id": "6b0182d679b72eb2733dec38d9dee70551cc16a6ce5e7a7f4155ffb6f493c521",
            "name": "Trezor Suite",
            "homepage": "https://trezor.io/trezor-suite",
            "image_id": "3816cd81-6f38-4fa1-7900-f451a1727300",
            "order": 180,
            "mobile_link": "https://connect.trezor.io/9/deeplink/wc",
            "desktop_link": "trezorsuite://walletconnect",
            "link_mode": "https://connect.trezor.io/9/deeplink/wc",
            "webapp_link": null,
            "rdns_web_wallet": null,
            "app_store": "https://apps.apple.com/us/app/trezor-suite/id1631884497",
            "play_store": "https://play.google.com/store/apps/details?id=io.trezor.suite",
            "rdns": null,
            "chrome_store": null,
            "injected": null,
            "categories": [
                "1e6917ca-16b1-4e03-aaf2-7b9a1229cd0d",
                "e127a2ef-09e5-417b-9304-3e2e567a0f87"
            ],
            "description": "Trezor Suite is the companion app for the Trezor hardware wallet",
            "badge_type": "certified",
            "supports_wc": true,
            "is_top_wallet": false,
            "supports_wcpay": false
        },
        {
            "id": "84b43e8ddfcd18e5fcb5d21e7277733f9cccef76f7d92c836d0e481db0c70c04",
            "name": "Blockchain.com",
            "homepage": "https://login.blockchain.com/auth/signup",
            "image_id": "6f913b80-86c0-46f9-61ca-cc90a1805900",
            "order": 190,
            "mobile_link": "blockchain-wallet://",
            "desktop_link": null,
            "link_mode": "https://login.blockchain.com/app",
            "webapp_link": null,
            "rdns_web_wallet": null,
            "app_store": "https://apps.apple.com/us/app/blockchain-bitcoin-wallet/id493253309",
            "play_store": "https://play.google.com/store/apps/details?id=piuk.blockchain.android",
            "rdns": null,
            "chrome_store": null,
            "injected": null,
            "categories": [
                "e127a2ef-09e5-417b-9304-3e2e567a0f87"
            ],
            "description": "The only crypto app you’ll ever need. Buy, store, and do more with your crypto.",
            "badge_type": "certified",
            "supports_wc": true,
            "is_top_wallet": false,
            "supports_wcpay": false
        },
        {
            "id": "ef333840daf915aafdc4a004525502d6d49d77bd9c65e0642dbaefb3c2893bef",
            "name": "imToken",
            "homepage": "https://token.im/",
            "image_id": "c84b4d9d-9525-4bb5-b373-934b46eafc00",
            "order": 200,
            "mobile_link": "imtokenv2://",
            "desktop_link": null,
            "link_mode": null,
            "webapp_link": "https://token.im/",
            "rdns_web_wallet": null,
            "app_store": "https://apps.apple.com/us/app/imtoken2/id1384798940",
            "play_store": "https://play.google.com/store/apps/details?id=im.token.app",
            "rdns": null,
            "chrome_store": null,
            "injected": null,
            "categories": [
                "1778cd7f-a539-49fd-9de1-52d9c2101921",
                "e127a2ef-09e5-417b-9304-3e2e567a0f87"
            ],
            "description": "imToken is an easy and secure digital wallet trusted by millions.",
            "badge_type": "certified",
            "supports_wc": true,
            "is_top_wallet": false,
            "supports_wcpay": false
        },
        {
            "id": "b4678fefcc469583ed4ef58a5bd90ce86208b82803f3c45f2de3e0973d268835",
            "name": "BitPay Wallet",
            "homepage": "https://bitpay.com/wallet",
            "image_id": "553e8fff-37c9-4a62-5bfe-02ff22e1e200",
            "order": 210,
            "mobile_link": "bitpay://",
            "desktop_link": null,
            "link_mode": null,
            "webapp_link": null,
            "rdns_web_wallet": null,
            "app_store": "https://bitpay.onelink.me/Cenw/ejjaw7bs",
            "play_store": "https://bitpay.onelink.me/Cenw/ejjaw7bs",
            "rdns": null,
            "chrome_store": null,
            "injected": null,
            "categories": [
                "e127a2ef-09e5-417b-9304-3e2e567a0f87"
            ],
            "description": "The only wallet app you need to buy, store, swap and spend your crypto.",
            "badge_type": "certified",
            "supports_wc": true,
            "is_top_wallet": false,
            "supports_wcpay": false
        },
        {
            "id": "e3f3db6814131b8b0b12621d134cd327e5ad51f8ecde65565374aae4617a20fd",
            "name": "Gemini",
            "homepage": "https://keys.gemini.com",
            "image_id": "56a3fd87-2627-4903-fddd-205224dac500",
            "order": 220,
            "mobile_link": null,
            "desktop_link": null,
            "link_mode": null,
            "webapp_link": "https://keys.gemini.com",
            "rdns_web_wallet": null,
            "app_store": null,
            "play_store": null,
            "rdns": null,
            "chrome_store": null,
            "injected": null,
            
            "categories": [
                "1778cd7f-a539-49fd-9de1-52d9c2101921"
            ],
            "description": "Gemini Wallet, a self-custody wallet designed for crypto users and developers alike. Whether you're a retail investor looking for a secure, portable gateway to Web3, or a developer seeking an SDK kit to embed the wallet directly into your dapp, the Gemini Wallet brings flexibility, ease of use, and powerful security to onchain access.",
            "badge_type": "certified",
            "supports_wc": true,
            "is_top_wallet": false,
            "supports_wcpay": false,
            "icon": <GeminiColorful />,
        },
        {
            "id": "0e4915107da5b3408b38e248f7a710f4529d54cd30e9d12ff0eb886d45c18e92",
            "name": "Arculus Wallet",
            "homepage": "https://www.arculus.co",
            "image_id": "f78dab27-7165-4a3d-fdb1-fcff06c0a700",
            "order": 230,
            "mobile_link": "arculuswc://",
            "desktop_link": null,
            "link_mode": null,
            "webapp_link": null,
            "rdns_web_wallet": null,
            "app_store": "https://apps.apple.com/us/app/arculus-wallet/id1575425801",
            "play_store": "https://play.google.com/store/apps/details?id=co.arculus.wallet.android&hl=en_US&gl=US",
            "rdns": null,
            "chrome_store": null,
            "injected": null,
            
            "categories": [
                "e127a2ef-09e5-417b-9304-3e2e567a0f87"
            ],
            "description": "Cold Storage Crypto Wallet",
            "badge_type": "certified",
            "supports_wc": true,
            "is_top_wallet": false,
            "supports_wcpay": false
        },
        {
            "id": "f896cbca30cd6dc414712d3d6fcc2f8f7d35d5bd30e3b1fc5d60cf6c8926f98f",
            "name": "Ctrl Wallet",
            "homepage": "https://ctrl.xyz/",
            "image_id": "749856b0-3f0e-4876-4d0f-27835310db00",
            "order": 240,
            "mobile_link": "ctrl-mobile://",
            "desktop_link": null,
            "link_mode": "https://ctrl.xyz/deeplink/wallet",
            "webapp_link": null,
            "rdns_web_wallet": null,
            "app_store": "https://apps.apple.com/us/app/ctrl-wallet/id6630386336",
            "play_store": "https://play.google.com/store/apps/details?id=xyz.ctrl.wallet",
            "rdns": "xyz.ctrl",
            "chrome_store": "https://chrome.google.com/webstore/detail/ctrl-wallet/hmeobnfnfcmdkdcmlblgagmfpfboieaf?hl=en",
            "injected": null,
            "categories": [
                "b7c081de-c6d6-447e-ada6-a6f8e6e1480a",
                "e127a2ef-09e5-417b-9304-3e2e567a0f87"
            ],
            "description": "One wallet for all your crypto. The safest & easiest wallet for 2,300+ chains.",
            "badge_type": "certified",
            "supports_wc": true,
            "is_top_wallet": false,
            "supports_wcpay": false
        },
        {
            "id": "541d5dcd4ede02f3afaf75bf8e3e4c4f1fb09edb5fa6c4377ebf31c2785d9adf",
            "name": "Ronin Wallet",
            "homepage": "https://wallet.roninchain.com/",
            "image_id": "bd78de7e-36da-4552-ebdd-2e420ba05900",
            "order": 250,
            "mobile_link": "roninwallet://",
            "desktop_link": null,
            "link_mode": null,
            "webapp_link": null,
            "rdns_web_wallet": null,
            "app_store": "https://apps.apple.com/us/app/ronin-wallet/id1592675001",
            "play_store": "https://play.google.com/store/apps/details?id=com.skymavis.genesis",
            "rdns": "com.roninchain.wallet",
            "chrome_store": "https://chrome.google.com/webstore/detail/ronin-wallet/fnjhmkhhmkbjkkabndcnnogagogbneec",
            "injected": [
                {
                    "namespace": "eip155",
                    "injected_id": "window.ronin.provider.isRonin"
                }
            ],
            
            "categories": [
                "b7c081de-c6d6-447e-ada6-a6f8e6e1480a",
                "e127a2ef-09e5-417b-9304-3e2e567a0f87"
            ],
            "description": "Ronin Wallet is the mobile wallet that allows you to use all decentralized applications running on Ronin.",
            "badge_type": "certified",
            "supports_wc": true,
            "is_top_wallet": false,
            "supports_wcpay": false
        },
        {
            "id": "225affb176778569276e484e1b92637ad061b01e13a048b35a9d280c3b58970f",
            "name": "Safe",
            "homepage": "https://safe.global/",
            "image_id": "3913df81-63c2-4413-d60b-8ff83cbed500",
            "order": 260,
            "mobile_link": "safe://",
            "desktop_link": null,
            "link_mode": null,
            "webapp_link": "https://app.safe.global/",
            "rdns_web_wallet": null,
            "app_store": "https://apps.apple.com/app/id1515759131",
            "play_store": "https://play.google.com/store/apps/details?id=io.gnosis.safe",
            "rdns": null,
            "chrome_store": null,
            "injected": null,
            
            "categories": [
                "1778cd7f-a539-49fd-9de1-52d9c2101921",
                "e127a2ef-09e5-417b-9304-3e2e567a0f87"
            ],
            "description": "The most trusted platform to manage digital assets.",
            "badge_type": "certified",
            "supports_wc": true,
            "is_top_wallet": false,
            "supports_wcpay": false
        }
    ];

WalletConnectWallets.forEach((wallet) => {
  if (!wallet.icon && wallet.image_id) {
    wallet.icon = getWalletImageUrl(wallet.image_id, {
      projectId: WALLET_CONNECT_PROJECT_ID,
    });
  }
});
