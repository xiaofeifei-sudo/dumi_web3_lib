import { Token } from "pelican-web3-lib-common";
import {BSC, Mainnet} from "../chains/ethereum";
import {TronMainnet} from "../chains/tron";
import { TusdCircleColorful } from "pelican-web3-lib-icons";

export const TUSD: Token = {
  name: 'TUSD',
  symbol: 'TUSD',
  decimal: 6,
  icon: <TusdCircleColorful />,
  availableChains: [
    // evm
    {
      chain: Mainnet,
      contract: '0x0000000000085d4780b73119b644ae5ecd22b376',
    },
    {
      chain: TronMainnet,
      contract: 'TUpMhErZL2fhh4sVNULAbNKLokS4GjC1F4',
    },
    {
      chain: BSC,
      contract: '0x40af3827f39d0eacbf4a168f8d4ee67c121d11c9'
    }
  ],
};
