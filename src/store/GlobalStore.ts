//自动把属性、对象、数组、Maps 和 Sets 转化成 observable
import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import chainLinks from '@/utils/chain-link.json';

class GlobalStore {
  // 定义初始值
  i18nextLng = 'en_US';
  chainsLinks: any[] = [...chainLinks.data];
  currentChain = {
    chain_id: 1,
  };
  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: 'globalStores',
      properties: ['chainsLinks', 'i18nextLng'],
      storage: window.localStorage,
    });
  }
  changeLang(lang: string) {
    this.i18nextLng = lang;
  }
  addChains(data) {
    this.chainsLinks.unshift(data);
  }
  addToken(data: { chains: any; tokens: any }) {
    this.chainsLinks.forEach((item) => {
      if (item.chain_id === data.chains.chain_id) {
        item.tokens.push(data.tokens);
      }
    });
  }
  deleteToken(data: { chains: any; symbol: string }) {
    this.chainsLinks.forEach((item) => {
      if (item.chain_id === data.chains.chain_id) {
        item.tokens.splice(item.tokens.indexOf(data.symbol), 1);
      }
    });
  }
  changeChain(data) {
    this.currentChain = data;
  }
}

export default GlobalStore;
