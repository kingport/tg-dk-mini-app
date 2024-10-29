import { useEffect } from 'react';

const ScrollToTop = (props: { children: React.ReactNode }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.scrollTo(0, 0);
    document.body.scrollTo(0, 0);
  }, [pathname]);

  return props.children;
};

export default ScrollToTop;
