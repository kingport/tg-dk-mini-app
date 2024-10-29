import { Avatar, Box, Button, CircularProgress, Container, Divider, Flex, Grid, Heading, Image, Skeleton, Text, Wrap, WrapItem, useColorMode } from '@chakra-ui/react';
import WebApp from '@twa-dev/sdk';
import { OKXUniversalProvider } from '@okxconnect/universal-provider';

const Home = () => {
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
  return (
    <Box px={4} gap="4" pt={4} h="full" display="flex" flexDirection="column">
      <Button onClick={() => WebApp.showAlert(`Hello World! Current count is ${1}`)}>Show Alert</Button>
      <Button
        onClick={async () => {
          const okxUniversalProvider = await OKXUniversalProvider.init({
            dappMetaData: {
              name: 'application name',
              icon: 'application icon url',
            },
          });
          okxUniversalProvider.connect(connectParams);
        }}
      >
        链接 OKX
      </Button>
    </Box>
  );
};

export default Home;
