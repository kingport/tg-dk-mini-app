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
  useDisclosure,
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';

const AddChain = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  function validateName(value) {
    let error;
    if (!value) {
      error = 'Name is required';
    }
    return error;
  }
  function validateRpc(value) {
    let error;
    if (!value) {
      error = 'RPC is required';
    }
    return error;
  }
  function validateSymbol(value) {
    let error;
    if (!value) {
      error = 'Symbol is required';
    }
    return error;
  }
  return (
    <>
      <Button fontSize="xs" h="6" onClick={onOpen}>
        添加自定义链
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>添加自定义区块链</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Formik
              initialValues={{ name: '', rpc: '', symbol: '' }}
              onSubmit={(values, actions) => {
                setTimeout(() => {
                  alert(JSON.stringify(values, null, 2));
                  actions.setSubmitting(false);
                }, 1000);
              }}
            >
              {(props) => (
                <Form>
                  <Field name="name" validate={validateName}>
                    {({ field, form }) => (
                      <FormControl isInvalid={form.errors.name && form.touched.name}>
                        <FormLabel>区块链名称</FormLabel>
                        <Input {...field} placeholder="区块链名称" />
                        <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Box mt="5">
                    <Field name="rpc" validate={validateRpc}>
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.name && form.touched.name}>
                          <FormLabel>RPC节点</FormLabel>
                          <Input {...field} placeholder="RPC节点" />
                          <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                  </Box>
                  <Box mt="5">
                    <Field name="symbol" validate={validateSymbol}>
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.name && form.touched.name}>
                          <FormLabel>原生代币标识</FormLabel>
                          <Input {...field} placeholder="Symbol" />
                          <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                  </Box>
                </Form>
              )}
            </Formik>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              取消
            </Button>
            <Button bg="primary" type="submit">
              确认
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddChain;
