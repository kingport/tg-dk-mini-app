import { Flex, TabList, Tab, Tabs, Box, Text, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Input } from '@chakra-ui/react';

const SendAmount = () => {
  const tabs = [
    {
      label: '全部数量',
      value: 'all',
    },
    {
      label: '百分比数量',
      value: 'percentage',
    },
    {
      label: '随机数量',
      value: 'random',
    },
    {
      label: '固定数量',
      value: 'fixed',
    },
  ];
  const [tab, setTab] = useState('all');
  const [percentage, setPercentage] = useState(0);
  const [randomStart, setRandomStart] = useState(0);
  const [randomEnd, setRandomEnd] = useState(0);
  const [decimal, setDecimal] = useState(3);
  const [fixedAmount, setFixedAmount] = useState(0);

  const calculateRandom = useMemo(() => {
    const random = Math.random() * (randomEnd - randomStart) + randomStart;
    return random.toFixed(decimal);
  }, [randomStart, randomEnd, decimal]);

  return (
    <Flex mt="4">
      <Box>
        <Text>发送数量</Text>
        <Tabs mt="4" borderRadius="md" size="sm">
          <TabList borderRadius="md" borderColor="gray" bg="gray">
            {tabs.map((item) => (
              <Tab key={item.value} borderRadius="md" _selected={{ bg: 'primary' }} onClick={() => setTab(item.value)}>
                {item.label}
              </Tab>
            ))}
          </TabList>
        </Tabs>
      </Box>
      {tab === 'percentage' && (
        <Box ml="4">
          <Text>百分比数量</Text>

          <Flex mt="4" h="30px" alignItems="center">
            <Slider w="160px" colorScheme="green" value={percentage} onChange={(prog) => setPercentage(prog)}>
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
            <Text ml="3">{percentage}%</Text>
          </Flex>
        </Box>
      )}
      {tab === 'random' && (
        <Flex ml="4">
          <Box>
            <Text>随机数量</Text>
            <Flex mt="4" h="30px" alignItems="center" border="1px solid gray" borderRadius="md" px="2" py="2" fontSize="sm">
              <Input
                type="number"
                variant="unstyled"
                value={randomStart}
                w="80px"
                fontSize="sm"
                onChange={(e) => {
                  setRandomStart(Number(e.target.value));
                }}
              />
              <Text color="gray" mr="2">
                到
              </Text>
              <Input
                type="number"
                variant="unstyled"
                value={randomEnd}
                w="80px"
                fontSize="sm"
                onChange={(e) => {
                  setRandomEnd(Number(e.target.value));
                }}
              />
            </Flex>
          </Box>
          <Box ml="3">
            <Text>小数点位数</Text>
            <Input
              type="number"
              border="1px solid gray"
              borderRadius="md"
              px="2"
              mt="4"
              h="30px"
              variant="unstyled"
              value={decimal}
              w="80px"
              fontSize="sm"
              onChange={(e) => {
                setDecimal(Number(e.target.value));
              }}
            />
          </Box>
        </Flex>
      )}
      {tab === 'fixed' && (
        <Box ml="4">
          <Box>
            <Text>固定数量</Text>
            <Input
              mt="4"
              h="30px"
              px="2"
              border="1px solid gray"
              borderRadius="md"
              type="number"
              variant="unstyled"
              value={fixedAmount}
              w="80px"
              fontSize="sm"
              onChange={(e) => {
                setFixedAmount(Number(e.target.value));
              }}
            />
          </Box>
        </Box>
      )}
    </Flex>
  );
};
export default SendAmount;
