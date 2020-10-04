import * as M from '@/Managers';
import * as I from '@/Interfaces';

//oauth관리도 여기서 하고 api콜 할 때 데이터도 여기서 받아가자
export class AccountManager {
  tweetMng = new M.TweetDataManager();
  switter?: I.Switter;
  oauth = new I.OAuth();
  constructor() {
    // this.tweetMng = new M.TweetDataManager();
  }

  //이게 최선인가?
  GetHeader() {
    if (!this.switter) return;

    return this.oauth.GetHeader(
      this.switter.selectUser.oauth_token,
      this.switter.selectUser.oauth_token_secret
    );
  }
}
