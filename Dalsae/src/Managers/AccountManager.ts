/* eslint-disable @typescript-eslint/camelcase */
import * as M from '@/Managers';
import * as I from '@/Interfaces';

//oauth관리도 여기서 하고 api콜 할 때 데이터도 여기서 받아가자
export class AccountManager {
  // tweetMng = new M.TweetDataManager();
  switter!: I.Switter;
  tempUser!: I.DalsaeUser; //사용자 등록 시 사용하는 변수
  oauth = new I.OAuth();
  constructor() {
    this.switter = {
      selectUser: new I.DalsaeUser()
    };
    this.tempUser = new I.DalsaeUser();
  }

  get selectUser() {
    if (this.switter?.selectUser.user_id) {
      return this.switter.selectUser;
    } else {
      return null;
    }
  }

  get publicKey() {
    return this.switter ? this.switter?.selectUser?.oauth_token : '';
  }

  get secretKey() {
    return this.switter ? this.switter?.selectUser?.oauth_token_secret : '';
  }

  AddUser(publicKey: string, secretKey: string, userId: string, name: string, screenName: string) {
    const user = this.switter.listUser?.find(x => x.user_id === userId);
    if (user) {
      this.switter.selectUser = user;
    } else {
      const selUser = this.switter.selectUser;
      selUser.oauth_token = publicKey;
      selUser.oauth_token_secret = secretKey;
      selUser.name = name;
      selUser.screen_name = screenName;
      selUser.user_id = userId;
    }
  }

  SetKey(publicKey: string, secretKey: string) {
    this.tempUser = new I.DalsaeUser();
    this.tempUser.oauth_token = publicKey;
    this.tempUser.oauth_token_secret = secretKey;
  }

  Reset() {
    this.tempUser = new I.DalsaeUser();
  }

  UpdateUserInfo(user: I.User) {
    if (!user) return;
    if (this.switter.selectUser.user_id === user.id_str) {
      this.switter.selectUser.user = user;
    }
    this.switter.listUser?.forEach(item => {
      if (item.user?.id_str === user.id_str) {
        item.user = user;
      }
    });
  }
}
