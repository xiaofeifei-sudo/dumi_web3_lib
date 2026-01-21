import type {Token} from "pelican-web3-lib-common";
import {Mainnet, Sepolia} from "../chains";
import {DAICircleColorful} from "pelican-web3-lib-icons";

export const DAI: Token = {
  name: 'DAI',
  symbol: 'DAI',
  decimal: 6,
  icon: <DAICircleColorful/>,
  availableChains: [
    {
      chain: Mainnet,
      contract: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    },
    {
      chain: Sepolia,
      contract: '0xf5c142292B85253e4D071812c84f05ec42828fdB'
    }
  ],
};
