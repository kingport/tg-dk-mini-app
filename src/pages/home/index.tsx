import { Avatar, Box, Button, CircularProgress, Container, Divider, Flex, Grid, Heading, Image, Skeleton, Text, Wrap, WrapItem, useColorMode } from '@chakra-ui/react';
import WebApp from '@twa-dev/sdk';
import { OKXUniversalProvider } from '@okxconnect/universal-provider';
import { OKXUniversalConnectUI, THEME } from '@okxconnect/ui';

const Home = () => {
  // const [okxUniversalProvider, setOkxUniversalProvider] = useState<OKXUniversalProvider | null>(null);
  const [provider, setProvider] = useState<OKXUniversalProvider | null>(null);
  const [data, setData] = useState<any>(null);
  const [universalUi, setUniversalUi] = useState<OKXUniversalConnectUI | null>(null);

  const connectParams = {
    namespaces: {
      solana: {
        chains: [
          'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp', //solana mainnet
          'solana:4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z', //solana testnet
          'sonic:4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z', // sonic testnet
        ],
      },
    },
    sessionConfig: {
      redirect: 'tg://resolve',
    },
  };

  const initSDK = async () => {
    const provider = await OKXUniversalProvider.init({
      dappMetaData: {
        name: 'application name',
        icon: 'application icon url',
      },
    });
    setProvider(provider);

    const universalUi = await OKXUniversalConnectUI.init({
      dappMetaData: {
        icon: 'https://static.okx.com/cdn/assets/imgs/247/58E63FEA47A2B7D7.png',
        name: 'OKX WalletConnect UI Demo',
      },
      actionsConfiguration: {
        returnStrategy: 'tg://resolve',
        modals: 'all',
        tmaReturnUrl: 'back',
      },
      language: 'en_US',
      uiPreferences: {
        theme: THEME.LIGHT,
      },
    });
    setUniversalUi(universalUi);
  };

  useEffect(() => {
    initSDK();
  }, []);

  return (
    <Box px={4} gap="4" pt={4} h="full" display="flex" flexDirection="column">
      <Button onClick={() => WebApp.showAlert(`Hello World! Current count is ${1}`)}>Show Alert</Button>
      <Button
        onClick={async () => {
          // alert('链接 OKX223');
          await provider?.connect(connectParams);
        }}
      >
        链接 OKX223
      </Button>
      <Box>{JSON.stringify(data)}</Box>
    </Box>
  );
};

export default Home;
