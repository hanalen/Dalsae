/* eslint-disable @typescript-eslint/camelcase */
import * as I from '@/Interfaces';
export class Tweet {
  created_at: string;
  id: bigint;
  id_str!: string;
  full_text: string;
  entities: I.Entitie;
  extended_entities: I.ExtendedEntitie;
  retweeted_status!: Tweet | undefined;
  in_reply_to_status_id: bigint;
  in_reply_to_status_id_str!: string;
  in_reply_to_user_id: bigint;
  in_reply_to_user_id_str!: string;
  in_reply_to_screen_name!: string;
  quoted_status!: Tweet;
  user!: I.User;
  place!: string;
  is_quote_status: boolean;
  quoted_status_id!: bigint;
  quoted_status_id_str!: string;
  retweet_count!: number;
  favorite_count!: number;
  favorited: boolean;
  retweeted: boolean;
  source: string;
  isRead: boolean;
  isDelete: boolean;

  constructor(tweet?: Tweet) {
    if (tweet) {
      this.created_at = tweet.created_at;
      this.full_text = tweet.full_text;
      this.is_quote_status = tweet.is_quote_status;
      this.favorited = tweet.favorited;
      this.retweeted = tweet.retweeted;
      this.source = tweet.source;
      this.entities = tweet.entities;
      this.extended_entities = tweet.extended_entities;
      this.user = tweet.user;
      this.retweeted_status = tweet.retweeted_status;
      this.retweet_count = tweet.retweet_count;
      this.favorite_count = tweet.favorite_count;
      this.place = tweet.place;
      this.is_quote_status = tweet.is_quote_status;
      this.quoted_status = tweet.quoted_status;
      this.quoted_status = tweet.quoted_status;
      this.isRead = false;

      this.id = BigInt(tweet.id_str);
      if (tweet.in_reply_to_status_id_str) {
        this.in_reply_to_status_id = BigInt(tweet.in_reply_to_status_id);
      }
      if (tweet.in_reply_to_user_id_str) {
        this.in_reply_to_user_id = BigInt(tweet.in_reply_to_user_id);
      }
      if (tweet.quoted_status_id_str) {
        this.quoted_status_id = BigInt(tweet.quoted_status_id_str);
      }
      if (tweet.retweeted_status) {
        this.retweeted_status = new Tweet(tweet.retweeted_status);
      }
      if (tweet.in_reply_to_status_id_str) {
        this.in_reply_to_status_id = BigInt(tweet.in_reply_to_status_id_str);
      } else {
        this.in_reply_to_status_id = BigInt(0);
      }
      if (tweet.in_reply_to_user_id_str) {
        this.in_reply_to_user_id = BigInt(tweet.in_reply_to_user_id_str);
      } else {
        this.in_reply_to_user_id = BigInt(0);
      }
      this.isDelete = false;
    } else {
      this.created_at = '';
      this.in_reply_to_status_id = BigInt(0);
      this.in_reply_to_user_id = BigInt(0);
      this.id = BigInt(0);
      this.full_text = '';
      this.is_quote_status = false;
      this.favorited = false;
      this.retweeted = false;
      this.source = '';
      this.entities = new I.Entitie();
      this.extended_entities = { media: [] };
      this.isRead = false;
      this.isDelete = false;
    }
  }

  get media(): I.Media[] {
    if (this.orgTweet.extended_entities) return this.orgTweet.extended_entities.media;
    else return [];
  }

  get orgTweet(): Tweet {
    if (this.retweeted_status) return this.retweeted_status;
    else return this;
  }

  get orgUser(): I.User {
    return this.orgTweet.user;
  }
}
