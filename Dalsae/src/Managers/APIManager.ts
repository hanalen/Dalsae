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
      media: {
        Upload: async (media: string): Promise<P.MediaResp> => {
          const result = await this.api.call.media.Upload({ media: media });
          return result.data;
        }
      },
      statuses: {
        Update: async (tweet: string, image: string[]): Promise<P.APIResp<I.Tweet>> => {
          let mediaStr = '';
          if (image) {
            image.forEach(img => {
              this.call.media
                .Upload(img)
                .then(data => {
                  mediaStr += `${data.media_id_string},`;
                })
                .catch(err => {
                  console.log('media err');
                  console.log(err);
                });
            });
          }
          const result = await this.api.call.statuses.Update({
            status: tweet,
            media_ids: mediaStr
          });
          return result;
        },
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
        },
        Mention: async (maxId?: string, sinceId?: string): Promise<P.APIResp<I.Tweet[]>> => {
          const result = await this.api.call.statuses.Mention({
            count: '200',
            tweet_mode: 'extended',
            max_id: maxId,
            since_id: sinceId
          });
          if (result.data) {
            this.mngTweet.AddMention(result.data);
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
