import React from 'react';
import GlobalStore from './GlobalStore';
import UserWalletStore from './UserWalletStore';
import UserStore from './UserStore';
// 钱包相关
export const walletContext = React.createContext({
  userwalletStore: new UserWalletStore(),
});
// 全局相关
export const globalContext = React.createContext({
  globalStore: new GlobalStore(),
});

export const userContext = React.createContext({
  userStore: new UserStore(),
});

export const userStores = () => React.useContext(userContext);
export const globalStores = () => React.useContext(globalContext);

// 钱包相关
export const userWalletStores = () => React.useContext(walletContext);
