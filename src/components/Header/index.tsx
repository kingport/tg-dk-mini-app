import { NavBar } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import SvgIcon from '../SvgIcon';
import { useScroll } from 'ahooks';
import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  GridItem,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  Text,
  PopoverHeader,
  PopoverTrigger,
  Tag,
} from '@chakra-ui/react';
import './index.css';
import { ChevronDownIcon, Search2Icon } from '@chakra-ui/icons';
import { Setting } from './Setting';
import Wallet from '../Wallet';
import { useParams } from 'react-router-dom';
import EvmWallet from '../EvmWallet';

interface HeaderNavProps {
  onBack?: () => void;
  title?: any;
  renderRight?: any;
  renderLeft?: any;
  border?: any;
  leftColor?: string;
  bg?: string;
  color?: string;
  leftIconColor?: string;
  height?: string;
}
const HeaderNav = (props: HeaderNavProps) => {
  const navigate = useNavigate();

  // 判断url 上是否 solana  如果有则显示 solana 的钱包
  const data = useParams();
  const location = useLocation();

  console.log(location, '=====> url参数');

  return (
    <Box display="flex" alignItems="center" justifyContent={'space-between'} h="56px" p="4">
      <Flex alignItems={'center'}>
        <a className="css-srcfng" href="/?chain=sol&amp;ref=pMcEttvr" style={{ color: 'rgb(255, 255, 255)', cursor: 'pointer', height: '32px' }}>
          <Image alt="gmgn" src="https://cdn.pixilart.com/images/user/profile/medium/291.png" width={'32px'} height={'32px'} />
        </a>
        {/* <Flex gap="3" pl="4">
          <a>Meme</a>
          <a>热门</a>
        </Flex> */}
        <Flex gap="10" pl="4">
          <Button variant="unstyled" display="flex" alignItems={'center'} rightIcon={<ChevronDownIcon />}>
            NFT
          </Button>
          <Button variant="unstyled" display="flex" alignItems={'center'}>
            实时 GAS
          </Button>
          <Popover trigger="hover">
            <PopoverTrigger>
              <Button variant="unstyled" display="flex" alignItems={'center'} rightIcon={<ChevronDownIcon />}>
                批量操作
              </Button>
            </PopoverTrigger>
            <PopoverContent border="none" width={'full'} px="5" py="5" minW="600px">
              <PopoverArrow />
              <PopoverBody>
                <Grid templateColumns="repeat(4, 1fr)" gap={4}>
                  <GridItem w="100%">
                    <Flex fontWeight={600} alignItems={'center'} pb="2">
                      <Image mr="1" data-v-8deae3de="" src="https://cdn-bs.mycointool.com/icon/upload/1718178440893.svg" className="w-[20px] h-[20px] object-contain" alt="" />
                      钱包相关
                    </Flex>
                    <Divider />
                    <Flex fontSize={'sm'} mt="6" flexDirection={'column'} gap="3">
                      <Text
                        cursor="pointer"
                        _hover={{
                          color: 'orange',
                        }}
                      >
                        批量生成钱包
                      </Text>
                    </Flex>
                  </GridItem>
                  <GridItem w="100%">
                    <Flex fontWeight={600} alignItems={'center'} pb="2">
                      <Image mr="1" data-v-8deae3de="" src="https://cdn-bs.mycointool.com/icon/upload/1718178667684.svg" className="w-[20px] h-[20px] object-contain" alt="" />
                      一对多
                    </Flex>
                    <Divider />
                    <Flex fontSize={'sm'} mt="6" flexDirection={'column'} gap="3">
                      <Text
                        cursor="pointer"
                        _hover={{
                          color: 'orange',
                        }}
                        display="flex"
                        alignItems={'center'}
                        onClick={() => (window.location.href = '/token-sender')}
                      >
                        批量转账{' '}
                        <Tag ml="1" size={'sm'} colorScheme="green">
                          可用
                        </Tag>
                      </Text>
                      <Text
                        cursor="pointer"
                        _hover={{
                          color: 'orange',
                        }}
                      >
                        BTC 批量转账
                      </Text>
                      <Text
                        cursor="pointer"
                        _hover={{
                          color: 'orange',
                        }}
                        onClick={() => (window.location.href = '/solana/token-sender')}
                      >
                        Solana 批量转账
                        <Tag ml="1" size={'sm'} colorScheme="green">
                          可用
                        </Tag>
                      </Text>
                    </Flex>
                  </GridItem>
                  <GridItem w="100%">
                    <Flex fontWeight={600} alignItems={'center'} pb="2">
                      <Image mr="1" data-v-8deae3de="" src="https://cdn-bs.mycointool.com/icon/upload/1718178681301.svg" className="w-[20px] h-[20px] object-contain" alt="" />
                      多对一
                    </Flex>
                    <Divider />
                    <Flex fontSize={'sm'} mt="6" flexDirection={'column'} gap="3">
                      <Text
                        cursor="pointer"
                        _hover={{
                          color: 'orange',
                        }}
                        onClick={() => navigate('/more-to-one')}
                      >
                        批量归集
                        <Tag ml="1" size={'sm'} colorScheme="green">
                          可用
                        </Tag>
                      </Text>
                      <Text
                        cursor="pointer"
                        _hover={{
                          color: 'orange',
                        }}
                      >
                        BTC 批量归集
                      </Text>
                    </Flex>
                  </GridItem>
                  <GridItem w="100%">
                    <Flex fontWeight={600} alignItems={'center'} pb="2">
                      <Image mr="1" data-v-8deae3de="" src="https://cdn-bs.mycointool.com/icon/upload/1718178667684.svg" className="w-[20px] h-[20px] object-contain" alt="" />
                      多对多
                    </Flex>
                    <Divider />
                    <Flex fontSize={'sm'} mt="6" flexDirection={'column'} gap="3">
                      <Text
                        cursor="pointer"
                        _hover={{
                          color: 'orange',
                        }}
                      >
                        多对多转账
                      </Text>
                    </Flex>
                  </GridItem>
                </Grid>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </Flex>
      </Flex>
      {/* <Flex paddingInline="6" style={{ flex: '1 1 0%' }}>
        <InputGroup rounded="6">
          <InputLeftElement pointerEvents="none" color="gray.300" fontSize="1.2em">
            <Search2Icon color="#5C6068" />
          </InputLeftElement>
          <Input placeholder="搜索代币/钱包" borderRadius="12px" />
        </InputGroup>
      </Flex> */}
      <Flex alignItems={'center'} gap="4">
        {/* <Flex borderRadius={'8px'} h="10" alignItems={'center'}>
          <Flex alignItems={'center'} gap="1" h="8" paddingInline="2" borderRadius={'8px'} bg="#393C43" cursor="pointer" fontWeight={500}>
            <Image alt="network" src="https://gmgn.ai/static/img/solana.webp" w="5" h="5" />
            SOL
          </Flex>
          <Flex alignItems={'center'} gap="1" h="8" paddingInline="2" borderRadius={'8px'} cursor="pointer" fontWeight={500}>
            <Image alt="network" src="	https://gmgn.ai/static/img/tron.webp" w="5" h="5" />
            Tron
          </Flex>
          <Flex alignItems={'center'} gap="1" h="8" paddingInline="2" borderRadius={'8px'} cursor="pointer" fontWeight={500}>
            <Image alt="network" src="	https://gmgn.ai/static/img/base.webp" w="5" h="5" />
            Base
          </Flex>
          <Flex alignItems={'center'} gap="1" h="8" paddingInline="2" borderRadius={'8px'} cursor="pointer" fontWeight={500}>
            <Image alt="network" src="	https://gmgn.ai/static/img/ether.webp" w="5" h="5" />
            ETH
          </Flex>
        </Flex> */}
        {/* setting */}
        {/* <Setting /> */}
        {/* wallet */}
        {location.pathname.includes('solana') ? <Wallet /> : <EvmWallet />}
      </Flex>
    </Box>
  );
};
export default HeaderNav;
