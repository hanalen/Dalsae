/* eslint-disable @typescript-eslint/camelcase */
import * as P from '@/Interfaces';
import * as I from '@/Interfaces';
import * as M from '@/Managers';

const baseUrl = 'https://api.twitter.com/1.1';

function CreateOptions(method: P.Method, body: string, authorization: string) {
  const options: RequestInit = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;encoding=utf-8',
      Authorization: authorization
    },
    method
  };
  return options;
}

export default class TwitterAPI {
  async request<TReq, TResp>(
    url: string,
    method: P.Method,
    params?: P.APIReq<TReq>
  ): Promise<TResp> {
    try {
      const oauth: I.OAuth = new I.OAuth();
      oauth.SetKey(M.AccountMng.publicKey, M.AccountMng.secretKey);

      const body = params && params.data ? oauth.CreateBody(params) : '';
      const reqUrl = oauth.GetUrl(params, method, url);
      const options = CreateOptions(method, body, oauth.GetHeader(params, method, url));
      console.log(options);
      const resp = await fetch(reqUrl, options);
      if (!resp.ok) {
        throw new Error(resp.statusText);
      } else {
        const json = await resp.json();
        return json;
      }
    } catch (e) {
      console.log('catch');
      console.log(e);
      return e;
    }
  }

  async requestOAuth<TReq>(url: string, params?: P.APIReq<TReq>): Promise<P.APIResp<P.OAuthRes>> {
    try {
      const oauth: I.OAuth = new I.OAuth();
      oauth.SetKey(M.AccountMng.publicKey, M.AccountMng.secretKey);

      const body = params && params.data ? oauth.CreateBody(params) : '';
      const reqUrl = oauth.GetUrl(params, 'POST', url);
      const options = CreateOptions('POST', body, oauth.GetHeader(params, 'POST', url));
      console.log(options);
      const resp = await fetch(reqUrl, options);
      if (!resp.ok) {
        throw new Error(resp.statusText);
      } else {
        const body = await resp.text();
        console.log(body);

        const pro = new Promise<P.APIResp<P.OAuthRes>>(resolve => {
          const arr = body.split('&').map(x => x.split('='));
          const oauth: I.OAuthRes = {
            oauth_callback_confirmed: false,
            oauth_token: '',
            oauth_token_secret: ''
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
            }
          });
          resp.data = oauth;
          console.log(resp);
          console.log('pro return');
          resolve(resp);
          // return resp;
        });
        console.log('pro out retuen');
        console.log(pro);
        return pro;
      }
    } catch (e) {
      console.log('catch');
      console.log(e);
      return e;
    }
  }

  async get<TReq, TResp>(url: string, params: P.APIReq<TReq>) {
    return this.request<TReq, TResp>(url, 'GET', params);
  }

  async post<TReq, TResp>(url: string, params: P.APIReq<TReq>) {
    return this.request<TReq, TResp>(url, 'POST', params);
  }

  get call() {
    return {
      statuses: {
        TimeLine: (data: P.ReqTimeLine) =>
          this.get<P.ReqTimeLine, I.Tweet[]>(baseUrl + '/statuses/home_timeline.json', {
            data
          })
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
