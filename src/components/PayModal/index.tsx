import { localRemove, numberFormat } from '@/utils/util';
import { Modal, ModalBody, ModalContent, useDisclosure, Text, Box, Center, PinInputField, PinInput, Spinner, Stack, ModalOverlay } from '@chakra-ui/react';
import { useBoolean } from 'ahooks';
import { Mask, PasscodeInput } from 'antd-mobile';
import md5 from 'md5';
import { useTranslation } from 'react-i18next';

export interface PayModalTypes {
  open: () => void;
  close: () => void;
  error: () => void;
}

export interface PropsTypes {
  setLoading?: (text: string) => void;
  amount: number | string;
  currency?: string;
  callback: ({ pay_password }: { pay_password: string }) => void;
  loading?: boolean;
}

const PayModal = (props: PropsTypes, ref: any) => {
  const { setLoading, callback, amount, currency = 'BNB', loading = false } = props;
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const inputRef = useRef<any>();
  const [isError, { setTrue, setFalse }] = useBoolean(false);
  const [pwd, setPwd] = useState('');
  useImperativeHandle(ref, () => ({
    open: onOpen,
    close: onClose,
    error: setTrue,
  }));

  const handleClose = () => {
    onClose();
    // setLoading('');
    setPwd('');
    setFalse();
  };

  useEffect(() => {
    if (isError) {
      setPwd('');
    }
  }, [isError]);

  useEffect(() => {
    if (isOpen) {
      setFalse();
      setPwd('');
      inputRef.current?.focus();
    }
  }, [isOpen]);

  return (
    // <Modal closeOnOverlayClick={true} isOpen={isOpen} onClose={handleClose} isCentered autoFocus={false}>
    //   <ModalOverlay />
    //   <ModalContent>
    //     {loading && (
    //       <Center position="absolute" top="0" left="0" width="100%" height="100%" bg="blackAlpha.500">
    //         <Spinner color="primary" />
    //       </Center>
    //     )}
    //     <ModalBody>
    //       <Stack color="base">
    //         <Text mb="16px" fontSize="16px" lineHeight="20px" fontWeight="bold" textAlign="center">
    //           {t('Please Enter Transaction Password')}
    //         </Text>
    //         <Text fontSize={'xx-large'} textAlign={'center'} color="primary" fontWeight={600}>
    //           {numberFormat(amount)} {currency}
    //         </Text>
    //         <Center pb="6" color="base">
    //           {t('Payment Amount')}
    //         </Center>
    //         <Box display={'flex'} justifyContent={'space-between'}>
    //           {/* <PinInput
    //             mask
    //             type="alphanumeric"
    //             onChange={(val) => {
    //               isError && setFalse();
    //               setPwd(val);
    //             }}
    //             onComplete={(val) => {
    //               // setPwd(val);
    //               callback({ pay_password: md5(val) });
    //               // ref.current?.close();
    //             }}
    //             value={pwd}
    //             autoFocus
    //             focusBorderColor={'primary'}
    //             errorBorderColor="error"
    //             placeholder=""
    //           >
    //             <PinInputField borderColor={isError ? 'error' : 'inherit'} />
    //             <PinInputField borderColor={isError ? 'error' : 'inherit'} />
    //             <PinInputField borderColor={isError ? 'error' : 'inherit'} />
    //             <PinInputField borderColor={isError ? 'error' : 'inherit'} />
    //             <PinInputField borderColor={isError ? 'error' : 'inherit'} />
    //             <PinInputField borderColor={isError ? 'error' : 'inherit'} />
    //           </PinInput> */}
    //           <PasscodeInput
    //             ref={inputRef}
    //             seperated
    //             length={6}
    //             value={pwd}
    //             className="passwordInput"
    //             error={isError}
    //             onFocus={() => {
    //               if (isError) setFalse();
    //             }}
    //             onChange={(v: string) => {
    //               setPwd(v);

    //               if (isError) setFalse();
    //             }}
    //             onFill={(v) => {
    //               callback({ pay_password: md5(v) });
    //             }}
    //           />
    //         </Box>
    //       </Stack>
    //     </ModalBody>
    //   </ModalContent>
    // </Modal>
    <Mask visible={isOpen} onMaskClick={handleClose}>
      <Box className="password-input" bg="passwordModalBg">
        <Text mb="16px" fontSize="16px" lineHeight="20px" fontWeight="bold" textAlign="center">
          {t('Please Enter Transaction Password')}
        </Text>
        <Text fontSize={'xx-large'} textAlign={'center'} color="primary" fontWeight={600}>
          {numberFormat(amount)} {currency}
        </Text>
        <Center pb="6" color="base">
          {t('Payment Amount')}
        </Center>
        <Box display={'flex'} justifyContent={'space-between'}>
          {/* <PinInput
                mask
                type="alphanumeric"
                onChange={(val) => {
                  isError && setFalse();
                  setPwd(val);
                }}
                onComplete={(val) => {
                  // setPwd(val);
                  callback({ pay_password: md5(val) });
                  // ref.current?.close();
                }}
                value={pwd}
                autoFocus
                focusBorderColor={'primary'}
                errorBorderColor="error"
                placeholder=""
              >
                <PinInputField borderColor={isError ? 'error' : 'inherit'} />
                <PinInputField borderColor={isError ? 'error' : 'inherit'} />
                <PinInputField borderColor={isError ? 'error' : 'inherit'} />
                <PinInputField borderColor={isError ? 'error' : 'inherit'} />
                <PinInputField borderColor={isError ? 'error' : 'inherit'} />
                <PinInputField borderColor={isError ? 'error' : 'inherit'} />
              </PinInput> */}
          <PasscodeInput
            ref={inputRef}
            seperated
            length={6}
            value={pwd}
            className="passwordInput"
            error={isError}
            onFocus={() => {
              if (isError) setFalse();
            }}
            onChange={(v: string) => {
              setPwd(v);

              if (isError) setFalse();
            }}
            onFill={(v) => {
              callback({ pay_password: md5(v) });
            }}
          />
        </Box>
      </Box>
    </Mask>
  );
};

export default forwardRef(PayModal);
