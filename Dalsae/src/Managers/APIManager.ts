/* eslint-disable @typescript-eslint/camelcase */
import * as M from '@/Managers';
import TwitterAPI from '@/API/APICall';
import * as P from '@/Interfaces';
import * as I from '@/Interfaces';

export class APIManager {
  api = new TwitterAPI();
  mngTweet!: M.TweetDataManager;
  mngAccount!: M.AccountManager;

  ShowMessage!: (msg: string) => void;
  ShowConfirm!: (msg: string) => Promise<boolean>;

  get call() {
    return {
      account: {
        VerifyCredentials: async (): Promise<P.APIResp<I.User>> => {
          const result = await this.api.call.account.VerifyCredentials();
          if (result.data && this.mngAccount.selectUser) {
            this.mngAccount.selectUser.user = result.data;
          }
          return result;
        }
      },
      statuses: {
        TimeLine: async (maxId?: string, sinceId?: string): Promise<P.APIResp<I.Tweet[]>> => {
          const result = await this.api.call.statuses.TimeLine({
            count: '200',
            tweet_mode: 'extended',
            max_id: maxId,
            since_id: sinceId
          });
          if (result.data) {
            this.mngTweet.AddHome(result.data);
          }
          return result;
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
