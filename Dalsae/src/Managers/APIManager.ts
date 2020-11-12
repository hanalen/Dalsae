import * as M from '@/Managers';
import TwitterAPI from '@/API/APICall';
import * as P from '@/Interfaces';

export class APIManager {
  api = new TwitterAPI();
  mngTweet = new M.TweetDataManager();
  mngAccount = new M.AccountManager();

  get call() {
    return {
      statuses: {
        TimeLine: async (data: P.ReqTimeLine) => {
          this.api.call.statuses.TimeLine(data);
        }
      },
      oauth: {
        ReqToken: async (data: P.ReqToken) =>
          this.api.requestOAuth<P.ReqToken>('https://api.twitter.com/oauth/request_token', {
            data
          }),
        ReqAccessToken: async (data: P.ReqAccessToken) =>
          this.api.requestOAuth<P.ReqAccessToken>('https://api.twitter.com/oauth/access_token', {
            data
          })
      }
    };
  }
}
