/* eslint-disable @typescript-eslint/camelcase */
import AppKeys from './AppKeys';
import * as P from '@/Interfaces/Packets';
import CryptoJS from 'crypto-js';

export class OAuth {
  OAuthConsumerKey: string;
  OAuthConsumerSecret: string;
  OAuthSignatureMethod: string;
  OAuthSignature: string;
  OAuthVersion: string; //'1.0',
  OAuthTimestamp: string;
  oauth_callback: string;
  OAuthNonce: string;
  OAuthToken: string; //사용자 공개키, 매번 입력 받는다
  UserSecretKey: string; //사용자 비밀키, 매번 입력 받는다
  constructor() {
    this.OAuthConsumerKey = AppKeys.ConsumerKey;
    this.OAuthConsumerSecret = AppKeys.ConsumerSecretKey;
    this.OAuthSignatureMethod = 'HMAC-SHA1';
    this.OAuthSignature = '';
    this.OAuthVersion = '1.0';
    this.OAuthTimestamp = '';
    this.oauth_callback = 'oob';
    this.OAuthNonce = '';
    this.OAuthToken = '';
    this.UserSecretKey = '';
  }

  SetKey(publicKey: string, secretKey: string) {
    this.UserSecretKey = secretKey;
    this.OAuthToken = publicKey;
  }

  UrlEncode(value: string) {
    if (value == undefined || value == '') return value;
    if (typeof value != 'string') return value;
    let ret = value;
    ret = ret.replace(/!/gi, '%21');
    ret = ret.replace(/\(/gi, '%28');
    ret = ret.replace(/\)/gi, '%29');
    ret = ret.replace(/\*/gi, '%2A');
    ret = ret.replace(/\'/gi, '%27');
    return ret;
  }

  CalcParamUri(text: string): string {
    let str = '';
    const limit = 100;
    if (text == undefined) return str;
    if (text.length > limit) {
      //media등은 길어서 나눠서 해야됨
      const loops = text.length / limit;
      let i = 0;
      for (i = 0; i <= loops; i++) {
        if (i < loops) {
          str += encodeURIComponent(text.substring(100 * i, limit));
        } else {
          str += encodeURIComponent(text.substring(limit * i));
        }
      }
    } else {
      str += encodeURIComponent(text);
    }
    str = this.UrlEncode(str);
    return str;
  }

  //data json의 key를 얻어야 함
  CreateBody<TReq>(params: P.APIReq<TReq> | undefined): string {
    if (!params) return '';

    let str = '';
    Object.entries(params) //params 오브젝트의 파라메터 이름, 값을 얻는 코드
      .sort()
      .forEach(([key, value]) => {
        if (!value) str += `${key}=${this.CalcParamUri(value)}&`;
      });
    str += '&';
    return str.substring(0, str.length - 1); //마지막& 지우기
  }

  GetUrl<TReq>(params: P.APIReq<TReq> | undefined, method: P.Method, url: string): string {
    if (method == 'POST') {
      return url;
    } else if (method == 'GET') {
      if (params) {
        let str = url + '?';
        Object.entries(params) //params 오브젝트의 파라메터 이름, 값을 얻는 코드
          .sort()
          .forEach(([key, value]) => {
            if (!value) str += `${key}=${encodeURIComponent(value)}&`;
          });
        return str.substring(0, str.length - 1); //마지막& 지우기
      } else {
        return url;
      }
    }
    return url;
  }
  GetHeader<TReq>(params: P.APIReq<TReq> | undefined, method: P.Method, url: string) {
    this.CalcSignature(params, method, url);

    const parseObj = Object.assign(this, params);

    let str = 'OAuth ';
    Object.entries(parseObj) //params 오브젝트의 파라메터 이름, 값을 얻는 코드
      .sort()
      .forEach(([key, value]) => {
        if (value) {
          str += `${key}="${this.CalcParamUri(value)}",`;
        }
      });

    str = str.substring(0, str.length - 1); //마지막, 지우기
    return str;
  }

  CreateTimeStamp() {
    this.OAuthTimestamp = Math.floor(Date.now() / 1000).toString(); //timestamp용 계산
  }

  CreateOAuthNonce() {
    const tick = Date.now() * 10000 + 62135596800; //원소스
    this.OAuthNonce = this.StringToBase64(tick.toString());
  }

  StringToBase64(str: string) {
    str = str.toString();
    const arr: number[] = [];
    for (let i = 0; i < str.length; i++) arr.push(str[i].charCodeAt(0));
    return btoa(String.fromCharCode.apply(null, arr));
    // return btoa(String.fromCharCode.apply(null, new Uint8Array(new Buffer(str, 'ascii'))));
  }

  CalcSignature<TReq>(params: P.APIReq<TReq> | undefined, method: P.Method, url: string) {
    this.CreateTimeStamp();
    this.CreateOAuthNonce();

    const parseObj = Object.assign(this, params);

    let str = '';
    Object.entries(parseObj) //params 오브젝트의 파라메터 이름, 값을 얻는 코드
      .sort()
      .forEach(([key, value]) => {
        if (value) {
          str += `${key}=${this.CalcParamUri(value)}&`;
        }
      });

    str = str.substring(0, str.length - 1); //마지막& 지우기
    const baseStr = this.CalcBaseString(method, url, str);

    const signKey = this.UserSecretKey
      ? `${this.OAuthConsumerKey}&${this.UserSecretKey}`
      : `${this.OAuthConsumerKey}&`;

    this.OAuthSignature = CryptoJS.HmacSHA1(baseStr, signKey).toString();
  }

  CalcBaseString(method: P.Method, url: string, paramStr: string) {
    return method + '&' + this.CalcParamUri(url) + '&' + this.CalcParamUri(paramStr);
  }
}
