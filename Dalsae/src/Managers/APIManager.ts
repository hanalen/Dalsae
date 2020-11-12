import * as M from '@/Managers';
import TwitterAPI from '@/API/APICall';
import * as P from '@/Interfaces';

export class APIManager {
  api = new TwitterAPI();
  mngTweet = new M.TweetDataManager();
  mngAccount = new M.AccountManager();

  ShowMessage!: (msg: string) => void;
  ShowConfirm!: (msg: string) => Promise<boolean>;

  get call() {
    return {
      statuses: {
        TimeLine: async (data: P.ReqTimeLine) => {
          this.api.call.statuses.TimeLine(data);
        }
      },
      oauth: {
        ReqToken: async (data: P.ReqToken): Promise<P.APIResp<P.OAuthRes>> => {
          return this.api.requestOAuth<P.ReqToken>('https://api.twitter.com/oauth/request_token', {
            data
          });
        },
        ReqAccessToken: async (data: P.ReqAccessToken): Promise<P.APIResp<P.OAuthRes>> => {
          const result = await this.api.requestOAuth<P.ReqAccessToken>(
            'https://api.twitter.com/oauth/access_token',
            {
              data
            }
          );
          if (!result.data) return result;
          this.mngAccount.AddUser(
            result.data.oauth_token,
            result.data.oauth_token_secret,
            result.data.user_id,
            result.data.name,
            result.data.screen_name
          );
          return result;
        }
      }
    };
  }
}
