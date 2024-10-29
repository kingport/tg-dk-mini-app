import {
  Box,
  Button,
  Card,
  CardBody,
  Checkbox,
  Text,
  Flex,
  Grid,
  GridItem,
  Heading,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  Wrap,
  Input,
  Select,
  Tabs,
  TabList,
  Tab,
  Switch,
  IconButton,
} from '@chakra-ui/react';
import AddChain from './components/AddChain';
import ChainLinks from './components/ChainLinks';
import SendAmount from './components/SendAmount';
import ImportWallet from './components/ImportWallet';
import { formatPublicKey } from '@/utils/util';
import { DeleteIcon } from '@chakra-ui/icons';
import { useRequest } from 'ahooks';
import { getChains, postGasInfo, transfer } from '@/http/api/api';
import Web3 from 'web3';
import AddToken from './components/AddToken';

const MoreToOne = () => {
  const { globalStore } = globalStores();

  const [web3, setWeb3] = useState<any>(new Web3());
  const [chains, setChains] = useState<any>();
  const [node, setNode] = useState<string>('');
  const [receiveAddress, setReceiveAddress] = useState<string>('');
  const [symbol, setSymbol] = useState<string>('');
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [tokens, setTokens] = useState<any[]>([]);

  const [selectedAccount, setSelectedAccount] = useState<any[]>([]);

  const [isToken, setIsToken] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const { run, data: gasData } = useRequest((params) => postGasInfo(params), {
    manual: true,
  });
  const {
    run: getChainsRun,
    data: chainsData,
    mutate: chainsMutate,
  } = useRequest((params) => getChains(params), {
    manual: true,
    onSuccess(res) {
      if (res) {
        chainsMutate(() => res[0]);
        setNode(res[0]?.rpc[0]);
      }
    },
  });

  useEffect(() => {
    if (node) {
      setWeb3(new Web3(node));
    }
  }, [node]);

  // const { run: transferRun } = useRequest((params) => transfer(params), { manual: true });

  useEffect(() => {
    if (chains && chains?.rpcs) {
      setNode(chains.rpcs[0]);
      run({ chain_id: chains.chain_id });
      getChainsRun({ chainId: chains.chain_id });
    }
    if (chains && chains?.natives_symbol) {
      setSymbol(chains.natives_symbol?.toUpperCase());
    }
    if (chains && chains?.tokens.length > 0) {
      setTokens(chains.tokens);
    }
  }, [chains]);

  useEffect(() => {
    if (chains?.natives_symbol?.toUpperCase() !== symbol) {
      setIsToken(true);
    } else {
      setIsToken(false);
    }
  }, [symbol]);

  const disabledBtn = useMemo(() => {
    if (!receiveAddress || !node || selectedAccount.length === 0) return true;

    return false;
  }, [receiveAddress, node, selectedAccount.length]);

  const sendTransaction = async (sender: string, amount: string, privateKey: `0x${string}`) => {
    // 获取发送方的 nonce 值
    const nonce = await web3.eth.getTransactionCount(sender, 'latest');

    // 构造交易对象
    const tx = {
      from: sender,
      to: receiveAddress,
      value: web3.utils.toWei('0.00001', 'ether'), // 发送 0.01
      gas: 21000, // 固定的转账 Gas 限制
      nonce: nonce,
      gasPrice: await web3.eth.getGasPrice(), // 当前网络 Gas 价格
    };

    // 使用私钥对交易进行签名
    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);

    // 发送签名后的交易
    web3.eth
      .sendSignedTransaction(signedTx.rawTransaction)
      .on('receipt', (receipt) => {
        console.log('receipt', receipt);
      }) // 交易成功后打印回执
      .on('error', (error) => console.error(error)); // 发生错误时打印错误
  };

  const startTransfer = async () => {
    if (selectedAccount.length === 0) return;
    setLoading(true);
    await selectedAccount.map((account) => {
      sendTransaction(account.address, account.amount, account.privateKey);
    });
    setLoading(false);
  };

  const chooseZeroAccount = () => {
    setSelectedAccount(dataSource.filter((item) => parseFloat(item.balance) === 0));
  };
  const chooseNoZeroAccount = () => {
    setSelectedAccount(dataSource.filter((item) => parseFloat(item.balance) > 0));
  };

  const ReversalSelect = () => {
    setSelectedAccount(dataSource.filter((item) => selectedAccount.findIndex((account) => account.address === item.address) === -1));
  };

  const deleteAccount = (item, index) => {
    setDataSource(dataSource.filter((item, idx) => idx !== index));
    if (selectedAccount.findIndex((account) => account.address === item.address) !== -1) {
      setSelectedAccount(selectedAccount.filter((account) => account.address !== item.address));
    }
  };

  return (
    <Box>
      <Heading as="h1" mt="5" fontSize="2xl" textAlign="center">
        批量归集
      </Heading>
      <Card maxW="6xl" colorScheme="blackAlpha" mx="auto" mt="5">
        <CardBody>
          <Wrap>
            <ImportWallet node={node} dataSource={dataSource} setDataSource={setDataSource} />
            <Button fontSize="xs" h="7" onClick={chooseZeroAccount}>
              余额为0
            </Button>
            <Button fontSize="xs" h="7" onClick={chooseNoZeroAccount}>
              余额大于0
            </Button>
            <Button fontSize="xs" h="7" onClick={ReversalSelect}>
              反选
            </Button>
            <Button fontSize="xs" h="7" onClick={() => setSelectedAccount([])}>
              删除选中
            </Button>
          </Wrap>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>
                    <Checkbox
                      isChecked={selectedAccount.length > 0 && selectedAccount.length === dataSource.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedAccount([...dataSource]);
                        } else {
                          setSelectedAccount([]);
                        }
                      }}
                    />
                  </Th>
                  <Th>序号</Th>
                  <Th>钱包地址</Th>
                  <Th>原生代币</Th>
                  <Th>余额</Th>
                  <Th>状态</Th>
                  <Th>操作</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dataSource.length > 0 &&
                  dataSource.map((item, index) => (
                    <Tr key={index}>
                      <Td>
                        <Checkbox
                          isChecked={selectedAccount.findIndex((account) => account.address === item.address) !== -1}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedAccount([...selectedAccount, item]);
                            } else {
                              setSelectedAccount(selectedAccount.filter((account) => account.address !== item.address));
                            }
                          }}
                        />
                      </Td>
                      <Td>{index + 1}</Td>
                      <Td>{formatPublicKey(item.address)}</Td>
                      <Td>-</Td>
                      <Td>{parseFloat(item.balance) === 0 ? 0 : item.balance}</Td>
                      <Td>未执行</Td>
                      <Td>
                        <IconButton
                          color="error"
                          size="xs"
                          icon={<DeleteIcon />}
                          aria-label={'Delete'}
                          variant="ghost"
                          onClick={() => {
                            deleteAccount(item, index);
                          }}
                        />
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
            {dataSource.length === 0 && (
              <Flex alignItems="center" justifyContent="center" w="full" h="200px">
                请导入钱包
              </Flex>
            )}
          </TableContainer>

          <Grid mt="5" gap={7} templateColumns="repeat(6, 1fr)">
            <GridItem colSpan={2}>
              <Flex alignItems="center" justifyContent="space-between">
                <Text>选择链</Text>
                <AddChain />
              </Flex>
              <ChainLinks chains={chains} setChains={setChains} />
              <Flex mt="4" alignItems="center" justifyContent="space-between">
                <Text>选择代币</Text>
                <Wrap>
                  {isToken && (
                    <Button
                      border="1px solid"
                      borderColor="error"
                      color="error"
                      bg="transparent"
                      fontSize="xs"
                      h="6"
                      onClick={() => {
                        const _chains = { ...chains };
                        if (_chains.tokens.indexOf(symbol) !== -1) {
                          _chains.tokens = _chains.tokens.splice(_chains.tokens.indexOf(symbol), 1);
                        }
                        setChains(_chains);
                        setSymbol(chains.natives_symbol?.toUpperCase());
                        globalStore.deleteToken({
                          chains,
                          symbol,
                        });
                      }}
                    >
                      删除代币
                    </Button>
                  )}
                  <AddToken chains={chains} setChains={setChains} />
                  <Button bg="primary" fontSize="xs" h="6">
                    查询余额
                  </Button>
                </Wrap>
              </Flex>
              <Select mt="4" h="10" fontSize="sm" borderColor="gray" _hover={{ borderColor: 'primary' }} borderRadius="md" defaultValue={symbol} onChange={(e) => setSymbol(e.target.value)}>
                <option value={symbol}>{symbol}</option>
                {tokens.map((token, index) => (
                  <option key={index} value={token.address?.toUpperCase()}>
                    {token.symbol}
                  </option>
                ))}
              </Select>
            </GridItem>
            <GridItem colSpan={4}>
              <Flex alignItems="center" justifyContent="space-between">
                <Text>节点</Text>
                <Button fontSize="xs" h="6">
                  更多可用节点
                </Button>
              </Flex>
              <Input mt="4" h="10" p="2" fontSize="sm" border="1px solid" borderColor="gray" focusBorderColor="primary" borderRadius="md" value={node} onChange={(e) => setNode(e.target.value)} />
              <Flex mt="4" alignItems="center" justifyContent="space-between">
                <Text>接收地址</Text>
                <Button fontSize="xs" h="6">
                  转给自己
                </Button>
              </Flex>
              <Input
                mt="4"
                h="10"
                p="2"
                fontSize="sm"
                border="1px solid"
                borderColor="gray"
                focusBorderColor="primary"
                borderRadius="md"
                value={receiveAddress}
                placeholder="0x"
                onChange={(e) => setReceiveAddress(e.target.value)}
              />
            </GridItem>
          </Grid>

          <SendAmount />

          <Wrap mt="4" spacing="4">
            <Box>
              <Text>Gas Price</Text>
              <Tabs mt="4" borderRadius="md" size="sm">
                <TabList borderRadius="md" borderColor="gray" bg="gray">
                  <Tab borderRadius="md" _selected={{ bg: 'primary' }}>
                    自动
                  </Tab>
                  <Tab borderRadius="md" _selected={{ bg: 'primary' }}>
                    固定
                  </Tab>
                </TabList>
              </Tabs>
            </Box>
            <Box>
              <Text>浮动Gas</Text>
              <Flex alignItems="center" mt="4" h="30px">
                <Switch size="lg" colorScheme="green" />
              </Flex>
            </Box>

            <Box>
              <Text>Gas Limit</Text>
              <Tabs mt="4" borderRadius="md" size="sm">
                <TabList borderRadius="md" borderColor="gray" bg="gray">
                  <Tab borderRadius="md" _selected={{ bg: 'primary' }}>
                    自动
                  </Tab>
                  <Tab borderRadius="md" _selected={{ bg: 'primary' }}>
                    固定
                  </Tab>
                </TabList>
              </Tabs>
            </Box>
          </Wrap>
          <Flex mt="8" w="full" justifyContent="space-between" alignItems="center">
            <Wrap>
              <Text fontSize="xs">查看日志</Text>
            </Wrap>
            <Button w="160px" isLoading={loading} isDisabled={disabledBtn} onClick={startTransfer}>
              Start
            </Button>
          </Flex>
          <Wrap mt={4} align="center" fontSize="xs" justify="end">
            <Text>GasPrice:</Text>
            <Text fontWeight="bold">{gasData?.gas_limit || 21000} Gwei</Text>
          </Wrap>
        </CardBody>
      </Card>
    </Box>
  );
};

export default MoreToOne;
