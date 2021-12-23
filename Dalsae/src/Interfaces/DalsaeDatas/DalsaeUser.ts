/* eslint-disable @typescript-eslint/camelcase */
import * as I from '@/Interfaces';

export class DalsaeUser {
  name: string;
  screen_name: string;
  id: bigint;
  user_id: string;
  oauth_token: string;
  oauth_token_secret: string;
  user: I.User;
  constructor() {
    this.id = BigInt(0);
    this.name = '';
    this.screen_name = '';
    this.user_id = '';
    this.oauth_token = '';
    this.oauth_token_secret = '';
    this.user = new I.User();
  }
}
