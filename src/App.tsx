import Router from '@/routers/index';
import { BrowserRouter } from 'react-router-dom';
import ScrollToTop from '@components/ScrollToTop';
import { useRequest } from 'ahooks';
// import '@solana/wallet-adapter-react-ui/styles.css';
// import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
// import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
// import { clusterApiUrl } from '@solana/web3.js';
// import { CloverWalletAdapter, PhantomWalletAdapter, SolflareWalletAdapter, MathWalletAdapter } from '@solana/wallet-adapter-wallets';
// import { WagmiProvider } from 'wagmi';
// import { config } from './config/config';

export default function App() {
  // const { userStore } = userStores();

  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  // const network = WalletAdapterNetwork.Mainnet;
  // const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  // const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter(), new CloverWalletAdapter(), new MathWalletAdapter()], []);



  return (
    <BrowserRouter basename={import.meta.env.VITE_PUBLIC_PATH as string}>
      <ScrollToTop>
        <div className="content">
          <Router />
        </div>
      </ScrollToTop>
    </BrowserRouter>
  );
}
