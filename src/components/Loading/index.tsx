import { Flex, Container } from '@chakra-ui/react';
import React from 'react';
import SvgIcon from '../SvgIcon';
import { DotLoading } from 'antd-mobile';
import { useTranslation } from 'react-i18next';

export default function Loading() {
  const { t } = useTranslation();
  return (
    <Container display="flex" alignItems="center" justifyContent="center" flexDirection="column" width="100vw" height="100vh" pb="100px" zIndex={10000000}>
      <SvgIcon name="logo1" className="w-15 h-15" />
      <Flex alignItems="flex-end" justifyContent="center" mt="5" fontSize="sm" color="primaryText" pl="5">
        {t('Loading')} <DotLoading color="#F1B71B" />
      </Flex>
    </Container>
  );
}
