import { TabBar } from 'antd-mobile';
import { useNavigate, useLocation } from 'react-router-dom';
import { withRouter } from '@/utils/withRouter';
import './index.css';
import SvgIcon from '../SvgIcon';
import { useTranslation } from 'react-i18next';
import { Box } from '@chakra-ui/react';
import { useModeValue } from '@/hooks/useModeValue';

const FooterBar = () => {
  const [activeKey, setActiveKey] = useState('/');
  const [hideTab, sethideTab] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const iconColor = useModeValue('#ffffff', '#1C1E28');
  const bgColor = useModeValue('#ffffff', '#1c1e27');
  const boxShadow = useModeValue('0px -4px 4px rgba(0, 0, 0, 0.01)', '0px 4px 30px rgba(30, 107, 235, 0.12)');

  const tabs = [
    {
      key: '/',
      title: t('HOME'),
      icon: (active: boolean) => <SvgIcon style={{ width: '22px', height: '22px', color: iconColor }} name={active ? 'home-active' : 'home'} />,
    },
    {
      key: '/income',
      title: t('INCOME'),
      icon: (active: boolean) => <SvgIcon style={{ width: '22px', height: '22px', color: iconColor }} name={active ? 'income-active' : 'income'} />,
    },
    {
      key: '/market',
      title: t('MARKET'),
      icon: (active: boolean) => <SvgIcon style={{ width: '22px', height: '22px' }} name={active ? 'market-active' : 'market'} />,
    },
    {
      key: '/wallet',
      title: t('WALLET'),
      icon: (active: boolean) => <SvgIcon style={{ width: '22px', height: '22px', color: iconColor }} name={active ? 'wallet-active' : 'wallet'} />,
    },
    {
      key: '/mine',
      title: t('ME'),
      icon: (active: boolean) => <SvgIcon style={{ width: '22px', height: '22px' }} name={active ? 'mine-active' : 'mine'} />,
    },
  ];

  const onChange = (val: string) => {
    setActiveKey(val);
    navigate(`${val}`);
  };

  useEffect(() => {
    // if (pathname === "/") {
    //   setActiveKey("/home");
    //   sethideTab(false);
    //   return;
    // }
    setActiveKey(pathname);
    sethideTab(!tabs.map((item) => item.key).includes(pathname));
  }, [pathname]);

  return (
    <Box
      style={{
        display: hideTab ? 'none' : 'block',
        background: bgColor,
        boxShadow: boxShadow,
      }}
      className={`FooterBar`}
    >
      <TabBar activeKey={activeKey} onChange={onChange}>
        {tabs.map((item) => (
          <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
        ))}
      </TabBar>
    </Box>
  );
};
export default withRouter(FooterBar);
