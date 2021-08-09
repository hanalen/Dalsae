export interface OAuthRes {
  oauth_token: string;
  oauth_token_secret: string;
  oauth_callback_confirmed: boolean;
  user_id: string;
  name: string;
  screen_name: string;
}
