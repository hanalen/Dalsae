/* eslint-disable @typescript-eslint/camelcase */
import * as I from '@/Interfaces';
import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators';
import * as A from '@/store/Interface';
import store from '@/store';
import { moduleSwitter } from '@/store/modules/SwitterStore';
import { eventBus } from '@/plugins';
import { ETweetType } from '@/store/Interface';
import { moduleOption } from './OptionStore';
import {
  CheckMention,
  CheckShowHomeTweet,
  CheckShowMentionTweet,
  FindTweetIndex
} from '@/Interfaces';
import { moduleUI } from './UIStore';
import { UserStreaming } from '@/API';
import { moduleDom } from './DomStore';
import { EIPcType } from '@/mixins';
import { moduleUtil } from './UtilStore';
export interface ITweetStore {
  tweetDatas: I.TweetDatas;
}

interface TweetPair {
  key: string;
  tweets: I.Tweets;
}

interface StreamingPair {
  key: string;
  streaming: UserStreaming;
}

class StateTweet {
  tweets: TweetPair[];
  constructor() {
    this.tweets = [];
  }
}
class StateStreaming {
  streamings: StreamingPair[] = [];
}

@Module({ dynamic: true, store, name: 'tweet' })
class TweetStore extends VuexModule {
  // states
  stateTweet = new StateTweet();
  stateStreaming = new StateStreaming();

  get homes() {
    return this.stateTweet.tweets.find(x => x.key === moduleSwitter.selectID)?.tweets.homes;
  }

  get mentions() {
    return this.stateTweet.tweets.find(x => x.key === moduleSwitter.selectID)?.tweets.mentions;
  }

  get favorites() {
    return this.stateTweet.tweets.find(x => x.key === moduleSwitter.selectID)?.tweets.favorites;
  }

  get opens() {
    return this.stateTweet.tweets.find(x => x.key === moduleSwitter.selectID)?.tweets.opens;
  }

  get convs() {
    return this.stateTweet.tweets.find(x => x.key === moduleSwitter.selectID)?.tweets.conv;
  }

  get userTweets() {
    return this.stateTweet.tweets.find(x => x.key === moduleSwitter.selectID)?.tweets.user;
  }

  @Mutation
  private addHome(addTweet: A.AddTweet) {
    let tweets = this.stateTweet.tweets.find(x => x.key === moduleSwitter.selectID);
    if (!tweets) {
      tweets = { key: moduleSwitter.selectID, tweets: new I.Tweets() };
      this.stateTweet.tweets.push(tweets);
    }
    const { tweet, listTweet, user_id_str } = addTweet;
    const { dicMuteIds, dicBlockIds } = moduleSwitter.stateIds;
    const { muteOption } = moduleOption;
    const listMuteIds = dicMuteIds.get(moduleSwitter.selectID);
    let listBlockIds = dicBlockIds.get(moduleSwitter.selectID)?.ids;
    if (!listBlockIds) listBlockIds = [];
    const orgTweets = tweets.tweets.homes;
    let listConcatTweets: I.Tweet[] = [];
    listConcatTweets = tweet ? [tweet] : [];

    let isAddMention = false;

    if (listTweet) {
      listConcatTweets = listConcatTweets.concat(listTweet);
    }
    if (tweet) {
      listConcatTweets = [tweet];
    }
    for (const item of listConcatTweets) {
      if (orgTweets.find(x => x.id_str === addTweet.tweet?.id_str)) return; //exists
      if (
        !CheckShowHomeTweet(item, user_id_str, muteOption, listBlockIds, listMuteIds) &&
        muteOption.isMuteMention //멘션도 뮤트처리
      )
        return; //muted
      if (CheckMention(item, user_id_str, muteOption)) {
        if (!CheckShowMentionTweet(item, user_id_str, muteOption, listBlockIds, listMuteIds))
          return; //muted
        const mentions = tweets?.tweets.mentions;
        if (mentions) {
          const idx = FindTweetIndex(item, mentions);
          const tweet = new I.Tweet(item);
          mentions.splice(idx, 0, tweet);
          moduleDom.scrollMention?.panel.AddData(tweet, idx);
          if (mentions.length > 1500) {
            const key = mentions[mentions.length - 1].id_str;
            mentions.splice(mentions.length - 1, 1);
            moduleDom.scrollMention?.panel.RemoveData(key, mentions.length - 1);
          }
          const { mention } = moduleUI.statePanel;
          let selectedId = mention.selectedId;
          let idx2 = tweets.tweets.mentions.findIndex(x => x.id_str === selectedId);
          if (idx2 === -1) idx2 = 0;
          selectedId = tweets.tweets.mentions[idx2].id_str;
          isAddMention = true;
          moduleUI.SetStatePanel({
            ...moduleUI.statePanel,
            mention: { ...mention, index: idx2, selectedId: selectedId }
          });
        }
      } else {
        if (!CheckShowHomeTweet(item, user_id_str, muteOption, listBlockIds, listMuteIds)) return;
      }
      const idx = FindTweetIndex(item, orgTweets);
      const tweet = new I.Tweet(item);
      orgTweets.splice(idx, 0, tweet);
      moduleDom.scrollHome?.panel.AddData(tweet, idx);
      if (orgTweets.length > 1500) {
        const key = orgTweets[orgTweets.length - 1].id_str;
        orgTweets.splice(orgTweets.length - 1, 1);
        moduleDom.scrollHome?.panel.RemoveData(key, orgTweets.length - 1);
      }
    }
    const { home } = moduleUI.statePanel;
    let selectedId = home.selectedId;
    let idx = tweets.tweets.homes.findIndex(x => x.id_str === selectedId);
    if (idx === -1) idx = 0;
    selectedId = tweets.tweets.homes[idx].id_str;
    moduleUI.SetStatePanel({
      ...moduleUI.statePanel,
      home: { ...home, index: idx, selectedId: selectedId }
    });
    moduleUtil.Alarm(isAddMention);
  }

  @Mutation
  private addMention(addTweet: A.AddTweet) {
    let tweets = this.stateTweet.tweets.find(x => x.key === moduleSwitter.selectID);
    if (!tweets) {
      tweets = { key: moduleSwitter.selectID, tweets: new I.Tweets() };
      this.stateTweet.tweets.push(tweets);
    }
    const { tweet, listTweet, user_id_str } = addTweet;
    const { dicMuteIds, dicBlockIds } = moduleSwitter.stateIds;
    const { muteOption } = moduleOption;
    const listMuteIds = dicMuteIds.get(moduleSwitter.selectID);
    let listBlockIds = dicBlockIds.get(moduleSwitter.selectID)?.ids;
    if (!listBlockIds) listBlockIds = [];

    const orgTweets = tweets.tweets.mentions;
    let listConcatTweets: I.Tweet[] = [];
    listConcatTweets = tweet ? [tweet] : [];

    if (listTweet) {
      listConcatTweets = listConcatTweets.concat(listTweet);
    }
    if (tweet) {
      listConcatTweets = [tweet];
    }
    let isAddMention = false;
    for (const item of listConcatTweets) {
      if (orgTweets.find(x => x.id_str === addTweet.tweet?.id_str)) {
        return; //exists
      }
      if (!CheckShowMentionTweet(item, user_id_str, muteOption, listBlockIds, listMuteIds)) return; //muted
      const idx = FindTweetIndex(item, orgTweets);
      const tweet = new I.Tweet(item);
      orgTweets.splice(idx, 0, tweet);
      moduleDom.scrollMention?.panel.AddData(tweet, idx);
      isAddMention = true;
    }
    const { mention } = moduleUI.statePanel;
    let selectedId = mention.selectedId;
    let idx = tweets.tweets.mentions.findIndex(x => x.id_str === selectedId);
    if (idx === -1) idx = 0;
    selectedId = tweets.tweets.mentions[idx].id_str;
    moduleUI.SetStatePanel({
      ...moduleUI.statePanel,
      mention: { ...mention, index: idx, selectedId: selectedId }
    });

    moduleUtil.Alarm(isAddMention);
  }

  @Mutation
  private addFavorite(addTweet: A.AddTweet) {
    let tweets = this.stateTweet.tweets.find(x => x.key === moduleSwitter.selectID);
    if (!tweets) {
      tweets = { key: moduleSwitter.selectID, tweets: new I.Tweets() };
      this.stateTweet.tweets.push(tweets);
    }
    const { tweet, listTweet, user_id_str } = addTweet;
    const { dicMuteIds, dicBlockIds } = moduleSwitter.stateIds;
    const { muteOption } = moduleOption;
    const listMuteIds = dicMuteIds.get(moduleSwitter.selectID);
    let listBlockIds = dicBlockIds.get(moduleSwitter.selectID)?.ids;
    if (!listBlockIds) listBlockIds = [];

    const orgTweets = tweets.tweets.favorites;
    let listConcatTweets: I.Tweet[] = [];
    listConcatTweets = tweet ? [tweet] : [];

    if (listTweet) {
      listConcatTweets = listConcatTweets.concat(listTweet);
    }
    if (tweet) {
      listConcatTweets = [tweet];
    }
    for (const item of listConcatTweets) {
      if (orgTweets.find(x => x.id_str === addTweet.tweet?.id_str)) {
        return; //exists
      }
      if (!CheckShowMentionTweet(item, user_id_str, muteOption, listBlockIds, listMuteIds)) return; //muted
      const idx = FindTweetIndex(item, orgTweets);
      orgTweets.splice(idx, 0, new I.Tweet(item));
      moduleDom.scrollFavorite?.panel.AddData(new I.Tweet(item), idx);
    }
    const { favorite } = moduleUI.statePanel;
    let selectedId = favorite.selectedId;
    let idx2 = tweets.tweets.favorites.findIndex(x => x.id_str === selectedId);
    if (idx2 === -1) idx2 = 0;
    selectedId = tweets.tweets.favorites[idx2].id_str;
    moduleUI.SetStatePanel({
      ...moduleUI.statePanel,
      favorite: { ...favorite, index: idx2, selectedId: selectedId }
    });
  }
  @Mutation
  private addOpen(addTweet: A.AddTweet) {
    let tweets = this.stateTweet.tweets.find(x => x.key === moduleSwitter.selectID);
    if (!tweets) {
      tweets = { key: moduleSwitter.selectID, tweets: new I.Tweets() };
      this.stateTweet.tweets.push(tweets);
    }
    const { tweet } = addTweet;
    if (!tweet) return;
    const orgTweets = tweets.tweets.opens;

    if (orgTweets.find(x => x.id_str === addTweet.tweet?.id_str)) {
      return; //exists
    }
    orgTweets.splice(0, 0, tweet);
    moduleDom.scrollOpen?.panel.AddData(tweet, 0);
    const { open } = moduleUI.statePanel;
    let selectedId = open.selectedId;
    let idx = tweets.tweets.opens.findIndex(x => x.id_str === selectedId);
    if (idx === -1) idx = 0;
    selectedId = tweets.tweets.opens[idx].id_str;
    moduleUI.SetStatePanel({
      ...moduleUI.statePanel,
      open: { ...open, index: idx, selectedId: selectedId }
    });
  }
  @Mutation
  private addConv(addTweet: A.AddTweet) {
    let tweets = this.stateTweet.tweets.find(x => x.key === moduleSwitter.selectID);
    if (!tweets) {
      tweets = { key: moduleSwitter.selectID, tweets: new I.Tweets() };
      this.stateTweet.tweets.push(tweets);
    }
    const { tweet, user_id_str } = addTweet;
    const { dicMuteIds, dicBlockIds } = moduleSwitter.stateIds;
    const { muteOption } = moduleOption;
    const listMuteIds = dicMuteIds.get(moduleSwitter.selectID);
    let listBlockIds = dicBlockIds.get(moduleSwitter.selectID)?.ids;
    if (!listBlockIds) listBlockIds = [];

    if (!tweet) return;
    const orgTweets = tweets.tweets.conv;

    if (orgTweets.find(x => x.id_str === addTweet.tweet?.id_str)) {
      return; //exists
    }
    if (!CheckShowMentionTweet(tweet, user_id_str, muteOption, listBlockIds, listMuteIds)) return; //muted

    const idx = FindTweetIndex(tweet, orgTweets);
    orgTweets.splice(idx, 0, new I.Tweet(tweet));
    moduleDom.scrollConv?.panel.AddData(new I.Tweet(tweet), idx);
    const { conv } = moduleUI.statePanel;
    let selectedId = conv.selectedId;
    let idx2 = tweets.tweets.conv.findIndex(x => x.id_str === selectedId);
    if (idx2 === -1) idx2 = 0;
    selectedId = tweets.tweets.conv[idx2].id_str;
    moduleUI.SetStatePanel({
      ...moduleUI.statePanel,
      conv: { ...conv, index: idx2, selectedId: selectedId }
    });
  }

  @Mutation
  private addUserTweet(addTweet: A.AddTweet) {
    let tweets = this.stateTweet.tweets.find(x => x.key === moduleSwitter.selectID);
    if (!tweets) {
      tweets = { key: moduleSwitter.selectID, tweets: new I.Tweets() };
      this.stateTweet.tweets.push(tweets);
    }
    const { tweet, listTweet, user_id_str } = addTweet;
    const { dicMuteIds, dicBlockIds } = moduleSwitter.stateIds;
    const { muteOption } = moduleOption;
    const listMuteIds = dicMuteIds.get(moduleSwitter.selectID);
    let listBlockIds = dicBlockIds.get(moduleSwitter.selectID)?.ids;
    if (!listBlockIds) listBlockIds = [];

    const orgTweets = tweets.tweets.user;
    let listConcatTweets: I.Tweet[] = [];
    listConcatTweets = tweet ? [tweet] : [];

    if (listTweet) {
      listConcatTweets = listConcatTweets.concat(listTweet);
    }
    if (tweet) {
      listConcatTweets = [tweet];
    }
    for (const item of listConcatTweets) {
      if (orgTweets.find(x => x.id_str === addTweet.tweet?.id_str)) {
        continue; //exists
      }
      if (!CheckShowHomeTweet(item, user_id_str, muteOption, listBlockIds, listMuteIds)) return; //muted
      const idx = FindTweetIndex(item, orgTweets);
      const tweet = new I.Tweet(item);
      orgTweets.splice(idx, 0, tweet);
      moduleDom.scrollUser?.panel.AddData(tweet, idx);
    }
    const { user } = moduleUI.statePanel;
    let selectedId = user.selectedId;
    let idx = tweets.tweets.mentions.findIndex(x => x.id_str === selectedId);
    if (idx === -1) idx = 0;
    selectedId = tweets.tweets.mentions[idx].id_str;
    moduleUI.SetStatePanel({
      ...moduleUI.statePanel,
      user: { ...user, index: idx, selectedId: selectedId }
    });
  }

  @Action
  AddTweet(addTweet: A.AddTweet) {
    const { type } = { ...addTweet };
    switch (type) {
      case A.ETweetType.E_HOME:
        this.context.commit('addHome', addTweet);
        break;
      case A.ETweetType.E_MENTION:
        this.context.commit('addMention', addTweet);
        break;
      case A.ETweetType.E_FAVORITE:
        this.context.commit('addFavorite', addTweet);
        break;
      case A.ETweetType.E_OPEN:
        this.context.commit('addOpen', addTweet);
        break;
      case A.ETweetType.E_CONV:
        this.context.commit('addConv', addTweet);
        break;
      case A.ETweetType.E_USER:
        this.context.commit('addUserTweet', addTweet);
    }
  }

  @Mutation
  private updateRTandFav(tweet: I.Tweet) {
    const tweets = this.stateTweet.tweets.find(x => x.key === moduleSwitter.selectID)?.tweets;
    if (!tweets) return;
    const listTweet = tweets.homes.concat(
      tweets.mentions,
      tweets.favorites,
      tweets.conv,
      tweets.opens,
      tweets.user
    );
    for (const t of listTweet) {
      if (t.orgTweet.id_str === tweet.orgTweet.id_str) {
        t.orgTweet.retweeted = tweet.orgTweet.retweeted;
        t.orgTweet.favorited = tweet.orgTweet.favorited;
      }
    }
  }

  @Action
  UpdateRTandFav(tweet: I.Tweet) {
    this.context.commit('updateRTandFav', tweet);
  }
  @Mutation
  private deleteTweet(tweet: I.Tweet) {
    const pair = this.stateTweet.tweets.find(x => x.key === moduleSwitter.selectID);
    if (!pair) return;
    const { homes, mentions, conv, opens, favorites, user } = pair.tweets;
    const listTweet = homes.concat(mentions, conv, opens, favorites, user);
    for (const t of listTweet) {
      if (t.orgTweet.id_str === tweet.id_str) {
        t.isDelete = true;
        break;
      }
    }
  }

  @Action
  AddConv(addTweet: A.AddTweet) {
    this.context.commit('addConv', addTweet);
  }

  @Mutation
  private clearConv(user_id_str: string) {
    const find = this.stateTweet.tweets.find(x => x.key === user_id_str);
    if (find) {
      find.tweets.conv.splice(0, 999);
    }
  }

  @Action
  ClearConv(user_id_str: string) {
    this.context.commit('clearConv', user_id_str);
    moduleDom.scrollConv?.panel.Clear();
  }
  @Mutation
  private clearUserTweet(user_id_str: string) {
    const find = this.stateTweet.tweets.find(x => x.key === user_id_str);
    if (find) {
      find.tweets.user.splice(0, find.tweets.user.length);
    }
  }
  @Action
  ClearUserTweet(user_id_str: string) {
    this.context.commit('clearUserTweet', user_id_str);
    moduleDom.scrollUser?.panel.Clear();
  }

  @Mutation
  private addStreaming(streaming: StreamingPair) {
    this.stateStreaming.streamings.push(streaming);
  }

  @Action
  AddStreaming(streaming: StreamingPair) {
    this.context.commit('addStreaming', streaming);
  }

  @Mutation
  private stopStreaming(idStr: string) {
    const idx = this.stateStreaming.streamings.findIndex(x => x.key === idStr);
    if (idx < 0) return;
    const streaming = this.stateStreaming.streamings[idx];
    if (streaming) {
      streaming.streaming.StopStreaming();
      this.stateStreaming.streamings.splice(idx, 1);
    }
  }

  @Action
  StopStreaming(idStr: string) {
    this.context.commit('stopStreaming', idStr);
  }
}

export const moduleTweet = getModule(TweetStore);
