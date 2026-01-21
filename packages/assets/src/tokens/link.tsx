import { LinkColorful } from "pelican-web3-lib-icons";
import {BSC, BSCTestNet, Mainnet, Sepolia} from "../chains/ethereum";
import { Token } from "pelican-web3-lib-common";

export const LINK: Token = {
  name: 'LINK',
  symbol: 'LINK',
  decimal: 6,
  icon: <LinkColorful />,
  availableChains: [
    // evm
    {
      chain: Mainnet,
      contract: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
    },
    {
      chain: Sepolia,
      contract: '0x779877A7B0D9E8603169DdbD7836e478b4624789'
    },
    {
      chain: BSC,
      contract: '0x404460C6A5EdE2D891e8297795264fDe62ADBB75'
    },
    {
      chain: BSCTestNet,
      contract: '0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06'
    }
  ],
};
