/* eslint-disable @typescript-eslint/camelcase */
import * as I from '@/Interfaces';

export class User {
  name: string;
  id: bigint;
  id_str!: string;
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
  profile_image_url_https: string;
  profile_banner_url: string;
  has_extended_profile: boolean;
  default_profile: boolean;
  default_profile_image: boolean;
  following: boolean;
  follow_request_sent: boolean;
  last_direct_message?: I.DMEvent; //dm페이지 전용으로 추가한 값
  constructor(user?: User) {
    if (user) {
      this.id = BigInt(user.id_str);
      this.created_at = user.created_at;
      this.default_profile = user.default_profile;
      this.default_profile_image = user.default_profile_image;
      this.description = user.description;
      this.favourites_count = user.favourites_count;
      this.follow_request_sent = user.follow_request_sent;
      this.followers_count = user.followers_count;
      this.following = user.following;
      this.friends_count = user.friends_count;
      this.has_extended_profile = user.has_extended_profile;
      this.listed_count = user.listed_count;
      this.location = user.location;
      this.name = user.name;
      this.profile_banner_url = user.profile_banner_url;
      this.profile_image_url_https = user.profile_image_url_https;
      this.protected = user.protected;
      this.screen_name = user.screen_name;
      this.statuses_count = user.statuses_count;
      this.verified = user.verified;
      this.entities = user.entities;
    } else {
      this.id = BigInt(0);
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
      this.profile_banner_url = '';
      this.profile_image_url_https = '';
      this.protected = false;
      this.screen_name = '';
      this.statuses_count = 0;
      this.verified = false;
      this.entities = { description: { urls: [] }, url: { urls: [] } };
    }
  }
}
