import { createConfig, createStorage, http } from 'wagmi';
import { bsc, mainnet, zkSync, arbitrum, mode, linea, polygon, scroll, polygonZkEvm } from 'wagmi/chains';
import * as allChain from 'wagmi/chains';

import { walletConnect } from 'wagmi/connectors';

console.log(allChain.bsc, 'allChain');
console.log(bsc, 'bsc');

export const config = createConfig({
  chains: [mainnet, bsc, arbitrum, zkSync, scroll,polygon,polygonZkEvm, mode, linea],
  transports: {
    [mainnet.id]: http(),
    [bsc.id]: http(),
    [arbitrum.id]: http(),
    [zkSync.id]: http(),
    [mode.id]: http(),
    [linea.id]: http(),
    [polygon.id]: http(),
    [scroll.id]: http(),
    [polygonZkEvm.id]: http(),
  },
  storage: createStorage({ storage: window.localStorage }),
  connectors: [walletConnect({ projectId: import.meta.env.VITE_PUBLIC_PROJECT_ID })],
});
