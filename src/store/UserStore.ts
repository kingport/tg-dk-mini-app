import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';

class UserStore {
  userInfo: any = {};
  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: 'userStore',
      properties: ['userInfo'],
      storage: window.localStorage,
    });
  }

  changeUserInfo(data: any) {
    this.userInfo = data;
  }
}

export default UserStore;
