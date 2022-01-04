/* eslint-disable @typescript-eslint/camelcase */
import * as I from '@/Interfaces';
import * as M from '@/mixins';
import { eventBus } from '@/plugins';
import { ETweetType } from '@/store/Interface';
export class Tweets {
  homes: I.Tweet[];
  mentions: I.Tweet[];
  favorites: I.Tweet[];
  opens: I.Tweet[];
  conv: I.Tweet[];
  user: I.Tweet[];
  constructor() {
    this.homes = [];
    this.mentions = [];
    this.favorites = [];
    this.opens = [];
    this.conv = [];
    this.user = [];
  }
}
export function FindTweet(
  tweetIdStr: string,
  userIdStr: string,
  homes: I.Tweet[] | undefined,
  mentions: I.Tweet[] | undefined
) {
  if (!homes || !mentions) return;
  const findA = homes.find(x => x.id_str === tweetIdStr);
  if (findA) return findA;
  const findB = mentions.find(x => x.id_str === tweetIdStr);
  if (findB) return findB;
  return undefined;
}
export function FindTweetIndex(tweet: I.Tweet, list: I.Tweet[]) {
  const date = new Date(tweet.created_at).getTime();
  let idx = 0;
  for (let i = 0, len = list.length; i < len; i++) {
    const next = new Date(list[i].created_at).getTime();
    if (date > next) {
      break;
    }
    idx = i + 1;
  }
  return idx;
}
export function CheckMention(tweet: I.Tweet, userIdStr: string, muteOption: I.MuteOption): boolean {
  if (tweet.entities.user_mentions.map(x => x.id_str).includes(userIdStr)) return true;

  const { highlight } = muteOption;
  for (let i = 0; i < highlight.length; i++) {
    if (tweet.full_text.indexOf(highlight[i]) > -1) {
      return true;
    }
  }

  return false;
}

export function CheckBlock(tweet: I.Tweet, blockIds: string[]): boolean {
  const ids: string[] = [];
  if (tweet.retweeted_status) ids.push(tweet.retweeted_status.user.id_str);
  ids.push(tweet.user.id_str);
  ids.concat(tweet.entities.user_mentions.map(x => x.id_str));
  for (let i = 0; i < ids.length; i++) {
    if (blockIds.includes(ids[i])) return true;
  }
  // const orgTweet = tweet.retweeted_status ? tweet.retweeted_status : tweet;
  // if (orgTweet.is_quote_status && !orgTweet.quoted_status) return true; //인용트윗이 차단한 유저일 경우
  return false;
}

export function CheckMute(
  tweet: I.Tweet,
  userIdStr: string,
  muteOption: I.MuteOption,
  muteIds: string[] | undefined
): boolean {
  const { client, keyword } = muteOption;
  const orgTweet = tweet.retweeted_status ? tweet.retweeted_status : tweet;
  let source = orgTweet.source;
  source = source.substring(source.indexOf('>') + 1, 999);
  source = source.substring(0, source.indexOf('<'));
  for (let i = 0; i < client.length; i++) {
    if (client.includes(source)) {
      return true;
    }
  }

  for (let i = 0; i < keyword.length; i++) {
    if (tweet.full_text.toUpperCase().indexOf(keyword[i].toUpperCase()) > -1) {
      return true;
    }
  }

  const tweetIds = muteOption.tweet.map(x => x.id_str);

  for (let i = 0; i < tweetIds.length; i++) {
    if (tweetIds.includes(orgTweet.id_str)) return true;
    else if (tweetIds.includes(orgTweet.in_reply_to_status_id_str)) return true;
    else if (tweetIds.includes(orgTweet.quoted_status?.id_str)) return true;
  }
  //TODO 공홈에서 땡겨온 유저 뮤트 목록이랑 연동 필요
  if (muteIds) {
    for (let i = 0; i < muteIds.length; i++) {
      if (muteIds.includes(orgTweet.user.id_str)) return true;
      else if (muteIds.includes(tweet.user.id_str)) return true;
    }
  }
  return false;
}

export function CheckShowHomeTweet(
  tweet: I.Tweet,
  userIdStr: string,
  muteOption: I.MuteOption,
  blockIds: string[],
  muteIds: string[] | undefined
): boolean {
  if (CheckBlock(tweet, blockIds)) return false;
  if (CheckMute(tweet, userIdStr, muteOption, muteIds)) return false;
  return true;
}

export function CheckShowMentionTweet(
  tweet: I.Tweet,
  userIdStr: string,
  muteOption: I.MuteOption,
  blockIds: string[],
  muteIds: string[] | undefined
): boolean {
  if (CheckBlock(tweet, blockIds)) return false;
  if (CheckMute(tweet, userIdStr, muteOption, muteIds) && muteOption.isMuteMention) return false;
  return true;
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

  CheckShowHomeTweet(
    tweet: I.Tweet,
    userIdStr: string,
    muteOption: I.MuteOption,
    blockIds: string[],
    muteIds: string[]
  ): boolean {
    if (this.CheckBlock(tweet, blockIds)) return false;
    if (this.CheckMute(tweet, userIdStr, muteOption, muteIds)) return false;
    return true;
  }

  CheckShowMentionTweet(
    tweet: I.Tweet,
    userIdStr: string,
    muteOption: I.MuteOption,
    blockIds: string[],
    muteIds: string[]
  ): boolean {
    if (this.CheckBlock(tweet, blockIds)) return false;
    if (this.CheckMute(tweet, userIdStr, muteOption, muteIds) && muteOption.isMuteMention)
      return false;
    return true;
  }

  CheckMention(tweet: I.Tweet, userIdStr: string, muteOption: I.MuteOption): boolean {
    if (tweet.entities.user_mentions.map(x => x.id_str).includes(userIdStr)) return true;

    const { highlight } = muteOption;
    for (let i = 0; i < highlight.length; i++) {
      if (tweet.full_text.indexOf(highlight[i]) > -1) {
        return true;
      }
    }

    return false;
  }

  CheckBlock(tweet: I.Tweet, blockIds: string[]): boolean {
    const ids: string[] = [];
    if (tweet.retweeted_status) ids.push(tweet.retweeted_status.user.id_str);
    ids.push(tweet.user.id_str);
    ids.concat(tweet.entities.user_mentions.map(x => x.id_str));
    for (let i = 0; i < ids.length; i++) {
      if (blockIds.includes(ids[i])) return true;
    }
    return false;
  }

  CheckMute(
    tweet: I.Tweet,
    userIdStr: string,
    muteOption: I.MuteOption,
    muteIds: string[]
  ): boolean {
    const { client, keyword } = muteOption;
    const listTweet = muteOption.tweet;
    const orgTweet = tweet.retweeted_status ? tweet.retweeted_status : tweet;
    let source = orgTweet.source;
    source = source.substring(source.indexOf('>') + 1, 999);
    source = source.substring(0, source.indexOf('<'));
    for (let i = 0; i < client.length; i++) {
      if (client.includes(source)) {
        return true;
      }
    }

    for (let i = 0; i < keyword.length; i++) {
      if (tweet.full_text.toUpperCase().indexOf(keyword[i].toUpperCase()) > -1) {
        return true;
      }
    }

    const tweetIds = muteOption.tweet.map(x => x.id_str);

    for (let i = 0; i < tweetIds.length; i++) {
      if (tweetIds.includes(orgTweet.id_str)) return true;
    }
    //TODO 공홈에서 땡겨온 유저 뮤트 목록이랑 연동 필요

    for (let i = 0; i < muteIds.length; i++) {
      if (muteIds.includes(orgTweet.user.id_str)) return true;
      else if (muteIds.includes(tweet.user.id_str)) return true;
    }
    for (let i = 0; i < listTweet.length; i++) {
      if (listTweet[i].id_str === orgTweet.id_str) {
        return true;
      } else if (listTweet[i].id_str === orgTweet.in_reply_to_status_id_str) {
        return true;
      } else if (listTweet[i].id_str === orgTweet.quoted_status?.id_str) {
        return true;
      }
    }
    return false;
  }

  FindTweet(tweetIdStr: string, userIdStr: string) {
    const homes = this.dicTweets.get(userIdStr)?.homes;
    const mentions = this.dicTweets.get(userIdStr)?.mentions;
    if (!homes || !mentions) return;
    const findA = homes.find(x => x.id_str === tweetIdStr);
    if (findA) return findA;
    const findB = mentions.find(x => x.id_str === tweetIdStr);
    if (findB) return findB;
    return null;
  }

  FindIndex(tweet: I.Tweet, list: I.Tweet[]) {
    const date = new Date(tweet.created_at).getTime();
    let idx = 0;
    for (let i = 0, len = list.length; i < len; i++) {
      const next = new Date(list[i].created_at).getTime();
      if (date > next) {
        break;
      }
      idx = i + 1;
    }
    return idx;
  }

  AddHome(
    tweet: I.Tweet | undefined,
    user_id_str: string,
    muteOption: I.MuteOption,
    blockIds: string[],
    muteIds: string[]
  ) {
    if (!tweet) throw Error('No ListTweets');
    this.CheckKey(user_id_str);
    const tweets = this.dicTweets.get(user_id_str)?.homes;
    //TODO 에러 처리 해야함
    if (!tweets) throw Error('No ListTweets');
    if (tweets.find(x => x.id_str === tweet.id_str)) return; //exists
    if (!this.CheckShowHomeTweet(tweet, user_id_str, muteOption, blockIds, muteIds)) return; //muted
    //체크순서
    //멘션 -> 멘션으로 처리 넘김
    //!멘션->블락&뮤트 체크
    if (this.CheckMention(tweet, user_id_str, muteOption)) {
      this.AddMention(tweet, user_id_str, muteOption, blockIds, muteIds);
    } else {
      if (!this.CheckShowHomeTweet(tweet, user_id_str, muteOption, blockIds, muteIds)) return;
    }
    const idx = this.FindIndex(tweet, tweets);
    const prevTweet = tweets[idx - 1];
    // const scrollTop = prevTweet ? prevTweet.scrollTop + prevTweet.height : idx * minHeight;
    tweets.splice(idx, 0, new I.Tweet(tweet));
    eventBus.$emit('AddedTweet', ETweetType.E_HOME);
  }

  AddMention(
    tweet: I.Tweet | undefined,
    user_id_str: string,
    muteOption: I.MuteOption,
    blockIds: string[],
    muteIds: string[]
  ) {
    if (!tweet) throw Error('No ListTweets');
    this.CheckKey(user_id_str);
    const tweets = this.dicTweets.get(user_id_str)?.mentions;
    //TODO 에러 처리 해야함
    if (!tweets) throw Error('No ListTweets');
    if (tweets.find(x => x.id_str === tweet.id_str)) return; //exists
    if (!this.CheckShowMentionTweet(tweet, user_id_str, muteOption, blockIds, muteIds)) return; //muted
    const idx = this.FindIndex(tweet, tweets);
    // const prevTweet = tweets[idx - 1];
    // const scrollTop = prevTweet ? prevTweet.scrollTop + prevTweet.height : idx * minHeight;
    tweets.splice(idx, 0, new I.Tweet(tweet));
    eventBus.$emit('AddedTweet', ETweetType.E_MENTION);
  }

  AddHomeList(
    list: I.Tweet[] | undefined,
    user_id_str: string,
    muteOption: I.MuteOption,
    blockIds: string[],
    muteIds: string[]
  ) {
    this.CheckKey(user_id_str);
    if (!list) throw Error('No ListTweets');
    const tweets = this.dicTweets.get(user_id_str)?.homes;
    //TODO 에러 처리 해야함
    if (!tweets) throw Error('No ListTweets');
    list.forEach(tweet => {
      if (!tweets.find(x => x.id_str === tweet.id_str)) {
        if (!this.CheckShowHomeTweet(tweet, user_id_str, muteOption, blockIds, muteIds))
          return true; //muted
        if (this.CheckMention(tweet, user_id_str, muteOption)) {
          this.AddMention(tweet, user_id_str, muteOption, blockIds, muteIds);
        } else {
          if (!this.CheckShowHomeTweet(tweet, user_id_str, muteOption, blockIds, muteIds))
            return true;
        }
        const idx = this.FindIndex(tweet, tweets);
        // const prevTweet = tweets[idx - 1];
        // const scrollTop = prevTweet ? prevTweet.scrollTop + prevTweet.height : idx * minHeight;
        tweets.splice(idx, 0, new I.Tweet(tweet));
      }
    });
    eventBus.$emit('AddedTweet', ETweetType.E_HOME);
  }
  AddMentionList(
    list: I.Tweet[] | undefined,
    user_id_str: string,
    muteOption: I.MuteOption,
    blockIds: string[],
    muteIds: string[]
  ) {
    if (!list) throw Error('No ListTweets');
    this.CheckKey(user_id_str);

    const tweets = this.dicTweets.get(user_id_str)?.mentions;
    //TODO 에러 처리 해야함
    if (!tweets) throw Error('No ListTweets');
    list.forEach(tweet => {
      if (!tweets.find(x => x.id_str === tweet.id_str)) {
        if (!this.CheckShowMentionTweet(tweet, user_id_str, muteOption, blockIds, muteIds)) return; //muted
        const idx = this.FindIndex(tweet, tweets);
        // const prevTweet = tweets[idx - 1];
        // const scrollTop = prevTweet ? prevTweet.scrollTop + prevTweet.height : idx * minHeight;
        tweets.splice(idx, 0, new I.Tweet(tweet));
      }
    });
    eventBus.$emit('AddedTweet', ETweetType.E_MENTION);
  }
  AddFavoriteList(list: I.Tweet[], user_id_str: string) {
    if (!list) throw Error('No ListTweets');
    this.CheckKey(user_id_str);

    const tweets = this.dicTweets.get(user_id_str)?.favorites;
    //TODO 에러 처리 해야함
    if (!tweets) throw Error('No ListTweets');
    list.forEach(tweet => {
      if (!tweets.find(x => x.id_str === tweet.id_str)) {
        const idx = this.FindIndex(tweet, tweets);
        // const prevTweet = tweets[idx - 1];
        // const scrollTop = prevTweet ? prevTweet.scrollTop + prevTweet.height : idx * minHeight;
        tweets.splice(idx, 0, new I.Tweet(tweet));
      }
    });
    eventBus.$emit('AddedTweet', ETweetType.E_FAVORITE);
  }
  AddConv(tweet: I.Tweet, user_id_str: string) {
    if (!tweet) throw Error('No Tweet');
    this.CheckKey(user_id_str);

    const tweets = this.dicTweets.get(user_id_str)?.conv;
    //TODO 에러 처리 해야함
    if (!tweets) throw Error('No ListTweets');
    if (!tweets.find(x => x.id_str === tweet.id_str)) {
      const idx = this.FindIndex(tweet, tweets);
      tweets.splice(idx, 0, new I.Tweet(tweet));
    }
    eventBus.$emit('AddedTweet', ETweetType.E_CONV);
  }
  ClearTweet(tweetType: ETweetType, user_id_str: string) {
    this.CheckKey(user_id_str);

    const tweets = this.dicTweets.get(user_id_str);
    if (!tweets) return;
    switch (tweetType) {
      case ETweetType.E_HOME:
        tweets.homes.splice(0, tweets.conv.length);
        break;
      case ETweetType.E_MENTION:
        tweets.mentions.splice(0, tweets.conv.length);
        break;
      case ETweetType.E_FAVORITE:
        tweets.favorites.splice(0, tweets.conv.length);
        break;
      case ETweetType.E_CONV:
        tweets.conv.splice(0, tweets.conv.length);
        break;
    }
  }
  OnResized() {
    // this.dicTweets.forEach(item => {
    //   for (let i = 0, len = item.homes.length; i < len; i++) {
    //     item.homes[i].isResized = true;
    //   }
    //   for (let i = 0, len = item.mentions.length; i < len; i++) {
    //     item.mentions[i].isResized = true;
    //   }
    //   for (let i = 0, len = item.favorites.length; i < len; i++) {
    //     item.favorites[i].isResized = true;
    //   }
    //   for (let i = 0, len = item.opens.length; i < len; i++) {
    //     item.opens[i].isResized = true;
    //   }
    //   for (let i = 0, len = item.conv.length; i < len; i++) {
    //     item.conv[i].isResized = true;
    //   }
    // });
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
