import { lazy } from 'react';
import lazyLoad from './utils/lazyLoad';
import { RouteObject } from 'react-router-dom';

const metaRouters: any = import.meta.glob('./modules/*.tsx', { eager: true });
/**
 * @description 处理路由
 * @returns {*}
 */
export const routerArray: any = [];
Object.keys(metaRouters).forEach((item) => {
  Object.keys(metaRouters[item]).forEach((key: string) => {
    routerArray.push(...metaRouters[item][key]);
  });
});

/**
 * @description 路由配置
 */
export const rootRouter: RouteObject[] = [
  {
    path: '/',
    element: lazyLoad(lazy(() => import('@/pages/home'))),
  },
  ...routerArray,
  {
    path: '*',
    element: lazyLoad(lazy(() => import('@/components/ErrorMessage/404'))),
  },
];
