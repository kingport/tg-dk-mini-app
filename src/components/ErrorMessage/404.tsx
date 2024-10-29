import { ResultPage } from 'antd-mobile';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { t } = useTranslation();
  return <ResultPage status="error" title="404" description={t('Not found')} />;
};

export default NotFound;
