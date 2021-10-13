/* eslint-disable @typescript-eslint/camelcase */
import * as I from '@/Interfaces';

export class Tweet {
  created_at: string;
  id_str: string;
  full_text: string;
  entities: I.Entitie;
  extended_entities: I.ExtendedEntitie;
  retweeted_status!: Tweet | undefined;
  in_reply_to_status_id_str!: string;
  in_reply_to_user_id_str!: string;
  in_reply_to_screen_name!: string;
  user!: I.User;
  place!: string;
  is_quote_status: boolean;
  retweet_count!: number;
  favorite_count!: number;
  favorited: boolean;
  retweeted: boolean;
  source: string;

  constructor() {
    this.created_at = '';
    this.id_str = '';
    this.full_text = '';
    this.is_quote_status = false;
    this.favorited = false;
    this.retweeted = false;
    this.source = '';
    this.entities = {
      hashtags: [],
      urls: [],
      user_mentions: [],
      media: [
        {
          id_str: '',
          media_url_https: '',
          url: '',
          display_url: '',
          expanded_url: '',
          type: ''
        }
      ]
    };
    this.extended_entities = { media: [] };
  }

  get orgTweet(): I.Tweet {
    return this.retweeted_status ? this.retweeted_status : this; //원본 트윗 저장
  }

  get orgUser() {
    return this.orgTweet.user;
  }

  get media() {
    return this.orgTweet.extended_entities?.media;
  }
}
