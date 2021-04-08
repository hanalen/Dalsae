/* eslint-disable @typescript-eslint/camelcase */
import * as I from '@/Interfaces';

class Tweets {
  homes: I.Tweet[];
  mentions: I.Tweet[];
  favorites: I.Tweet[];
  opens: I.Tweet[];
  constructor() {
    this.homes = [];
    this.mentions = [];
    this.favorites = [];
    this.opens = [];
  }
}

export class TweetDatas {
  listTweet: I.Tweet[] | unknown; //테스트용

  dicTweets: Map<string, Tweets>;

  constructor() {
    this.dicTweets = new Map();
  }

  CheckKey(id_str: string) {
    if (!this.dicTweets.has(id_str)) {
      this.dicTweets.set(id_str, new Tweets());
    }
  }

  AddHome(list: I.Tweet[], id_str: string) {
    this.CheckKey(id_str);
    const tweets = this.dicTweets.get(id_str)?.homes;
    //TODO 에러 처리 해야함
    if (!tweets) throw Error('No ListTweets');
    list.forEach(tweet => {
      tweets.push(tweet);
    });
  }
  AddMention(list: I.Tweet[], id_str: string) {
    this.CheckKey(id_str);

    const tweets = this.dicTweets.get(id_str)?.mentions;
    //TODO 에러 처리 해야함
    if (!tweets) throw Error('No ListTweets');
    list.forEach(tweet => {
      tweets.push(tweet);
    });
  }
}
