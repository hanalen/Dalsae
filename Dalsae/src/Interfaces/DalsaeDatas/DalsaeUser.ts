/* eslint-disable @typescript-eslint/camelcase */
import * as I from '@/Interfaces';

export class DalsaeUser {
  name: string;
  screen_name: string;
  user_id: string;
  oauth_token: string;
  oauth_token_secret: string;
  user: I.User;
  constructor() {
    this.name = '';
    this.user_id = '';
    this.screen_name = '';
    this.oauth_token = '';
    this.oauth_token_secret = '';
    this.user = new I.User();
  }
}
