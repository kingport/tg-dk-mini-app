import { Box, Image, Grid, GridItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Wrap, useDisclosure, Button, Text } from '@chakra-ui/react';

type PropTypes = {
  setChains: Function;
  chains: any;
};
const ChainLinks = (props: PropTypes) => {
  const { setChains, chains } = props;
  const { globalStore } = globalStores();

  const chainLinks = globalStore.chainsLinks;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const selectChain = (item) => {
    onClose();
    setChains(item);
    const encodedChainId = encodeURIComponent(item.chain_id);
    const newUrl = `${window.location.href.split('?')[0]}?chainId=${encodedChainId}`;
    window.history.replaceState({ path: newUrl }, '', newUrl);
    globalStore.changeChain(item);
  };

  useEffect(() => {
    // 获取当前 URL
    const currentUrl = window.location.href;

    // 使用 URLSearchParams 获取查询参数
    const params = new URLSearchParams(currentUrl.split('?')[1]);
    const chainId = params.get('chainId');
    if (chainId) {
      setChains(
        Object.assign(
          {},
          chainLinks.find((item) => item.chain_id === Number(chainId)),
        ),
      );
    } else if (!chains) {
      setChains(
        Object.assign(
          {},
          chainLinks.find((item) => item.chain_id === 56),
        ),
      );
    }
  }, []);

  return (
    <>
      <Box mt="4" h="10" p="2" fontSize="sm" border="1px solid" borderColor="gray" _hover={{ borderColor: 'primary' }} borderRadius="md" onClick={onOpen}>
        <Wrap align="center">
          <Image src={chains?.icon} w="5" h="5" /> <Text>{chains?.name}</Text>
        </Wrap>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} isCentered autoFocus={false} scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent minW={500}>
          <ModalCloseButton />
          <ModalBody>
            <Text py="2">主网</Text>
            <Grid templateColumns="repeat(3, 1fr)" gap={3}>
              {chainLinks.map((item, index) => (
                <GridItem key={index} hidden={!(item?.network_type === 'evm' && item.l2 == 0)}>
                  <Button
                    textAlign={'left'}
                    w="full"
                    leftIcon={<Image w="4" h="4" src={item.icon} />}
                    fontSize="xs"
                    bg={chains?.chain_id === item.chain_id ? 'primary' : 'whiteAlpha.100'}
                    _hover={{ bg: 'primary', color: 'white' }}
                    onClick={() => selectChain(item)}
                    justifyContent={'flex-start'}
                  >
                    {item.name}
                  </Button>
                </GridItem>
              ))}
            </Grid>
            <Text py="2">Layer 2</Text>
            <Grid templateColumns="repeat(3, 1fr)" gap={3}>
              {chainLinks.map((item, index) => (
                <GridItem key={index} hidden={!(item?.network_type === 'evm' && item.l2 !== 0)}>
                  <Button
                    textAlign={'left'}
                    w="full"
                    leftIcon={<Image w="4" h="4" src={item.icon} />}
                    fontSize="xs"
                    bg={chains?.chain_id === item.chain_id ? 'primary' : 'whiteAlpha.100'}
                    _hover={{ bg: 'primary', color: 'white' }}
                    onClick={() => selectChain(item)}
                    justifyContent={'flex-start'}
                  >
                    {item.name}
                  </Button>
                </GridItem>
              ))}
            </Grid>
            <Text py="2">非EVM链</Text>
            <Grid templateColumns="repeat(3, 1fr)" gap={3}>
              {chainLinks.map((item, index) => (
                <GridItem key={index} hidden={item?.network_type === 'evm'}>
                  <Button
                    textAlign={'left'}
                    w="full"
                    leftIcon={<Image w="4" h="4" src={item.icon} />}
                    fontSize="xs"
                    bg={chains?.chain_id === item.chain_id ? 'primary' : 'whiteAlpha.100'}
                    _hover={{ bg: 'primary', color: 'white' }}
                    onClick={() => selectChain(item)}
                    justifyContent={'flex-start'}
                  >
                    {item.name}
                  </Button>
                </GridItem>
              ))}
            </Grid>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ChainLinks;
