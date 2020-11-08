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
    // this.tweetMng = new M.TweetDataManager();
    this.switter = {
      selectUser: {
        user_id: '',
        name: '',
        oauth_token: '',
        screen_name: '',
        oauth_token_secret: ''
      }
    };
    this.tempUser = {
      name: '',
      oauth_token: '',
      oauth_token_secret: '',
      screen_name: '',
      user_id: ''
    };
  }

  get selectUser() {
    if (this.switter?.selectUser.user_id !== '') {
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
      this.switter.selectUser = {
        oauth_token: publicKey,
        oauth_token_secret: secretKey,
        user_id: userId,
        name: name,
        screen_name: screenName
      };
    }
  }

  SetKey(publicKey: string, secretKey: string) {
    this.tempUser = {
      name: '',
      oauth_token: publicKey,
      oauth_token_secret: secretKey,
      user_id: '',
      screen_name: ''
    };
  }

  Reset() {
    this.tempUser = {
      name: '',
      oauth_token: '',
      oauth_token_secret: '',
      user_id: '',
      screen_name: ''
    };
  }
}
const AccountMng = new AccountManager();
export { AccountMng };
