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
    method,
    body: body
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
      const options = CreateOptions(method, body, oauth.CreateBody(params));
      const resp = await fetch(reqUrl, options);
      if (!resp.ok) {
        throw new Error(resp.statusText);
      } else {
        const json = await resp.json();
        return json;
      }
    } catch (e) {
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
            data,
            method: 'GET'
          })
      }
    };
  }
}
