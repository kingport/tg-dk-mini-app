import { Avatar, Box, Button, CircularProgress, Container, Divider, Flex, Grid, Heading, Image, Skeleton, Text, Wrap, WrapItem, useColorMode } from '@chakra-ui/react';
import WebApp from '@twa-dev/sdk';
import { OKXUniversalProvider } from '@okxconnect/universal-provider';
import { useBalance } from '@/hooks/useBalance';

const Home = () => {
  const [provider, setProvider] = useState<any | null>(null);
  const [data, setData] = useState<any>(null);
  const [publicKey, setPublicKey] = useState<any>(null);
  const balance = useBalance(publicKey);
  console.log(balance, 'balance===>余额');

  

  

  useEffect(() => {   
    if(!WebApp) return;
    OKXUniversalProvider.init({
      dappMetaData: {
        name: 'application name',
        icon: 'application icon url',
      },
    }).then((provider) => {
      alert(`suceess ${JSON.stringify(provider)}`);
      setProvider(provider);
      // setPublicKey(provider.getAccount().address)
     
    }).catch((error) => {
      alert(`error ${JSON.stringify(error)}`);
    });
  }, [WebApp]);

  // provider?.on('connect', (data) => {
  //   alert('connect')
  // });

  // provider?.on('disconnect', (data) => {
  //   alert('disconnect')
  // });

  return (
    <Box px={4} gap="4" pt={4} h="full" display="flex" flexDirection="column">
      <Button onClick={() => WebApp.showAlert(`Hello World! Current count is ${1}`)}>Show Alert</Button>
      <Button
        onClick={() => {
          const connectParams = {
            namespaces: {
              solana: {
                chains: [
                  'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp', //solana mainnet
                ],
              },
            },
            sessionConfig: {
              redirect: 'tg://resolve',
            },
          };
         provider?.connect(connectParams).then((data) => {
          setData(data);
         });
        }}
      >
        OKX Wallet
      </Button>
      
      <Box>{provider?.getAccount()?.address}</Box>
      <Box border="1px solid"></Box>

      <Box>{balance}</Box>
      <Box border="1px solid"></Box>

      <Box>1{JSON.stringify(data)}1</Box>
      <Box>1{JSON.stringify(WebApp)}1</Box>
    </Box>
  );
};

export default Home;
