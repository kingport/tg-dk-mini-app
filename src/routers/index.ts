import { rootRouter } from './router';
import { useRoutes } from 'react-router-dom';

const Router = () => {
  const routes = useRoutes(rootRouter);
  return routes;
};

export default Router;
