import * as I from '@/Interfaces';

export interface User {
  name: string;
  id_str: string;
  screen_name: string;
  location: string;
  description: string;
  url: I.Url;
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
}
