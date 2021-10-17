/* eslint-disable @typescript-eslint/camelcase */
import * as I from '@/Interfaces';
import * as M from '@/mixins';
import { eventBus } from '@/plugins';
import { ETweetType } from '@/store/Interface';
export class Tweets {
  homes: M.ScrollItem<I.Tweet>[];
  mentions: M.ScrollItem<I.Tweet>[];
  favorites: M.ScrollItem<I.Tweet>[];
  opens: M.ScrollItem<I.Tweet>[];
  conv: M.ScrollItem<I.Tweet>[];
  constructor() {
    this.homes = [];
    this.mentions = [];
    this.favorites = [];
    this.opens = [];
    this.conv = [];
  }
}

const minHeight = 40;

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
    const date = new Date(tweet.created_at).getTime();
    let idx = 0;
    for (let i = 0, len = list.length; i < len; i++) {
      const next = new Date(list[i].data.created_at).getTime();
      if (date > next) {
        break;
      }
      idx = i + 1;
    }
    return idx;
  }

  AddHome(tweet: I.Tweet | undefined, user_id_str: string) {
    if (!tweet) throw Error('No ListTweets');
    this.CheckKey(user_id_str);
    const tweets = this.dicTweets.get(user_id_str)?.homes;
    //TODO 에러 처리 해야함
    if (!tweets) throw Error('No ListTweets');
    if (tweets.find(x => x.key === tweet.id_str)) return; //exists
    const idx = this.FindIndex(tweet, tweets);
    tweets.splice(idx, 0, {
      data: new I.Tweet(tweet),
      height: minHeight,
      isResized: true,
      key: tweet.id_str,
      scrollTop: idx * minHeight
    });
    eventBus.$emit('AddedTweet', ETweetType.E_HOME);
  }

  AddMention(tweet: I.Tweet | undefined, user_id_str: string) {
    if (!tweet) throw Error('No ListTweets');
    this.CheckKey(user_id_str);
    const tweets = this.dicTweets.get(user_id_str)?.mentions;
    //TODO 에러 처리 해야함
    if (!tweets) throw Error('No ListTweets');
    if (tweets.find(x => x.key === tweet.id_str)) return; //exists
    const idx = this.FindIndex(tweet, tweets);
    tweets.splice(idx, 0, {
      data: new I.Tweet(tweet),
      height: minHeight,
      isResized: true,
      key: tweet.id_str,
      scrollTop: idx * minHeight
    });
    eventBus.$emit('AddedTweet', ETweetType.E_MENTION);
  }

  AddHomeList(list: I.Tweet[] | undefined, user_id_str: string) {
    this.CheckKey(user_id_str);
    if (!list) throw Error('No ListTweets');
    const tweets = this.dicTweets.get(user_id_str)?.homes;
    //TODO 에러 처리 해야함
    if (!tweets) throw Error('No ListTweets');
    list.forEach(tweet => {
      if (!tweets.find(x => x.key === tweet.id_str)) {
        const idx = this.FindIndex(tweet, tweets);
        tweets.splice(idx, 0, {
          data: new I.Tweet(tweet),
          height: minHeight,
          isResized: true,
          key: tweet.id_str,
          scrollTop: idx * minHeight
        });
      }
    });
    eventBus.$emit('AddedTweet', ETweetType.E_HOME);
  }
  AddMentionList(list: I.Tweet[] | undefined, user_id_str: string) {
    if (!list) throw Error('No ListTweets');
    this.CheckKey(user_id_str);

    const tweets = this.dicTweets.get(user_id_str)?.mentions;
    //TODO 에러 처리 해야함
    if (!tweets) throw Error('No ListTweets');
    list.forEach(tweet => {
      if (!tweets.find(x => x.key === tweet.id_str)) {
        const idx = this.FindIndex(tweet, tweets);
        tweets.splice(idx, 0, {
          data: new I.Tweet(tweet),
          height: minHeight,
          isResized: true,
          key: tweet.id_str,
          scrollTop: idx * minHeight
        });
      }
    });
    eventBus.$emit('AddedTweet', ETweetType.E_MENTION);
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
  MoveScroll(listTweet: M.ScrollItem<I.Tweet>[], idxFrom: number, height: number) {
    listTweet[idxFrom].height = height;
    listTweet[idxFrom].isResized = false;
    let total = listTweet[idxFrom].scrollTop + listTweet[idxFrom].height;
    for (let i = idxFrom + 1, len = listTweet.length; i < len; i++) {
      listTweet[i].scrollTop = total;
      total += listTweet[i].height;
    }
  }
}
