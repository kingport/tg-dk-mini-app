import {
  Box,
  Button,
  Image,
  Modal,
  Text,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Flex,
  Menu,
  MenuList,
  MenuItem,
  Popover,
  PopoverTrigger,
  PopoverHeader,
  PopoverBody,
  PopoverContent,
} from '@chakra-ui/react';
import React, { FC, useMemo } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import SvgIcon from '../SvgIcon';
import { useBalance } from '@/hooks/useBalance';
import { h5Copy, numberFormat, formatPublicKey } from '@/utils/util';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { Keypair } from '@solana/web3.js';
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes';
import { observer } from 'mobx-react';

const Wallet = () => {
  const { walletInfo } = userWalletStores().userwalletStore;
  const { userwalletStore } = userWalletStores();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: tgisOpen, onOpen: tgOnOpen, onClose: tgOnClose } = useDisclosure();
  const { wallets, select, signMessage, publicKey, connected, disconnect } = useWallet();

  console.log(connected, '=====> 插件钱包链接状态');
  console.log(publicKey?.toBase58(), '=====> 插件钱包publicKey');

  const balance = useBalance(walletInfo[walletInfo?.walletType]?.publicKey);

  // 调用钱包签名
  const handleSignMessage = useCallback(async () => {
    if (!publicKey) {
      console.log('Wallet not connected!');
      return;
    }
    if (!signMessage) {
      console.log('signMessage is undefined');
      return;
    }
    try {
      const message = new TextEncoder().encode('Hello, Solana!');
      const signature = await signMessage(message);
      console.log('Signature:', Buffer.from(signature).toString('hex'));
    } catch (error) {
      console.error('Error signing message:', error);
    }
  }, [publicKey, signMessage]);

  // 生成一个本地钱包
  const createWallet = () => {
    // 如果本地存在钱包，那就不生成直接使用
    if (walletInfo['localWallet']?.secretKey) {
      userwalletStore.changeUserWalletStore({
        ...walletInfo,
        walletType: 'localWallet',
      });
    } else {
      const storageWallet = Keypair.generate();
      // 将密钥 公钥存储到本地 实际情况存到服务
      userwalletStore.changeUserWalletStore({
        ...walletInfo,
        walletType: 'localWallet',
        localWallet: {
          // 公钥
          publicKey: storageWallet.publicKey.toBase58(),
          // 私钥
          secretKey: bs58.encode(storageWallet.secretKey),
        },
      });
    }

    tgOnClose();
  };

  // 插件钱包也链接了
  useEffect(() => {
    if (connected && publicKey) {
      // handleSignMessage();
      onClose();
      tgOnClose();
      userwalletStore.changeUserWalletStore({
        ...walletInfo,
        walletType: 'pluginWallet',
        pluginWallet: {
          // 公钥
          publicKey: publicKey.toBase58(),
        },
      });
    }
  }, [connected, publicKey]);

  return (
    <Box display="flex" justifyContent={'end'}>
      <Button
        size="xs"
        px="4"
        minW="85px"
        borderRadius={'10px'}
        bg="#f5f5f5"
        color={'#000'}
        _hover={{
          bg: '#cecece',
          color: '#000',
        }}
        onClick={tgOnOpen}
        hidden={walletInfo?.walletType}
      >
        连接
      </Button>
      <Popover>
        <PopoverTrigger>
          <Flex cursor={'pointer'} gap="2" alignItems="center" hidden={!walletInfo[walletInfo?.walletType]?.publicKey} bg="#17181b" p="2" borderRadius={'8px'} mt="1">
            <Image src="https://cdn.pixilart.com/images/user/profile/medium/291.png" alt="gmgn" w="6" h="6" borderRadius="50%" />
            <Flex flexDirection={'column'} justifyContent={'center'}>
              <Flex alignItems={'center'} gap="1">
                <SvgIcon name="sol" style={{ width: '12px', height: '12px' }} />
                <Text fontSize="xs" fontWeight={500}>
                  {balance && numberFormat(balance, 5)}
                </Text>
              </Flex>
              <Flex alignItems={'center'} gap="1">
                <Text fontSize="xs" color="gray.400">
                  {formatPublicKey(walletInfo[walletInfo?.walletType]?.publicKey)}
                </Text>
                <SvgIcon
                  onClick={() => {
                    if (walletInfo[walletInfo?.walletType]?.publicKey) h5Copy(walletInfo[walletInfo?.walletType]?.publicKey);
                  }}
                  name="copy"
                  style={{ width: '12px', height: '12px' }}
                />
              </Flex>
            </Flex>
            <ChevronDownIcon />
          </Flex>
        </PopoverTrigger>
        <PopoverContent bg="#17181b" border="none" maxWidth={'200px'}>
          <PopoverBody>
            <Flex flexDirection={'column'} gap="2">
              <Button minH="8" variant="ghost" justifyContent={'start'} fontSize={'xs'}>
                我的钱包
              </Button>
              <Button minH="8" variant="ghost" justifyContent={'start'} fontSize={'xs'}>
                充值提现
              </Button>
              <Button
                minH="8"
                variant="ghost"
                justifyContent={'start'}
                fontSize={'xs'}
                onClick={() => {
                  disconnect();
                  userwalletStore.changeUserWalletStore({
                    ...walletInfo,
                    walletType: '',
                    pluginWallet: {
                      // 公钥
                      publicKey: '',
                    },
                  });
                  // // 如果当前链接的是本地钱包且插件钱包也链接了，那修改钱包类型为插件钱包 且当前已插件钱包来操作
                  // if (walletInfo[walletInfo?.walletType] === 'localWallet' && publicKey) {
                  //   userwalletStore.changeUserWalletStore({
                  //     ...walletInfo,
                  //     walletType: 'pluginWallet',
                  //     pluginWallet: {
                  //       // 公钥
                  //       publicKey: publicKey.toBase58(),
                  //     },
                  //   });
                  // }
                  // // 如果只有插件钱包链接了，那就断开插件钱包
                  // if (walletInfo?.walletType === 'pluginWallet' && connected) {
                  //   userwalletStore.changeUserWalletStore({
                  //     ...walletInfo,
                  //     pluginWallet: {
                  //       publicKey: '',
                  //     },
                  //   });
                  //   disconnect();
                  // }
                }}
              >
                断开链接
              </Button>
            </Flex>
          </PopoverBody>
        </PopoverContent>
      </Popover>
      <Modal isCentered onClose={tgOnClose} isOpen={tgisOpen} motionPreset="slideInBottom">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDirection={'column'} gap="2" justifyContent={'center'} alignItems={'center'}>
              {/* <Button onClick={createWallet}>{walletInfo['localWallet']?.secretKey ? '使用本地交易钱包' : '生成快速交易钱包'}</Button> */}
              <Text as="u" onClick={onOpen} fontSize={'xs'} cursor="pointer">
                连接插件钱包
              </Text>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal isCentered onClose={onClose} isOpen={isOpen} motionPreset="slideInBottom">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>连接一个 Solana 钱包以继续</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex gap="4" flexDirection={'column'} w="full">
              {wallets.filter((wallet) => wallet.readyState === 'Installed').length > 0 ? (
                wallets
                  .filter((wallet) => wallet.readyState === 'Installed')
                  .map((wallet) => (
                    <Button
                      key={wallet.adapter.name}
                      onClick={() => select(wallet.adapter.name)}
                      size="lg"
                      fontSize="md"
                      justifyContent={'space-between'}
                      rightIcon={<Image src={wallet.adapter.icon} alt={wallet.adapter.name} h={6} w={6} />}
                    >
                      {wallet.adapter.name}
                    </Button>
                  ))
              ) : (
                <Text>No wallet found. Please download a supported Solana wallet</Text>
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};
export default observer(Wallet);
