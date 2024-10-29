import { CloseIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Flex, Input, Text } from '@chakra-ui/react';
import { Dialog } from 'antd-mobile';
import { DialogShowHandler } from 'antd-mobile/es/components/dialog';
import { useEffect, useState } from 'react';
import i18next from '@/i18n';

export default function useBind() {
  const { userInfo } = userStores().userStore;
  const { t } = i18next;
  const [isBind, setIsBind] = useState<boolean>(() => Boolean(userInfo?.bind_status));
  const handler = useRef<DialogShowHandler>();
  const handlerBind = useRef<DialogShowHandler>();
  const [bindCode, setBindCode] = useState<string>();

  useEffect(() => {
    if (!isBind) {
      notBindModal();
    }
  }, [isBind]);

  // 未绑定上级提示
  const notBindModal = () => {
    return (handler.current = Dialog.show({
      content: (
        <Box bg="secondaryBgColor">
          <Flex justifyContent={'flex-end'}>
            <CloseIcon onClick={() => handler.current?.close()} width={'12px'} color="closeButtonColor" />
          </Flex>
          <Center textAlign={'center'} fontSize={'medium'} fontWeight={500} color="secondary">
            {t('You have not bound your superior invitation code yet')}
          </Center>
          <Text textAlign={'center'} pt="16px" fontSize={'small'} color="#818A9B">
            {t('For your own rights')}
          </Text>
          <Flex mt={'24px'} justifyContent={'space-between'}>
            <Button onClick={() => handler.current?.close()} width={'48%'} borderRadius={'3rem'} height="52px" color="#F1B71B" border="1px solid #EBECED">
              {t('Next time')}
            </Button>
            <Button
              onClick={() => {
                handler.current?.close();
                intiveBindModal();
              }}
              width={'48%'}
              color="white"
              borderRadius={'3rem'}
              height="52px"
              bg="#F1B71B"
            >
              {t('Bind now')}
            </Button>
          </Flex>
        </Box>
      ),
    }));
  };

  // 邀请绑定上级
  const intiveBindModal = () => {
    return (handlerBind.current = Dialog.show({
      content: (
        <Box bg="secondaryBgColor">
          <Flex justifyContent={'flex-end'}>
            <CloseIcon onClick={() => handlerBind.current?.close()} width={'12px'} color="closeButtonColor" />
          </Flex>
          <Center textAlign={'center'} fontSize={'medium'} fontWeight={500} color="secondary">
            {t('For your own rights')}
          </Center>
          <Text pt="16px" pb="12px" fontWeight={500} fontSize={'small'} color="closeButtonColor">
            {t('Invitation Code')}
          </Text>
          <Input
            onChange={(v) => setBindCode(v?.target?.value)}
            height={'52px'}
            pl="14px"
            borderColor="BindInputBorderColor"
            borderRadius={'12px'}
            width={'100%'}
            fontSize={'12px'}
            placeholder={t('Please enter invitation code')}
            autoComplete="off"
          />
          <Flex mt={'24px'} justifyContent={'space-between'}>
            <Button
              onClick={() => {
                console.log(bindCode, 'bindCode');
                if (bindCode) {
                  //
                }
                // handlerBind.current?.close();
              }}
              width={'100%'}
              color="white"
              borderRadius={'3rem'}
              height="52px"
              bg="#F1B71B"
            >
              {t('Submit')}
            </Button>
          </Flex>
        </Box>
      ),
    }));
  };

  return { isBind, setIsBind, notBindModal, intiveBindModal };
}
