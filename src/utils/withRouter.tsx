import { NavigateFunction, useLocation, useNavigate, useParams } from 'react-router';
import { localClear } from './util';

export interface RoutedProps<Params, State> {
  location: State;
  navigate: NavigateFunction;
  params: Params;
}

export function withRouter(Child: React.ComponentType<any>) {
  return (props: React.PropsWithChildren<any>) => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
      const token = localStorage.getItem('access_token') || '';

      if (
        ![
          '/',
          '/user/login',
          '/setting/language',
          '/user/email/login',
          '/user/forgot/password',
          '/user/verification/code',
          '/user/register',
          '/user/forgot/password/reset',
          '/privacy',
          '/terms',
          '/missions',
        ].includes(location.pathname) &&
        !token
      ) {
        localClear();
        // return <Navigate to={'/user/login'} />;
        navigate('/user/login');
      }
    }, [location.pathname]);

    useEffect(() => {
      const token = localStorage.getItem('access_token') || '';

      if (
        !['/', '/user/login', '/user/email/login', '/user/forgot/password', '/user/verification/code', '/user/register', '/user/forgot/password/reset', '/privacy', '/terms', '/missions'].includes(
          location.pathname,
        ) &&
        !token
      ) {
        localClear();
        window.location.href = '/user/login';
      }
    }, [location.pathname]);

    return <Child {...props} navigate={navigate} location={location} params={params} />;
  };
}
