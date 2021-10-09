/* eslint-disable @typescript-eslint/camelcase */
import * as M from '@/Managers';
import TwitterRequest from '@/API/TwitterRequest';
import * as P from '@/Interfaces';
import * as I from '@/Interfaces';
import * as S from '@/store/Interface';
import store from '@/store/index';
import { moduleSwitter } from '@/store/modules/SwitterStore';
import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators';

@Module({ dynamic: true, store, name: 'api' })
class APIStore extends VuexModule {
  api = new TwitterRequest();

  get call() {
    return {
      account: {
        VerifyCredentials: async (): Promise<P.APIResp<I.User>> => {
          const result = await this.api.call.account.VerifyCredentials();
          if (result.data) {
            moduleSwitter.UpdateUserInfo(result.data);
          }
          return result;
        }
      },
      media: {
        Upload: async (media: string): Promise<P.MediaResp | undefined> => {
          const split = media.split(','); //data:image/png;base64, 이거 잘라야함
          const str = split[0];
          media = split[1];
          const type = str.substring(5, str.indexOf(';'));
          if (media.length >= 5242880) {
            //이미지 전송 방식: base64 to binary -> 자르기 -> binary 자른 데이터 to base64 전송
            media = atob(split[1]);
            console.log('------start upload-----');
            const result = await this.api.call.media.UploadInit({
              command: 'INIT',
              total_bytes: media.length,
              media_type: type,
              media_category: 'tweet_gif'
            });
            console.log(result);
            const loopCount = Math.ceil(media.length / 5242880);
            console.log('loop count: ' + loopCount);
            for (let i = 0; i < loopCount; i++) {
              const chunk = media.substr(i * 5242880, 5242880);
              console.log('chun size: ' + chunk.length);
              const resp = await this.api.call.media.UploadAppend({
                command: 'APPEND',
                media: btoa(chunk),
                media_id: result.data.media_id_string,
                segment_index: i
              });
              console.log(resp);
            }
            const resFinal = await this.api.call.media.UploadFinally({
              command: 'FINALIZE',
              media_id: result.data.media_id_string
            });
            const resStatus = await this.api.call.media.UploadStatus({
              command: 'STATUS',
              media_id: result.data.media_id_string
            });
            console.log(resFinal);
            console.log(resStatus);
            return result.data;
          } else {
            const result = await this.api.call.media.Upload({
              media: media
              // media_category: 'tweet_image'
            });
            return result.data;
          }
        }
      },
      statuses: {
        Update: async (tweet: string, image: string[]): Promise<P.APIResp<I.Tweet>> => {
          let mediaStr = '';
          if (image) {
            for (let i = 0; i < image.length; i++) {
              const result = await this.call.media.Upload(image[i]);
              mediaStr += `${result?.media_id_string},`;
            }
            mediaStr = mediaStr.substring(0, mediaStr.length - 1);
          }
          const result = await this.api.call.statuses.Update({
            status: tweet,
            media_ids: mediaStr
          });
          return result;
        },
        TimeLine: async (maxId?: string, sinceId?: string): Promise<P.APIResp<I.Tweet[]>> => {
          const id = moduleSwitter.selectID;
          const result = await this.api.call.statuses.TimeLine({
            count: 200,
            tweet_mode: 'extended',
            max_id: maxId,
            since_id: sinceId
          });
          if (result.data) {
            store.dispatch('AddTweet', {
              type: S.ETweetType.E_HOME,
              user_id_str: id,
              listTweet: result.data
            });
          }
          return result;
        },
        Mention: async (maxId?: string, sinceId?: string): Promise<P.APIResp<I.Tweet[]>> => {
          const id = store.getters.selectID;
          const result = await this.api.call.statuses.Mention({
            count: 200,
            tweet_mode: 'extended',
            max_id: maxId,
            since_id: sinceId
          });
          if (result.data) {
            store.dispatch('AddTweet', {
              type: S.ETweetType.E_MENTION,
              user_id_str: id,
              listTweet: result.data
            });
          }
          return result;
        }
      },
      block: {
        Ids: async (data: P.ReqBlockIds): Promise<P.APIResp<I.BlockIds>> => {
          const result = await this.api.call.block.Ids(data);
          moduleSwitter.BlockIds(result.data.ids);
          console.log('--------------block------------');
          console.log(result);
          if (result.data.next_cursor_str !== '0')
            this.call.block.Ids({
              cursor: result.data.next_cursor_str,
              stringify_ids: true
            });
          return result;
        },
        Destroy: async (data: P.ReqBlockDestroy): Promise<P.APIResp<I.BlockDestroy>> => {
          const result = await this.api.call.block.Destory(data);
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
          const user = result.data;
          moduleSwitter.AddUser({
            publicKey: user.oauth_token,
            secretKey: user.oauth_token_secret,
            screenName: user.screen_name,
            name: user.name,
            userId: user.user_id
          });

          return result;
        }
      }
    };
  }
}
export const moduleApi = getModule(APIStore);
