import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';

class UserWalletStore {
  // 钱包信息
  walletInfo: any = {
    // 当前使用的钱包是本地钱包还是插件钱包
    walletType: 'localWallet',
    // 本地钱包信息
    localWallet: {
      // 公钥
      publicKey: '',
      // 余额
      balance: 0,
      // 私钥
      secretKey: '',
    },
    // 插件钱包地址
    pluginWallet: {
      // 公钥
      publicKey: '',
      // 余额
      balance: 0,
    },
  };
  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: 'UserWalletStore',
      properties: ['walletInfo'],
      storage: window.localStorage,
    });
  }

  changeUserWalletStore(data: any) {
    this.walletInfo = data;
  }
}

export default UserWalletStore;
