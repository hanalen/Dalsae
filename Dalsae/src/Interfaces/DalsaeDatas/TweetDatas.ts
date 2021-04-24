/* eslint-disable @typescript-eslint/camelcase */
import * as I from '@/Interfaces';

export class Tweets {
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

  CheckKey(user_id_str: string) {
    if (!this.dicTweets.has(user_id_str)) {
      this.dicTweets.set(user_id_str, new Tweets());
    }
  }

  AddHome(tweet: I.Tweet | undefined, user_id_str: string) {
    if (!tweet) throw Error('No ListTweets');
    this.CheckKey(user_id_str);
    const tweets = this.dicTweets.get(user_id_str)?.homes;
    //TODO 에러 처리 해야함
    if (!tweets) throw Error('No ListTweets');
    tweets.push(tweet);
  }

  AddMention(tweet: I.Tweet | undefined, user_id_str: string) {
    if (!tweet) throw Error('No ListTweets');
    this.CheckKey(user_id_str);
    const tweets = this.dicTweets.get(user_id_str)?.mentions;
    //TODO 에러 처리 해야함
    if (!tweets) throw Error('No ListTweets');
    tweets.push(tweet);
  }

  AddHomeList(list: I.Tweet[] | undefined, user_id_str: string) {
    this.CheckKey(user_id_str);
    if (!list) throw Error('No ListTweets');
    const tweets = this.dicTweets.get(user_id_str)?.homes;
    //TODO 에러 처리 해야함
    if (!tweets) throw Error('No ListTweets');
    list.forEach(tweet => {
      tweets.push(tweet);
    });
  }
  AddMentionList(list: I.Tweet[] | undefined, user_id_str: string) {
    if (!list) throw Error('No ListTweets');
    this.CheckKey(user_id_str);

    const tweets = this.dicTweets.get(user_id_str)?.mentions;
    //TODO 에러 처리 해야함
    if (!tweets) throw Error('No ListTweets');
    list.forEach(tweet => {
      tweets.push(tweet);
    });
  }
}
