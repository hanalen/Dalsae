/* eslint-disable @typescript-eslint/camelcase */
import * as P from '@/Interfaces';
import * as I from '@/Interfaces';
import * as M from '@/Managers';
import { ErrorManager } from '@/Managers';
import { moduleSwitter } from '@/store/modules/SwitterStore';
import axios from 'axios';
const baseUrl = 'https://api.twitter.com/1.1';

function CreateOptions(
  method: P.Method,
  body: string | FormData,
  authorization: string,
  contentType?: string
) {
  const options: RequestInit = {
    headers: {
      'Content-Type': contentType
        ? contentType
        : 'application/x-www-form-urlencoded;encoding=utf-8',
      Authorization: authorization
    },
    body: body ? body : null,
    method
  };
  return options;
}

function CreateHeader(authorization: string, contentType?: string) {
  const ret = {
    'Content-Type': contentType ? contentType : 'application/x-www-form-urlencoded;encoding=utf-8',
    Authorization: authorization
  };
  console.log('header');
  console.log(ret);
  return ret;
  // return {
  //   'Content-Type': contentType ? contentType : 'application/x-www-form-urlencoded;encoding=utf-8',
  //   Authorization: authorization
  // };
}

export class TwitterRequest {
  async request<TReq, TResp>(
    url: string,
    method: P.Method,
    isQueryParam: boolean,
    params?: P.APIReq<TReq>
  ): Promise<P.APIResp<TResp>> {
    try {
      const oauth: I.OAuth = new I.OAuth();
      oauth.SetKey(moduleSwitter.publicKey, moduleSwitter.secretKey);

      const body = params && params.data && !isQueryParam ? oauth.CreateBody(params) : '';
      const reqUrl = oauth.GetUrl(params, url, isQueryParam);
      const resp = await axios({
        method: method,
        url: reqUrl,
        headers: CreateHeader(oauth.GetHeader(params, method, url)),
        data: body
      });
      console.log(resp);
      return { data: resp.data };
    } catch (e) {
      console.log('catch');
      console.log(e);
      if (e instanceof I.ResponseTwitterError) {
        ErrorManager.instence().APIError(e);
      } else {
        ErrorManager.instence().Error(e);
      }
      return e;
    }
  }

  async requestOAuth<TReq>(url: string, params?: P.APIReq<TReq>): Promise<P.APIResp<P.OAuthRes>> {
    try {
      const oauth: I.OAuth = new I.OAuth();
      oauth.SetKey(moduleSwitter.tempUser.oauth_token, moduleSwitter.tempUser.oauth_token_secret);

      const body = params && params.data ? oauth.CreateBody(params) : '';
      const reqUrl = oauth.GetUrl(params, url, false);
      const resp = await axios({
        method: 'POST',
        url: reqUrl,
        headers: CreateHeader(oauth.GetHeader(params, 'POST', url)),
        data: body
      });
      if (!resp.data) {
        throw new Error(resp.statusText);
      } else {
        const body = (await resp.data) as string;
        console.log(body);

        const pro = new Promise<P.APIResp<P.OAuthRes>>(resolve => {
          const arr = body.split('&').map(x => x.split('='));
          const oauth: I.OAuthRes = {
            oauth_callback_confirmed: false,
            oauth_token: '',
            oauth_token_secret: '',
            name: '',
            user_id: '',
            screen_name: ''
          };
          const resp: P.APIResp<P.OAuthRes> = { data: oauth };
          arr.forEach(item => {
            console.log(item);
            if (item[0] === 'oauth_callback_confirmed') {
              oauth.oauth_callback_confirmed = item[1] === 'true';
            } else if (item[0] === 'oauth_token') {
              oauth.oauth_token = item[1];
            } else if (item[0] === 'oauth_token_secret') {
              oauth.oauth_token_secret = item[1];
            } else if (item[0] === 'screen_name') {
              oauth.screen_name = item[1];
            } else if (item[0] === 'name') {
              oauth.name = item[1];
            } else if (item[0] === 'user_id') {
              oauth.user_id = item[1];
            }
          });
          resp.data = oauth;
          resolve(resp);
        });
        return pro;
      }
    } catch (e) {
      console.log('catch');
      console.log(e);
      if (e instanceof I.ResponseTwitterError) {
        ErrorManager.instence().APIError(e);
      } else {
        ErrorManager.instence().Error(e);
      }
      return e;
    }
  }

  async media<TResp>(
    url: string,
    method: P.Method,
    params: P.APIReq<P.ReqMedia>,
    contentType?: string
  ): Promise<P.APIResp<TResp>> {
    try {
      const oauth: I.OAuth = new I.OAuth();
      oauth.SetKey(moduleSwitter.publicKey, moduleSwitter.secretKey);

      const body = new FormData();
      if (params.data?.media) {
        body.append('media_data', params.data.media);
      }
      const reqUrl = oauth.GetUrl(params, url, true);
      const header = {
        'Content-Type': contentType
          ? contentType
          : 'application/x-www-form-urlencoded;encoding=utf-8',
        Authorization: oauth.GetHeader(params, 'POST', url)
        // 'Content-Transfer-Encoding': 'base64'
      };
      // const header = CreateHeader(
      //   oauth.GetHeader(contentType ? params : params, 'POST', url),
      //   contentType
      // );
      const resp = await axios({
        method: 'POST',
        url: reqUrl,
        headers: header,
        data: body
      });
      console.log(resp);
      return { data: resp.data };
    } catch (e) {
      console.log('catch');
      console.log(e);
      if (e instanceof I.ResponseTwitterError) {
        ErrorManager.instence().APIError(e);
      } else {
        ErrorManager.instence().Error(e);
      }
      return e;
    }
  }

  async get<TReq, TResp>(url: string, params: P.APIReq<TReq>, isQueryParam = true) {
    return this.request<TReq, TResp>(url, 'GET', isQueryParam, params);
  }

  async post<TReq, TResp>(url: string, params: P.APIReq<TReq>, isQueryParam = false) {
    return this.request<TReq, TResp>(url, 'POST', isQueryParam, params);
  }

  get call() {
    return {
      account: {
        VerifyCredentials: () =>
          this.get<P.ReqUserInfo, I.User>(baseUrl + '/account/verify_credentials.json', {})
      },
      media: {
        Upload: (data: P.ReqMedia) => {
          const ret = this.media<P.MediaResp>(
            'https://upload.twitter.com/1.1/media/upload.json',
            'POST',
            { data: data },
            'multipart/form-data'
          );
          return ret;
        },
        UploadInit: (data: P.ReqMedia) => {
          const ret = this.post<P.ReqMedia, P.MediaResp>(
            'https://upload.twitter.com/1.1/media/upload.json',
            { data: data },
            true
          );
          return ret;
        },
        UploadAppend: (data: P.ReqMedia) => {
          const ret = this.media<P.MediaResp>(
            'https://upload.twitter.com/1.1/media/upload.json',
            'POST',
            { data: data },
            'multipart/form-data'
          );
          return ret;
        },
        UploadFinally: (data: P.ReqMedia) => {
          const ret = this.media<P.MediaResp>(
            'https://upload.twitter.com/1.1/media/upload.json',
            'POST',
            { data: data }
          );
          return ret;
        },
        UploadStatus: (data: P.ReqMedia) => {
          const ret = this.media<P.MediaResp>(
            'https://upload.twitter.com/1.1/media/upload.json',
            'POST',
            { data: data }
          );
          return ret;
        }
      },
      statuses: {
        Update: (data: P.ReqUpdate) =>
          this.post<P.ReqUpdate, I.Tweet>(baseUrl + '/statuses/update.json', {
            data
          }),
        Destroy: (data: P.ReqDestroy) =>
          this.post<P.ReqRetweet, I.Tweet>(baseUrl + '/statuses/destroy/' + data.id_str + '.json', {
            data
          }),
        Retweet: (data: P.ReqRetweet) =>
          this.post<P.ReqRetweet, I.Tweet>(baseUrl + '/statuses/retweet/' + data.id_str + '.json', {
            data
          }),
        UnRetweet: (data: P.ReqRetweet) =>
          this.post<P.ReqRetweet, I.Tweet>(
            baseUrl + '/statuses/unretweet/' + data.id_str + '.json',
            {
              data
            }
          ),
        TimeLine: (data: P.ReqTimeLine) =>
          this.get<P.ReqTimeLine, I.Tweet[]>(baseUrl + '/statuses/home_timeline.json', {
            data
          }),
        Mention: (data: P.ReqTimeLine) =>
          this.get<P.ReqMention, I.Tweet[]>(baseUrl + '/statuses/mentions_timeline.json', {
            data
          })
      },
      favorites: {
        Create: (data: P.ReqCreate) =>
          this.post<P.ReqCreate, I.Tweet>(baseUrl + '/favorites/create.json', { data }),
        Destroy: (data: P.ReqCreate) =>
          this.post<P.ReqCreate, I.Tweet>(baseUrl + '/favorites/destroy.json', { data })
      },
      block: {
        Ids: (data: P.ReqBlockIds) =>
          this.get<P.ReqBlockIds, I.BlockIds>(baseUrl + '/blocks/ids.json', {
            data
          }),
        Destory: (data: P.ReqBlockDestroy) =>
          this.post<P.ReqBlockDestroy, I.BlockDestroy>(
            baseUrl + '/blocks/destroy.json',
            {
              data
            },
            true
          )
      },
      oauth: {
        ReqToken: (data: P.ReqToken) =>
          this.requestOAuth<P.ReqToken>('https://api.twitter.com/oauth/request_token', {
            data
          }),
        ReqAccessToken: (data: P.ReqAccessToken) =>
          this.requestOAuth<P.ReqAccessToken>('https://api.twitter.com/oauth/access_token', {
            data
          })
      }
    };
  }
}
const twitterRequest = new TwitterRequest();
export default twitterRequest;
