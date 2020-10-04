/* eslint-disable @typescript-eslint/camelcase */
import AppKeys from './AppKeys';

export class OAuth {
  OAuthConsumerKey: string;
  OAuthConsumerSecret: string;
  OAuthSignatureMethod: string;
  OAuthSignature: string;
  OAuthVersion: string; //'1.0',
  OAuthTimestamp: string;
  oauth_callback: string;
  OAuthNonce: '';
  OAuthToken: ''; //사용자 공개키, 매번 입력 받는다
  UserSecretKey: ''; //사용자 비밀키, 매번 입력 받는다
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

  GetHeader(publicKey: string, secretKey: string) {
    return '';
  }
}
