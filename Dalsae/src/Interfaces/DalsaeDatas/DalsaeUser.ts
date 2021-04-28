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
    this.screen_name = '';
    this.user_id = '';
    this.oauth_token = '';
    this.oauth_token_secret = '';
    this.user = {
      created_at: '',
      default_profile: false,
      default_profile_image: false,
      description: '',
      favourites_count: 0,
      follow_request_sent: false,
      followers_count: 0,
      following: false,
      friends_count: 0,
      has_extended_profile: false,
      id_str: '',
      listed_count: 0,
      location: '',
      name: '',
      profile_background_color: '',
      profile_background_image_url: '',
      profile_background_image_url_https: '',
      profile_background_tile: false,
      profile_banner_url: '',
      profile_image_url: '',
      profile_image_url_https: '',
      profile_link_color: '',
      profile_sidebar_border_color: '',
      profile_sidebar_fill_color: '',
      protected: false,
      screen_name: '',
      statuses_count: 0,
      verified: false
    };
  }
}
