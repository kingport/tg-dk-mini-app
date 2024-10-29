import SvgIcon from '@/components/SvgIcon';
import Table, { Columns } from '@/components/Table';
import { formatPublicKey } from '@/utils/util';
import { CopyIcon, StarIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Wrap, WrapItem, Image, Text } from '@chakra-ui/react';

const Hot = () => {
  const data = [
    { id: 1, name: 'Alice', age: 30, publicKey: 'LGAkVHndg1jHSNTwxKjc6a6ihwLFdVKgw2jVnDFmeKu', img: 'https://s2.coinmarketcap.com/static/img/coins/64x64/32717.png' },
    { id: 2, name: 'Bob', age: 25, publicKey: 'LGAkVHndg1jHSNTwxKjc6a6ihwLFdVKgw2jVnDFmeKu', img: 'https://s2.coinmarketcap.com/static/img/coins/64x64/32717.png' },
    { id: 3, name: 'Charlie', age: 35, publicKey: 'LGAkVHndg1jHSNTwxKjc6a6ihwLFdVKgw2jVnDFmeKu', img: 'https://s2.coinmarketcap.com/static/img/coins/64x64/32717.png' },
  ];

  const columns: Columns[] = [
    {
      label: '币种',
      dataIndex: 'id',
      order: true,
      filter: true,
      width: 300,
      render(text, record) {
        return (
          <Wrap align="center" spacing="3">
            <StarIcon w="4" h="4" color="grey" />
            <Wrap align="center" spacing="2">
              <Image src={record?.img} boxSize="32px" borderRadius="full" />
              <Box>
                <Wrap align="center" spacing="1">
                  <Text color="white" fontSize="sm" fontWeight={500}>
                    {record?.name}
                  </Text>
                  <SvgIcon name="copy" style={{ width: '12px', height: '12px' }} />
                  <Image src={record?.img} boxSize="12px" borderRadius="full" />
                </Wrap>
                <Wrap align="center" spacing="1">
                  <Text fontSize={'xs'} color="secondary">
                    {formatPublicKey(record?.publicKey)}
                  </Text>
                  <SvgIcon name="x" style={{ width: '12px', height: '12px' }} />
                  <SvgIcon name="website" style={{ width: '12px', height: '12px' }} />
                  <SvgIcon name="telegram" style={{ width: '12px', height: '12px' }} />
                </Wrap>
              </Box>
            </Wrap>
          </Wrap>
        );
      },
    },
    { label: '时间', dataIndex: 'id', order: true, filter: true },

    { label: '池子/市值', dataIndex: 'id', order: true, filter: true },
    { label: '持有者', dataIndex: 'name' },
    { label: '1m交易数', dataIndex: 'age' },
    { label: '1m成交额', dataIndex: 'age' },
    { label: '价格', dataIndex: 'age' },
    { label: '1m%', dataIndex: 'age' },
    { label: '5m%', dataIndex: 'age' },
    { label: '1h%', dataIndex: 'age' },
    { label: '安全检测', dataIndex: 'age' },
    { label: '买/卖税', dataIndex: 'age' },
    { label: 'DEV', dataIndex: 'age' },
    {
      label: '',
      dataIndex: 'options',
      valueType: 'options',
      render(text, record, index) {
        return <Button>Swap</Button>;
      },
      width: 100,
    },
  ];
  return (
    <Box p={4}>
      <Flex gap={3} alignItems={'center'}>
        <Flex alignItems={'center'} gap={1} fontWeight={900}>
          热门
        </Flex>
        <Wrap spacing="1px" border="1px solid rgb(38, 40, 44)" borderRadius={'4px'}>
          <WrapItem fontSize={'xs'} py="1" bg="#000" px="2" borderLeftRadius={'4px'} cursor={'pointer'}>
            1m
          </WrapItem>
          <WrapItem fontSize={'xs'} py="1" px="2" bg="rgb(38, 40, 44)" cursor={'pointer'}>
            5m
          </WrapItem>
          <WrapItem fontSize={'xs'} p="1" px="2" bg="rgb(38, 40, 44)" cursor={'pointer'}>
            1h
          </WrapItem>
          <WrapItem fontSize={'xs'} p="1" px="2" bg="rgb(38, 40, 44)" cursor={'pointer'}>
            6h
          </WrapItem>
          <WrapItem fontSize={'xs'} p="1" px="2" bg="rgb(38, 40, 44)" cursor={'pointer'}>
            24h
          </WrapItem>
        </Wrap>
      </Flex>
      <Box py={4}>
        {/* <TableContainer>
          <Table variant="simple">
            <TableCaption>Imperial to metric conversion factors</TableCaption>
            <Thead>
              <Tr>
                <Th>
                  <Wrap>
                    币种 <SvgIcon name="filter" style={{ width: '16px', height: '16px' }} />
                  </Wrap>
                </Th>
                <Th>
                  <Wrap>
                    时间 <SvgIcon name="filter" style={{ width: '16px', height: '16px' }} />
                  </Wrap>
                </Th>
                <Th>
                  <Wrap>
                    池子/市值 <SvgIcon name="filter" style={{ width: '16px', height: '16px' }} />
                  </Wrap>
                </Th>
                <Th>
                  <Wrap>
                    持有者 <SvgIcon name="filter" style={{ width: '16px', height: '16px' }} />
                  </Wrap>
                </Th>
                <Th>
                  <Wrap>
                    1h交易数 <SvgIcon name="filter" style={{ width: '16px', height: '16px' }} />
                  </Wrap>
                </Th>
                <Th>
                  <Wrap>
                    成交额 <SvgIcon name="filter" style={{ width: '16px', height: '16px' }} />
                  </Wrap>
                </Th>
                <Th>
                  <Wrap>
                    价格 <SvgIcon name="filter" style={{ width: '16px', height: '16px' }} />
                  </Wrap>
                </Th>
                <Th>
                  <Wrap>
                    1m% <SvgIcon name="filter" style={{ width: '16px', height: '16px' }} />
                  </Wrap>
                </Th>
                <Th>
                  <Wrap>
                    5m% <SvgIcon name="filter" style={{ width: '16px', height: '16px' }} />
                  </Wrap>
                </Th>
                <Th>
                  <Wrap>
                    1h% <SvgIcon name="filter" style={{ width: '16px', height: '16px' }} />
                  </Wrap>
                </Th>
                <Th>
                  <Wrap>
                    安全检测 <SvgIcon name="filter" style={{ width: '16px', height: '16px' }} />
                  </Wrap>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>inches</Td>
                <Td>millimetres (mm)</Td>
                <Td>25.4</Td>
                <Td>25.4</Td>
                <Td>25.4</Td>
                <Td>25.4</Td>
                <Td>25.4</Td>
                <Td>25.4</Td>
                <Td>25.4</Td>
                <Td>25.4</Td>
                <Td>25.4</Td>
              </Tr>
              <Tr>
                <Td>inches</Td>
                <Td>millimetres (mm)</Td>
                <Td>25.4</Td>
                <Td>25.4</Td>
                <Td>25.4</Td>
                <Td>25.4</Td>
                <Td>25.4</Td>
                <Td>25.4</Td>
                <Td>25.4</Td>
                <Td>25.4</Td>
                <Td>25.4</Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer> */}
        <Table data={data} columns={columns} />
      </Box>
    </Box>
  );
};

export default Hot;
