/* eslint-disable @typescript-eslint/camelcase */
import * as I from '@/Interfaces';

export class User {
  name: string;
  id_str: string;
  screen_name: string;
  location: string;
  description: string;
  url?: string;
  entities: I.UserEntitie;
  protected: boolean;
  followers_count: number; //팔로워 수
  friends_count: number; //팔로잉 수
  created_at: string;
  listed_count: number;
  favourites_count: number;
  verified: boolean; //공식 계정
  statuses_count: number;
  profile_background_color: string;
  profile_background_image_url: string;
  profile_background_image_url_https: string;
  profile_background_tile: boolean;
  profile_image_url: string;
  profile_image_url_https: string;
  profile_banner_url: string;
  profile_link_color: string;
  profile_sidebar_border_color: string;
  profile_sidebar_fill_color: string;
  has_extended_profile: boolean;
  default_profile: boolean;
  default_profile_image: boolean;
  following: boolean;
  follow_request_sent: boolean;
  last_direct_message?: I.DMEvent; //dm페이지 전용으로 추가한 값
  constructor() {
    this.created_at = '';
    this.default_profile = false;
    this.default_profile_image = false;
    this.description = '';
    this.favourites_count = 0;
    this.follow_request_sent = false;
    this.followers_count = 0;
    this.following = false;
    this.friends_count = 0;
    this.has_extended_profile = false;
    this.id_str = '';
    this.listed_count = 0;
    this.location = '';
    this.name = '';
    this.profile_background_color = '';
    this.profile_background_image_url = '';
    this.profile_background_image_url_https = '';
    this.profile_background_tile = false;
    this.profile_banner_url = '';
    this.profile_image_url = '';
    this.profile_image_url_https = '';
    this.profile_link_color = '';
    this.profile_sidebar_border_color = '';
    this.profile_sidebar_fill_color = '';
    this.protected = false;
    this.screen_name = '';
    this.statuses_count = 0;
    this.verified = false;
    this.entities = { description: { urls: [] }, url: { urls: [] } };
  }
}
