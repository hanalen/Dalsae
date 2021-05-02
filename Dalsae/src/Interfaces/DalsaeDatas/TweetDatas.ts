/* eslint-disable @typescript-eslint/camelcase */
import * as I from '@/Interfaces';
import * as M from '@/mixins';
export class Tweets {
  homes: M.ScrollItem<I.Tweet>[];
  mentions: M.ScrollItem<I.Tweet>[];
  favorites: M.ScrollItem<I.Tweet>[];
  opens: M.ScrollItem<I.Tweet>[];
  constructor() {
    this.homes = [];
    this.mentions = [];
    this.favorites = [];
    this.opens = [];
  }
}

const minHeight = 0;

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

  FindIndex(tweet: I.Tweet, list: M.ScrollItem<I.Tweet>[]) {
    const date = new Date(tweet.created_at);
    let idx = 0;
    for (let i = 0, len = list.length; i < len; i++) {
      if (date > new Date(list[i].data.created_at)) {
        idx = i;
        break;
      }
    }
    return idx;
  }

  AddHome(tweet: I.Tweet | undefined, user_id_str: string) {
    if (!tweet) throw Error('No ListTweets');
    this.CheckKey(user_id_str);
    const tweets = this.dicTweets.get(user_id_str)?.homes;
    //TODO 에러 처리 해야함
    if (!tweets) throw Error('No ListTweets');
    const idx = this.FindIndex(tweet, tweets);
    tweets.splice(idx, 0, {
      data: tweet,
      height: minHeight,
      isResized: true,
      key: tweet.id_str,
      scrollTop: idx * minHeight
    });
  }

  AddMention(tweet: I.Tweet | undefined, user_id_str: string) {
    if (!tweet) throw Error('No ListTweets');
    this.CheckKey(user_id_str);
    const tweets = this.dicTweets.get(user_id_str)?.mentions;
    //TODO 에러 처리 해야함
    if (!tweets) throw Error('No ListTweets');
    const idx = this.FindIndex(tweet, tweets);
    tweets.splice(idx, 0, {
      data: tweet,
      height: minHeight,
      isResized: true,
      key: tweet.id_str,
      scrollTop: idx * minHeight
    });
  }

  AddHomeList(list: I.Tweet[] | undefined, user_id_str: string) {
    this.CheckKey(user_id_str);
    if (!list) throw Error('No ListTweets');
    const tweets = this.dicTweets.get(user_id_str)?.homes;
    //TODO 에러 처리 해야함
    if (!tweets) throw Error('No ListTweets');
    list.forEach(tweet => {
      const idx = this.FindIndex(tweet, tweets);
      tweets.splice(idx, 0, {
        data: tweet,
        height: minHeight,
        isResized: true,
        key: tweet.id_str,
        scrollTop: idx * minHeight
      });
    });
  }
  AddMentionList(list: I.Tweet[] | undefined, user_id_str: string) {
    if (!list) throw Error('No ListTweets');
    this.CheckKey(user_id_str);

    const tweets = this.dicTweets.get(user_id_str)?.mentions;
    //TODO 에러 처리 해야함
    if (!tweets) throw Error('No ListTweets');
    list.forEach(tweet => {
      const idx = this.FindIndex(tweet, tweets);
      tweets.splice(idx, 0, {
        data: tweet,
        height: minHeight,
        isResized: true,
        key: tweet.id_str,
        scrollTop: idx * minHeight
      });
    });
  }
  OnResized() {
    this.dicTweets.forEach(item => {
      for (let i = 0, len = item.homes.length; i < len; i++) {
        item.homes[i].isResized = true;
      }
      for (let i = 0, len = item.mentions.length; i < len; i++) {
        item.mentions[i].isResized = true;
      }
      for (let i = 0, len = item.favorites.length; i < len; i++) {
        item.favorites[i].isResized = true;
      }
      for (let i = 0, len = item.opens.length; i < len; i++) {
        item.opens[i].isResized = true;
      }
    });
  }
  MoveScroll(listTweet: M.ScrollItem<I.Tweet>[], idxFrom: number, moveY: number) {
    for (let i = idxFrom, len = listTweet.length; i < len; i++) {
      listTweet[i].scrollTop += moveY;
    }
  }
}
