import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Tab, TabList, TabPanel, TabPanels, Tabs, Textarea, useDisclosure, Text, Flex } from '@chakra-ui/react';
import Web3 from 'web3';

type PropsTypes = {
  dataSource: any[];
  node: string;
  setDataSource: Function;
};

const ImportWallet = (props: PropsTypes) => {
  const { node, dataSource, setDataSource } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [value, setValue] = useState('');

  // f15ec418389b574bff6b0cd547fbf0d6d976033eb0a1cb408909e1950f49c35b
  //  7fd7986bf9604b52e88e1f711d037c3f964d68026575dcf011129a7d92d68b28
  // cbf0c8be0f7d3a5fab7d33da5a5be8c421644227f1a29ea4b6de5759d1642b19
  const importAddress = async () => {
    const privateKeys = value.split('\n');
    const web3 = new Web3(node);

    const accounts: any[] = privateKeys.map((privateKey) => {
      if (privateKey) {
        const account = web3.eth.accounts.privateKeyToAccount(`0x${privateKey}`);

        return account;
      }
      return {};
    });

    for (let i = 0; i < accounts.length; i++) {
      const balance = await web3.eth.getBalance(accounts[i].address);
      console.log('accounts[i].address', balance);

      accounts[i].balance = web3.utils.fromWei(balance, 'ether');
    }

    setDataSource([...dataSource, ...accounts]);
    onClose();
  };

  return (
    <>
      <Button bg="primary" fontSize="xs" h="7" onClick={onOpen}>
        导入钱包
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered autoFocus={false} scrollBehavior="inside" size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">导入私钥</ModalHeader>
          <ModalCloseButton />
          <ModalBody mb={0}>
            <Tabs align="end" variant="enclosed">
              <TabList>
                <Tab>手工输入</Tab>
                <Tab>钱包管理导入</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Text mb="4" textAlign="left">
                    格式：一行一个
                  </Text>
                  <Textarea fontSize="xs" h="400px" value={value} onChange={(e) => setValue(e.target.value)}></Textarea>
                  <Flex mt="8" alignItems="center">
                    <Button flex="1" fontSize="xs" mr="4" onClick={onClose}>
                      取消
                    </Button>
                    <Button flex="1" bg="primary" fontSize="xs" onClick={importAddress}>
                      导入
                    </Button>
                  </Flex>
                </TabPanel>
                <TabPanel>
                  <p>two!</p>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ImportWallet;
