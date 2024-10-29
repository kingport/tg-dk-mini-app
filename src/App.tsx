import Router from '@/routers/index';
import { BrowserRouter } from 'react-router-dom';
import ScrollToTop from '@components/ScrollToTop';
import FooterBar from './components/FooterBar';
import { useRequest } from 'ahooks';
import useAccessToken from './hooks/useAccessToken';
import HeaderNav from './components/Header';
import '@solana/wallet-adapter-react-ui/styles.css';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';
import { CloverWalletAdapter, PhantomWalletAdapter, SolflareWalletAdapter, MathWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WagmiProvider } from 'wagmi';
import { config } from './config/config';

export default function App() {
  const { userStore } = userStores();
  const { existToken } = useAccessToken();

  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter(), new CloverWalletAdapter(), new MathWalletAdapter()], []);

  // 是否是EVM 链
  const isEvm = window.location.href.includes('solana');

  if (!isEvm) {
    return (
      <BrowserRouter basename={import.meta.env.VITE_PUBLIC_PATH as string}>
        <ScrollToTop>
          {/* <HeaderNav /> */}
          <div className="content">
            <Router />
          </div>
        </ScrollToTop>
      </BrowserRouter>
    );
  } else {
    return (
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <BrowserRouter basename={import.meta.env.VITE_PUBLIC_PATH as string}>
            <ScrollToTop>
              {/* <HeaderNav /> */}
              <div className="content">
                <Router />
              </div>
            </ScrollToTop>
          </BrowserRouter>
        </WalletProvider>
      </ConnectionProvider>
    );
  }

  // return (
  //   <BrowserRouter basename={import.meta.env.VITE_PUBLIC_PATH as string}>
  //     <ScrollToTop>
  //       <HeaderNav />
  //       <div className="content">
  //         <Router />
  //       </div>
  //     </ScrollToTop>
  //   </BrowserRouter>
  // );
}
