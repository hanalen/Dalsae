/* eslint-disable @typescript-eslint/camelcase */
import * as P from '@/Interfaces';
import * as I from '@/Interfaces';
import * as M from '@/mixins';
import { moduleModal } from '@/store/modules/ModalStore';
import { moduleSwitter } from '@/store/modules/SwitterStore';
import axios, { AxiosError } from 'axios';
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
  CheckAPIError(e: any) {
    if (e.errors) return true;
    else return false;
  }
  GetApiError(e: I.ResponseTwitterError): string {
    console.log(e);
    let message = '';
    if (!e.errors || e.errors.length < 1) return '';
    switch (e.errors[0].code) {
      case 34:
        message = '해당 유저는 없습니다.';
        break;
      case 44:
        message = '잘못 된 요청';
        break;
      case 64:
        message = '계정이 일시 정지 되었습니다.';
        break;
      case 87:
        message = '달새는 해당 동작을 할 수 없습니다.';
        break;
      case 88:
        message = '불러오기 제한, 몇 분 뒤 시도해주세요.';
        break;
      case 89:
        message =
          '잘못되거나 만료 된 토큰. 오류가 지속될 경우 Data폴더에 Switter를 지운 후 시도해주세요';
        break;
      case 130:
      case 131:
        message = '트위터 내부 오류';
        break;
      case 135:
        message = '인증할 수 없습니다.';
        break;
      case 136:
        message = '저런, 당신을 차단한 사람입니다.';
        break;
      case 139:
        message = '이미 관심글에 등록 된 트윗입니다.';
        break;
      case 144:
        message = '삭제된 트윗입니다.';
        break;
      case 150:
        message = '상대방에게 쪽지를 보낼 수 없습니다.';
        break;
      case 151:
        message = '메시지를 보내는 중 에러가 발생했습니다';
        break;
      case 179:
        message = '대화 트윗을 쓴 유저가 잠금 계정입니다.';
        break;
      case 185:
        message = '트윗 제한. 트잉여님 트윗 적당히 써주세요.';
        break;
      case 187:
        message = '중복 트윗입니다. 같은 내용을 적지 말아주세요 :(';
        break;
      case 327:
        message = '이미 리트윗 한 트윗입니다.';
        break;
      case 323:
        message = 'GIF와 이미지를 동시에 업로드 할 수 없습니다.';
        break;
      case 324:
        message = '이미지 용량이 5mb를 넘어 업로드 할 수 없습니다.';
        break;
      case 386:
        message = '트윗이 280자를 넘어 전송할 수 없습니다.';
        break;
    }
    return message;
  }
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
      const error = e as any;
      if (error.response) {
        const errorMsg = this.GetApiError(error.response.data);
        moduleModal.AddMessage({ errorType: M.Messagetype.E_ERROR, time: 3, message: errorMsg });
        return error.response;
      } else {
        moduleModal.AddMessage({
          errorType: M.Messagetype.E_ERROR,
          time: 3,
          message: (e as Error).message
        });
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
      const error = e as any;
      if (error.response) {
        const errorMsg = this.GetApiError(error.response.data);
        moduleModal.AddMessage({ errorType: M.Messagetype.E_ERROR, time: 3, message: errorMsg });
        return error.response;
      } else {
        moduleModal.AddMessage({
          errorType: M.Messagetype.E_ERROR,
          time: 3,
          message: (e as Error).message
        });
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
      const error = e as any;
      if (error.response) {
        const errorMsg = this.GetApiError(error.response.data);
        moduleModal.AddMessage({ errorType: M.Messagetype.E_ERROR, time: 3, message: errorMsg });
        return error.response;
      } else {
        moduleModal.AddMessage({
          errorType: M.Messagetype.E_ERROR,
          time: 3,
          message: (e as Error).message
        });
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
        Show: (data: P.ReqConv) =>
          this.get<P.ReqConv, I.Tweet>(baseUrl + '/statuses/show.json', { data }),
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
          this.post<P.ReqCreate, I.Tweet>(baseUrl + '/favorites/destroy.json', { data }),
        List: (data: P.ReqTimeLine) =>
          this.post<P.ReqTimeLine, I.Tweet[]>(baseUrl + 'favorites/list.json', { data })
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
      users: {
        Show: (data: P.ReqShow) =>
          this.get<P.ReqShow, I.User>(baseUrl + '/users/show.json', {
            data
          })
      },
      followers: {
        List: (data: P.ReqList) =>
          this.get<P.ReqShow, I.FollowerList>(baseUrl + '/followers/list.json', {
            data
          }),
        Ids: (data: P.ReqBlockIds) =>
          this.get<P.ReqBlockIds, I.BlockIds>(baseUrl + '/followers/ids.json', {
            data
          })
      },
      friends: {
        List: (data: P.ReqList) =>
          this.get<P.ReqShow, I.FollowerList>(baseUrl + '/friends/list.json', {
            data
          }),
        Ids: (data: P.ReqBlockIds) =>
          this.get<P.ReqBlockIds, I.BlockIds>(baseUrl + '/friends/ids.json', {
            data
          })
      },
      friendships: {
        Create: (data: P.ReqFollowCreate) =>
          this.post<P.ReqShow, I.User>(baseUrl + '/friendships/create.json', {
            data
          }),
        Destroy: (data: P.ReqFollowDestroy) =>
          this.post<P.ReqShow, I.User>(baseUrl + '/friendships/destroy.json', {
            data
          })
      },
      mutes: {
        Ids: (data: P.ReqMuteIds) =>
          this.get<P.ReqMuteIds, I.BlockIds>(baseUrl + '/mutes/users/ids.json', {
            data
          }),
        List: (data: P.ReqMuteList) =>
          this.get<P.ReqMuteList, I.BlockIds>(baseUrl + '/mutes/users/list.json', {
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
const twitterRequest = new TwitterRequest();
export default twitterRequest;
