import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Wrap,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import Web3 from 'web3';
import tokenABI from '@/utils/token-abi.json';
import { formatPublicKey } from '@/utils/util';

type PropsTypes = {
  chains: any;
  setChains: Function;
};
const AddToken = (props: PropsTypes) => {
  const { setChains, chains } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { globalStore } = globalStores();
  const toast = useToast();

  function validateName(value) {
    let error;
    if (!value) {
      error = 'Token is required';
    }
    if (!value.startsWith('0x')) {
      error = 'Token must start with 0x';
    }
    return error;
  }

  return (
    <>
      <Button fontSize="xs" h="6" onClick={onOpen}>
        添加代币
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>添加代币</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Formik
              initialValues={{ token: '' }}
              onSubmit={async (values, actions) => {
                if (values.token) {
                  try {
                    const web3 = new Web3();
                    // const web3 = new Web3('https://bsc.publicnode.com');
                    const code = await web3.eth.getCode(values.token);

                    if (code.startsWith('0x')) {
                      const _chains = { ...chains };
                      _chains.tokens.push({
                        icon: '',
                        name: `UNKNOWN - ${formatPublicKey(values.token)}`,
                        symbol: `UNKNOWN - ${formatPublicKey(values.token)}`,
                        decimals: 18,
                        address: values.token,
                        chain_id: '',
                      });
                      setChains(_chains);
                      globalStore.addToken({
                        tokens: {
                          icon: '',
                          name: `UNKNOWN - ${formatPublicKey(values.token)}`,
                          symbol: `UNKNOWN - ${formatPublicKey(values.token)}`,
                          decimals: 18,
                          address: values.token,
                          chain_id: '',
                        },
                        chains,
                      });
                      toast({
                        status: 'success',
                        description: '添加代币成功',
                      });
                      onClose();
                    } else {
                      toast({
                        status: 'error',
                        description: '添加代币失败，请确保代币合约地址正确',
                      });
                    }
                  } catch (error) {
                    console.log('error', error);
                  }

                  onClose();
                }
              }}
            >
              {(props) => (
                <Form>
                  <Field name="token" validate={validateName}>
                    {({ field, form }) => (
                      <FormControl isInvalid={form.errors.token && form.touched.token}>
                        {/* <FormLabel>代币名称</FormLabel> */}
                        <Input {...field} placeholder="请输入代币或代币名称" />
                        <FormErrorMessage>{form.errors.token}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Wrap mt="8" justify="end">
                    <Button mr={3} onClick={onClose}>
                      取消
                    </Button>
                    <Button bg="primary" type="submit">
                      确认
                    </Button>
                  </Wrap>
                </Form>
              )}
            </Formik>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddToken;
