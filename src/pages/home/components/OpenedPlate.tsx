import SvgIcon from '@/components/SvgIcon';
import {
  Flex,
  Box,
  Text,
  Wrap,
  Popover,
  PopoverTrigger,
  Portal,
  PopoverContent,
  PopoverHeader,
  Button,
  PopoverBody,
  PopoverFooter,
  Stack,
  Checkbox,
  Input,
  InputGroup,
  InputRightElement,
  PopoverCloseButton,
} from '@chakra-ui/react';
import PlateItem from './PlateItem';

const OpenedPlate = () => {
  return (
    <Box bg="#17181B" borderRadius={8} display="flex" flexDirection="column" overflow="hidden">
      <Flex alignItems="center" justifyContent="space-between" px="16px" py="10px" borderBottom="1px solid #26282C">
        <Text fontSize={14} color="white">
          🐣 已开盘
        </Text>
        <Popover>
          <PopoverTrigger>
            <Button size="xs" variant="ghost">
              <Wrap spacing="4px" align="center" cursor="pointer">
                <SvgIcon name="filter" style={{ width: '14px', height: '14px' }} />
                <Text fontSize={14} color="whiteAlpha.600">
                  筛选
                </Text>
              </Wrap>
            </Button>
          </PopoverTrigger>
          <Portal>
            <PopoverContent bg="#26282C" border="0" borderRadius="14px" py="3">
              {/* <PopoverArrow /> */}
              {/* <PopoverHeader>Header</PopoverHeader> */}
              {/* <PopoverCloseButton /> */}
              <PopoverBody>
                <Stack spacing={[1, 2]} direction={['column', 'column']}>
                  <Checkbox colorScheme="green">至少有一个社交媒体</Checkbox>
                  <Checkbox colorScheme="green">前10持仓大户</Checkbox>
                  <Checkbox colorScheme="green">DEV 未清仓</Checkbox>
                  <Checkbox colorScheme="green">DEV 清仓</Checkbox>
                  <Checkbox colorScheme="green">DEV 烧币</Checkbox>
                </Stack>
                <Box mt="4" borderTop="1px" borderStyle="solid" borderColor="#3A3C42">
                  <Box mt="4">
                    <Text fontSize="sm" color="#9BA0A9">
                      进度
                    </Text>
                    <Flex mt="2" alignItems="center">
                      <InputGroup size="md">
                        <Input type="number" borderRadius="8px" />
                        <InputRightElement color="#9BA0A9">%</InputRightElement>
                      </InputGroup>
                      <Text px="2" color="#F5F5F5">
                        to
                      </Text>
                      <InputGroup size="md">
                        <Input type="number" borderRadius="8px" />
                        <InputRightElement color="#9BA0A9">%</InputRightElement>
                      </InputGroup>
                    </Flex>
                  </Box>
                  <Box mt="4">
                    <Text fontSize="sm" color="#9BA0A9">
                      市值
                    </Text>
                    <Flex mt="2" alignItems="center">
                      <InputGroup size="md">
                        <Input type="number" borderRadius="8px" />
                        <InputRightElement color="#9BA0A9">K</InputRightElement>
                      </InputGroup>
                      <Text px="2" color="#F5F5F5">
                        to
                      </Text>
                      <InputGroup size="md">
                        <Input type="number" borderRadius="8px" />
                        <InputRightElement color="#9BA0A9">K</InputRightElement>
                      </InputGroup>
                    </Flex>
                  </Box>
                  <Box mt="4">
                    <Text fontSize="sm" color="#9BA0A9">
                      1h 交易数
                    </Text>
                    <Flex mt="2" alignItems="center">
                      <Input type="number" borderRadius="8px" />

                      <Text px="2" color="#F5F5F5">
                        to
                      </Text>
                      <Input type="number" borderRadius="8px" />
                    </Flex>
                  </Box>
                  <Box mt="4">
                    <Text fontSize="sm" color="#9BA0A9">
                      持有人数
                    </Text>
                    <Flex mt="2" alignItems="center">
                      <Input type="number" borderRadius="8px" />
                      <Text px="2" color="#F5F5F5">
                        to
                      </Text>
                      <Input type="number" borderRadius="8px" />
                    </Flex>
                  </Box>
                  <Box mt="4">
                    <Text fontSize="sm" color="#9BA0A9">
                      评论数
                    </Text>
                    <Flex mt="2" alignItems="center">
                      <Input type="number" borderRadius="8px" />
                      <Text px="2" color="#F5F5F5">
                        to
                      </Text>
                      <Input type="number" borderRadius="8px" />
                    </Flex>
                  </Box>
                  <Box mt="4">
                    <Text fontSize="sm" color="#9BA0A9">
                      时间
                    </Text>
                    <Flex mt="2" alignItems="center">
                      <InputGroup size="md">
                        <Input type="number" borderRadius="8px" />
                        <InputRightElement color="#9BA0A9">min</InputRightElement>
                      </InputGroup>
                      <Text px="2" color="#F5F5F5">
                        to
                      </Text>
                      <InputGroup size="md">
                        <Input type="number" borderRadius="8px" />
                        <InputRightElement color="#9BA0A9">min</InputRightElement>
                      </InputGroup>
                    </Flex>
                  </Box>
                </Box>
              </PopoverBody>
              <PopoverFooter border="0">
                <Flex alignItems="center">
                  <Button flex="1">重置</Button>
                  <Button flex="1" ml="3" bg="#F5F5F5" color="#3F3F3F">
                    应用
                  </Button>
                </Flex>
              </PopoverFooter>
            </PopoverContent>
          </Portal>
        </Popover>
      </Flex>
      <Box flex="1" overflowY="hidden">
        <Box h="full" overflow="scroll">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((item, index) => (
            <PlateItem key={item} index={index} data={item} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default OpenedPlate;
