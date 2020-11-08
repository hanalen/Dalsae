import * as I from '@/Interfaces';

export interface DalsaeUser {
  name: string;
  oauth_token: string;
  oauth_token_secret: string;
  user?: I.User;
}
