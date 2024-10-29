import SvgIcon from '@/components/SvgIcon';
import { Flex, Wrap, Box, Text, Image, Button } from '@chakra-ui/react';

const PlateItem = (props: { data: any; index: number }) => {
  const { data, index } = props;
  return (
    <Flex alignItems="center" p="16px" borderTop={index !== 0 ? '1px solid #26282C' : ''} cursor="pointer">
      <Box position="relative" mr="2">
        {/* <CircularProgress value={59} size="60px" thickness="3px" color="#99D499" trackColor="#4B634D" /> */}
        <Flex alignItems="center" justifyContent="center" p="2px" w="60px" h="60px" borderRadius="full" bg="#4B634D">
          <Image width="54px" height="54px" borderRadius="full" src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRQRYsWDNONmQNyD8bXEd9oaD_2nzUFFSO5oxDfyTD3WDCSclbR" />
        </Flex>
      </Box>
      <Box w="full">
        <Flex alignItems="center" justifyContent="space-between">
          <Wrap align="center" spacing="4px">
            <Text fontSize="sm" color="white" fontWeight="bold">
              GQQF
            </Text>
            <SvgIcon name="copy" style={{ width: '14px', height: '14px' }} />
          </Wrap>
          <Button size="xs" variant="ghost">
            <Wrap align="center" spacing="4px">
              <SvgIcon name="btn-telegram" style={{ width: '12px', height: '12px' }} />
              <Text fontSize="xs" color="white">
                买入
              </Text>
            </Wrap>
          </Button>
        </Flex>
        <Wrap align="center" spacing="14px" color="#AFDFB6">
          <Text fontSize="xs">8s</Text>
          <Wrap align="center" spacing="4px">
            <Wrap align="center" spacing="1px" color="#AFDFB6">
              <SvgIcon name="top-user" style={{ width: '14px', height: '14px' }} />
              <Text fontSize="xs">10%</Text>
            </Wrap>
            <Wrap align="center" spacing="1px" color="#AFDFB6">
              <SvgIcon name="dev-user" style={{ width: '14px', height: '14px' }} />
              <Text fontSize="xs">10%</Text>
            </Wrap>
          </Wrap>
        </Wrap>
        <Flex alignItems="center" justifyContent="space-between">
          <Wrap align="center" spacing="2px">
            <Text fontSize="xs" color="#AFDFB6">
              0%
            </Text>
            <SvgIcon name="capsule" style={{ width: '12px', height: '12px' }} />
            <SvgIcon name="x" style={{ width: '12px', height: '12px' }} />
            <SvgIcon name="website" style={{ width: '12px', height: '12px' }} />
            <SvgIcon name="telegram" style={{ width: '12px', height: '12px' }} />
          </Wrap>
          <Wrap align="center" spacing="8px">
            <Wrap align="center" spacing="2px" fontSize="12px">
              <Text color="#9AA0AA">MC:</Text>
              <Text color="white" fontWeight={500}>
                $4.3k
              </Text>
            </Wrap>
            <Wrap align="center" spacing="2px" fontSize="12px">
              <SvgIcon name="users" style={{ width: '12px', height: '12px' }} />
              <Text color="white" fontWeight={500}>
                12
              </Text>
            </Wrap>
            <Wrap align="center" spacing="2px" fontSize="12px">
              <SvgIcon name="comment" style={{ width: '12px', height: '12px' }} />
              <Text color="white" fontWeight={500}>
                12
              </Text>
            </Wrap>
            <Wrap align="center" spacing="2px" fontSize="12px">
              <Text color="#9AA0AA">1h TXs:</Text>
              <Text color="white" fontWeight={500}>
                12
              </Text>
            </Wrap>
            <Wrap align="center" spacing="2px" fontSize="12px">
              <Text color="#9AA0AA">1h V:</Text>
              <Text color="#585B62">$12</Text>
            </Wrap>
          </Wrap>
        </Flex>
      </Box>
    </Flex>
  );
};

export default PlateItem;
