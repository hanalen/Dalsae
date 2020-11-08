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
    this.tempUser = { name: '', oauth_token: '', oauth_token_secret: '' };
  }

  get publicKey() {
    return this.switter ? this.switter?.selectUser?.oauth_token : '';
  }

  get secretKey() {
    return this.switter ? this.switter?.selectUser?.oauth_token_secret : '';
  }

  SetKey(publicKey: string, secretKey: string) {
    this.tempUser = { name: '', oauth_token: publicKey, oauth_token_secret: secretKey };
  }

  Reset() {
    this.tempUser = { name: '', oauth_token: '', oauth_token_secret: '' };
  }
}
const AccountMng = new AccountManager();
export { AccountMng };
