import TweetTestData from './favorite_tweet.json';
import * as I from '@/Interfaces';

export class TweetDataManager {
  listTweet: I.Tweet[] | unknown; //테스트용
  homes: I.Tweet[];
  mentions: I.Tweet[];
  favorites: I.Tweet[];
  opens: I.Tweet[];

  constructor() {
    this.listTweet = TweetTestData as I.Tweet[] | unknown;
    this.homes = [];
    this.mentions = [];
    this.favorites = [];
    this.opens = [];
  }
}
