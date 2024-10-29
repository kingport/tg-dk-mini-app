import { Container, Box, Flex, Text, Image, Button } from '@chakra-ui/react';
import QRCode from 'qrcode.react';
import { useTranslation } from 'react-i18next';

import { h5Copy, saveImage } from '@/utils/util';
import InviteImg from '@/assets/invite-bg.png';
import SvgIcon from '../SvgIcon';
import InviteImgAr from '@/assets/invite-text-ar.png';
import InviteImgDe from '@/assets/invite-text-de.png';
import InviteImgEn from '@/assets/invite-text-en.png';
import InviteImgEs from '@/assets/invite-text-es.png';
import InviteImgFr from '@/assets/invite-text-fr.png';
import InviteImgId from '@/assets/invite-text-id.png';
import InviteImgJp from '@/assets/invite-text-jp.png';
import InviteImgKr from '@/assets/invite-text-kr.png';
import InviteImgPt from '@/assets/invite-text-pt.png';
import InviteImgRu from '@/assets/invite-text-ru.png';
import InviteImgTh from '@/assets/invite-text-th.png';
import InviteImgVi from '@/assets/invite-text-vi.png';
import InviteImgZh from '@/assets/invite-text-zh.png';
import InviteImgTw from '@/assets/invite-text-tw.png';
import { useModeValue } from '@/hooks/useModeValue';

const InviteModal = (props: { setVisible: any }) => {
  const { setVisible } = props;
  const { t } = useTranslation();
  const { userInfo } = userStores().userStore;
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<any>();

  const { i18n } = useTranslation();

  const inviteTextImg = {
    ar_AR: InviteImgAr,
    de_DE: InviteImgDe,
    en_US: InviteImgEn,
    es_ES: InviteImgEs,
    fr_FR: InviteImgFr,
    id_ID: InviteImgId,
    ja_JP: InviteImgJp,
    ko_KR: InviteImgKr,
    pt_BR: InviteImgPt,
    ru_RU: InviteImgRu,
    th_TH: InviteImgTh,
    vi_VN: InviteImgVi,
    zh_CN: InviteImgZh,
    zh_TW: InviteImgTw,
  };

  const contentBgColor = useModeValue('white', '#2F2F2E');
  const qrBoxBgColor = useModeValue('#FFFBEF', '#FBFBFB');

  return (
    <Container px="0">
      <Box ref={canvasRef} position="relative" border="1px solid #F1B71B" rounded="18px" bg={contentBgColor}>
        <Image src={InviteImg} width="100%" />
        <Box display="flex" flexDirection="column" justifyContent="space-between" position="absolute" width="100%" height="100%" top="0" left="0" px="4" pt="4" pb="4">
          <Flex alignItems="center" justifyContent="space-between">
            <SvgIcon name="logo" style={{ width: '114px', height: '34px' }} />
            <SvgIcon name="cancel" style={{ width: '28px', height: '28px' }} onClick={() => setVisible(false)} />
          </Flex>
          {/* <Text fontSize="36px" fontWeight="900" lineHeight="54px" color="#ECAD04" textAlign="center" stroke="2px #fff">
            Safe and secure Web3 Wealth platform
          </Text> */}
          <Image src={inviteTextImg[i18n.language]} width="100%" />
          <Flex bg={qrBoxBgColor} rounded="4px" px="14px" py="5" pr="6" justifyContent="space-between">
            <Text fontSize={['zh_CN', 'zh_TW'].includes(i18n.language) ? '14px' : '12px'} fontWeight="medium" color="#171721" maxWidth="185px">
              {t('Get the invitation code in the BitHarvest app')} → {t('Invite friends')} → {t('Friends enter the BitHarvest link wallet')} → {t('Bind the invitation code')} → {t('Purchase nodes')}
            </Text>
            <Box>
              <Flex alignItems="center" justifyContent="center" bg="primaryAlpha.100" rounded="6px" width="80px" height="80px">
                <QRCode fgColor="#ECAD04" id="code" size={70} value={`${window.location.origin}/user/login?invitationCode=${userInfo?.invite_code}`} style={{ borderRadius: '8px' }} />
              </Flex>
              <Box mt="1" bg="primaryAlpha.100" color="#FFBA00" rounded="6px" py="1" textAlign="center" width="80px">
                <Text fontWeight="600" fontSize="12px" lineHeight="1">
                  {userInfo.invite_code}
                </Text>
                <Text fontSize="8px" fontWeight="600" lineHeight={1}>
                  {t('Invite code')}
                </Text>
              </Box>
            </Box>
          </Flex>
        </Box>
      </Box>
      <Flex mt="10px" alignItems="center">
        <Button
          height="52px"
          flex="1"
          fontSize="14px"
          color="primary"
          border="1px solid #F1B71B"
          bg="secondaryBgColor"
          isLoading={loading}
          _hover={{ bg: 'secondary' }}
          _active={{ bg: 'secondary' }}
          onClick={() => {
            setLoading(true);
            saveImage(canvasRef, () => setLoading(false));
          }}
        >
          {t('Save photo')}
        </Button>
        <Button
          height="52px"
          bg="primary"
          fontSize="14px"
          color="white"
          flex="1"
          ml="10px"
          _hover={{ bg: 'primary' }}
          _active={{ bg: 'primary' }}
          onClick={() => {
            h5Copy(`${window.location.origin}/user/login?invitationCode=${userInfo?.invite_code}`);
          }}
        >
          {t('Copy Link')}
        </Button>
      </Flex>
    </Container>
  );
};

export default InviteModal;
