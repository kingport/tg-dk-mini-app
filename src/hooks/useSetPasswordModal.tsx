import { CloseIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Flex, Text } from '@chakra-ui/react';
import { Dialog } from 'antd-mobile';
import { DialogShowHandler } from 'antd-mobile/es/components/dialog';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function useSetPasswordModal() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userStore } = userStores();

  const [isSet, setIsSet] = useState<boolean>(() => Boolean(userStore.userInfo?.payment_password_status));
  const handler = useRef<DialogShowHandler>();

  useEffect(() => {
    if (isSet) {
      userStore.changeUserInfo({ ...userStore.userInfo, payment_password_status: 1 });
    }
  }, [isSet]);

  // 未绑定上级提示
  const notSetModal = () => {
    return (handler.current = Dialog.show({
      content: (
        <Box bg="secondaryBgColor">
          <Flex justifyContent={'flex-end'}>
            <CloseIcon onClick={() => handler.current?.close()} width={'12px'} color="base" />
          </Flex>
          <Center textAlign={'center'} fontSize={'medium'} fontWeight={500} color="secondary">
            {t('You have not set a Security Password')}
          </Center>
          <Text textAlign={'center'} pt="16px" fontSize={'small'} color="placeholderColor">
            {t('For your security, set up a password before trading')}
          </Text>
          <Flex mt={'24px'} justifyContent={'space-between'}>
            <Button onClick={() => handler.current?.close()} width={'48%'} borderRadius={'4px'} height="52px" color="#F1B71B" border="1px solid #F1B71B">
              {t('Next time')}
            </Button>
            <Button
              onClick={() => {
                handler.current?.close();
                navigate('/setting/change/trade/password');
              }}
              width={'48%'}
              color="white"
              borderRadius={'4px'}
              height="52px"
              bg="#F1B71B"
            >
              {t('Set up Now')}
            </Button>
          </Flex>
        </Box>
      ),
    }));
  };

  return { isSet, setIsSet, notSetModal };
}
