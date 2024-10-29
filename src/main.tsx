import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';

import App from './App';
import 'virtual:svg-icons-register';

import Theme from '@/config/theme';

import { WagmiProvider } from 'wagmi';
import { config } from './config/config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import WebApp from '@twa-dev/sdk';

import './i18n';
import '@/styles/reset.css';
import '@/styles/global.scss';

const queryClient = new QueryClient();
// WebApp.ready() - 是一个方法，向 Telegram 应用程序通知小程序已准备好显示。建议尽可能早地调用此方法，一旦加载了所有必要的接口元素。一旦调用此方法，加载的占位符将被隐藏，小程序将被显示。
WebApp.ready();
// const isEvm = !window.location.href.includes('solana');

// isEvm
//   ? ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
//       <ChakraProvider theme={Theme} toastOptions={{ defaultOptions: { isClosable: true, position: 'bottom', containerStyle: { mb: '120px', maxWidth: '90vw', maxHeight: '80vh' } } }}>
//         <WagmiProvider config={config}>
//           <QueryClientProvider client={queryClient}>
//             <App />
//           </QueryClientProvider>
//         </WagmiProvider>
//       </ChakraProvider>,
//     )
//   : ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
//       <ChakraProvider theme={Theme} toastOptions={{ defaultOptions: { isClosable: true, position: 'bottom', containerStyle: { mb: '120px', maxWidth: '90vw', maxHeight: '80vh' } } }}>
//         <QueryClientProvider client={queryClient}>
//           <App />
//         </QueryClientProvider>
//       </ChakraProvider>,
//     );

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ChakraProvider theme={Theme} toastOptions={{ defaultOptions: { isClosable: true, position: 'bottom', containerStyle: { mb: '120px', maxWidth: '90vw', maxHeight: '80vh' } } }}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </ChakraProvider>,
);

// ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
//   <ChakraProvider theme={Theme} toastOptions={{ defaultOptions: { isClosable: true, position: 'bottom', containerStyle: { mb: '120px', maxWidth: '90vw', maxHeight: '80vh' } } }}>
//     <WagmiProvider config={config}>
//       <QueryClientProvider client={queryClient}>
//         <App />
//       </QueryClientProvider>
//     </WagmiProvider>
//   </ChakraProvider>,
// );
