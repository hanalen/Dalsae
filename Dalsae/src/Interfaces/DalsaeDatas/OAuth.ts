/* eslint-disable @typescript-eslint/camelcase */
import AppKeys from './AppKeys';
import * as P from '@/Interfaces/Packets';
import CryptoJS from 'crypto-js';

export class OAuth {
  oauth_version: string; //'1.0',
  oauth_consumer_key: string;
  oauth_signature_method: string;
  oauth_timestamp: string;
  oauth_nonce: string;
  oauth_consumer_secret: string;
  oauth_signature: string;
  oauth_token: string; //사용자 공개키, 매번 입력 받는다
  user_secret_key: string; //사용자 비밀키, 매번 입력 받는다
  constructor() {
    this.oauth_consumer_key = AppKeys.ConsumerKey;
    this.oauth_consumer_secret = AppKeys.ConsumerSecretKey;
    this.oauth_signature_method = 'HMAC-SHA1';
    this.oauth_signature = '';
    this.oauth_version = '1.0';
    this.oauth_timestamp = '';
    this.oauth_nonce = '';
    this.oauth_token = '';
    this.user_secret_key = '';
  }

  SetKey(publicKey: string, secretKey: string) {
    this.user_secret_key = secretKey;
    this.oauth_token = publicKey;
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
      const loops = Math.ceil(text.length / limit);
      let i = 0;
      for (i = 0; i < loops; i++) {
        str += encodeURIComponent(text.substring(100 * i, (i + 1) * limit));
      }
    } else {
      str += encodeURIComponent(text);
    }
    str = this.UrlEncode(str);
    return str;
  }

  //data json의 key를 얻어야 함
  CreateBody<TReq>(params: P.APIReq<TReq> | undefined): string {
    if (!params || !params.data) return '';

    let str = '';
    console.log(Object.entries(params));
    Object.entries(params.data) //params 오브젝트의 파라메터 이름, 값을 얻는 코드
      .sort()
      .forEach(([key, value]) => {
        if (value) str += `${key}=${this.CalcParamUri(value)}&`;
      });
    str += '&';
    return str.substring(0, str.length - 1); //마지막& 지우기
  }

  GetUrl<TReq>(params: P.APIReq<TReq> | undefined, method: P.Method, url: string): string {
    if (method == 'POST') {
      return url;
    } else if (method == 'GET') {
      if (params?.data) {
        let str = url + '?';
        Object.entries(params.data) //params 오브젝트의 파라메터 이름, 값을 얻는 코드
          .sort()
          .forEach(([key, value]) => {
            console.log('key: ' + key + 'value: ' + value);
            if (value) str += `${key}=${encodeURIComponent(value)}&`;
          });
        return str.substring(0, str.length - 1); //마지막& 지우기
      } else {
        return url;
      }
    }
    return url;
  }
  GetHeader<TReq>(params: P.APIReq<TReq> | undefined, method: P.Method, url: string) {
    this.CalcSignature(params?.data, method, url);

    const parseObj = Object.assign(this, params?.data);

    let str = 'OAuth ';
    Object.entries(parseObj) //params 오브젝트의 파라메터 이름, 값을 얻는 코드
      .forEach(([key, value]) => {
        if (value && key.indexOf('secret') === -1) {
          str += `${key}="${this.CalcParamUri(value)}",`;
        }
      });
    str = str.substring(0, str.length - 1); //마지막, 지우기
    return str;
  }

  CreateTimeStamp() {
    this.oauth_timestamp = Math.floor(Date.now() / 1000).toString(); //timestamp용 계산
  }

  CreateOAuthNonce() {
    const tick = Date.now() * 10000 + 62135596800;
    this.oauth_nonce = this.StringToBase64(tick.toString());
  }

  StringToBase64(str: string) {
    str = str.toString();
    const arr: number[] = [];
    for (let i = 0; i < str.length; i++) arr.push(str[i].charCodeAt(0));
    return btoa(String.fromCharCode.apply(null, arr));
  }

  CalcSignature<TReq>(params: P.APIReq<TReq> | undefined, method: P.Method, url: string) {
    this.CreateTimeStamp();
    this.CreateOAuthNonce();

    const parseObj = Object.assign(this, params);

    let str = '';
    Object.entries(parseObj) //params 오브젝트의 파라메터 이름, 값을 얻는 코드
      .sort()
      .forEach(([key, value]) => {
        if (value && key.indexOf('secret') === -1) {
          str += `${key}=${this.CalcParamUri(value)}&`;
        }
      });

    str = str.substring(0, str.length - 1); //마지막& 지우기
    const baseStr = this.CalcBaseString(method, url, str);
    const signKey = this.user_secret_key
      ? `${this.oauth_consumer_secret}&${this.user_secret_key}`
      : `${this.oauth_consumer_secret}&`;
    const hash = CryptoJS.HmacSHA1(baseStr, signKey);
    const strHash = CryptoJS.enc.Base64.stringify(hash);
    this.oauth_signature = strHash;
  }

  CalcBaseString(method: P.Method, url: string, paramStr: string) {
    return method + '&' + this.CalcParamUri(url) + '&' + this.CalcParamUri(paramStr);
  }
}
