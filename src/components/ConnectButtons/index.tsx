import { Box, Button, Grid, GridItem, useDisclosure } from '@chakra-ui/react';
import SvgIcon from '../SvgIcon';

export interface ConnectButtonsTypes {
  open: () => void;
  close: () => void;
}
const ConnectButtons = (props: any, ref: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useImperativeHandle(ref, () => ({
    open: onOpen,
    close: onClose,
  }));

  const handleClose = () => {
    onClose();
  };

  const deepLinks = [
    {
      icon: 'metamask-wallet',
      name: 'MetaMask',
      link: `https://metamask.app.link/dapp/${window.location.href}`,
    },
    // {
    //   icon: 'binance-wallet',
    //   name: 'Binance Chain',
    //   link: `bnc://app.binance.com/cedefi/ton-connect/dapp?url=${encodeURIComponent(window.location.href)}`,
    // },
    {
      icon: 'coinbase-wallet',
      name: 'Coinbase Wallet',
      link: `https://go.cb-w.com/dapp?cb_url=[${encodeURIComponent(window.location.href)}`,
    },
    {
      icon: 'trust-wallet',
      name: 'Trust Wallet',
      link: `https://link.trustwallet.com/open_url?coin_id=60&url=${window.location.href}`,
    },
    {
      icon: 'token-pocket-wallet',
      name: 'TokenPocket',
      link: `tpdapp://open?params=${encodeURIComponent(JSON.stringify({ url: window.location.href }))}`,
    },
    {
      icon: 'okx-wallet',
      name: 'OkX Wallet',
      link: `okx://wallet/dapp/url?dappUrl=${encodeURIComponent(window.location.href)}`,
    },

    {
      icon: 'imtoken-wallet',
      name: 'ImToken',
      link: `imtokenv2://navigate?screen=DappView&url=${window.location.href}`,
    },
  ];

  return (
    <Box width="100%" height="100%" bg="pageBgColor" p="20px" roundedTop={'20px'} overflow="scroll">
      <Grid templateColumns="repeat(2, 1fr)" columnGap="14px" rowGap="14px">
        {deepLinks.map((item, i) => (
          <GridItem key={item.name} w="100%" h="52px">
            <Button
              key={item.name}
              mt="20px"
              width="100%"
              height="52px"
              bg="primaryAlpha.100"
              color="primary"
              justifyContent="start"
              fontSize="14px"
              onClick={() => window.open(item.link)}
              _hover={{ bg: 'primaryAlpha.200' }}
              _active={{ bg: 'primaryAlpha.200' }}
              leftIcon={<SvgIcon name={item.icon} style={{ width: '24px', height: '24px' }} />}
            >
              {item.name}
            </Button>
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
};

export default forwardRef(ConnectButtons);
