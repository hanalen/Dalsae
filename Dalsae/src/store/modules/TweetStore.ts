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

  @Mutation
  private addHome(addTweet: A.AddTweet) {
    let tweets = this.stateTweet.tweets.find(x => x.key === moduleSwitter.selectID);
    if (!tweets) {
      tweets = { key: moduleSwitter.selectID, tweets: new I.Tweets() };
      this.stateTweet.tweets.push(tweets);
    }
    const { tweet, listTweet, user_id_str } = addTweet;
    const { dicMuteIds, listBlockIds } = moduleSwitter.stateIds;
    const { muteOption } = moduleOption;
    const listMuteIds = dicMuteIds.get(moduleSwitter.selectID);

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
    listConcatTweets.forEach(item => {
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
          mentions.splice(idx, 0, new I.Tweet(item));
          const { mention } = moduleUI.statePanel;
          const idx2 = mentions.findIndex(x => x.id_str === mention.selectedId);
          isAddMention = true;
          moduleUI.SetStatePanel({
            ...moduleUI.statePanel,
            mention: { ...mention, index: idx2 }
          });
        }
      } else {
        if (!CheckShowHomeTweet(item, user_id_str, muteOption, listBlockIds, listMuteIds)) return;
      }
      const idx = FindTweetIndex(item, orgTweets);
      orgTweets.splice(idx, 0, new I.Tweet(item));
    });
    const { home } = moduleUI.statePanel;
    const idx = tweets.tweets.homes.findIndex(x => x.id_str === home.selectedId);
    moduleUI.SetStatePanel({
      ...moduleUI.statePanel,
      home: { ...home, index: idx }
    });
    if (
      isAddMention &&
      moduleOption.muteOption.pathSound &&
      moduleOption.muteOption.isPlaySoundAlarm
    ) {
      //알람!
      moduleDom.stateDom.audio.play();
    }
  }

  @Mutation
  private addMention(addTweet: A.AddTweet) {
    let tweets = this.stateTweet.tweets.find(x => x.key === moduleSwitter.selectID);
    if (!tweets) {
      tweets = { key: moduleSwitter.selectID, tweets: new I.Tweets() };
      this.stateTweet.tweets.push(tweets);
    }
    const { tweet, listTweet, user_id_str } = addTweet;
    const { dicMuteIds, listBlockIds } = moduleSwitter.stateIds;
    const { muteOption } = moduleOption;
    const listMuteIds = dicMuteIds.get(moduleSwitter.selectID);

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
    listConcatTweets.forEach(item => {
      if (orgTweets.find(x => x.id_str === addTweet.tweet?.id_str)) {
        console.log('exists');
        return; //exists
      }
      if (!CheckShowMentionTweet(item, user_id_str, muteOption, listBlockIds, listMuteIds)) return; //muted
      const idx = FindTweetIndex(item, orgTweets);
      orgTweets.splice(idx, 0, new I.Tweet(item));
      isAddMention = true;
    });
    const { mention } = moduleUI.statePanel;
    const idx = tweets.tweets.mentions.findIndex(x => x.id_str === mention.selectedId);
    moduleUI.SetStatePanel({
      ...moduleUI.statePanel,
      mention: { ...mention, index: idx }
    });

    if (
      isAddMention &&
      moduleOption.muteOption.pathSound &&
      moduleOption.muteOption.isPlaySoundAlarm
    ) {
      //알람!
      moduleDom.stateDom.audio.play();
    }
  }

  @Mutation
  private addFavorite(addTweet: A.AddTweet) {
    let tweets = this.stateTweet.tweets.find(x => x.key === moduleSwitter.selectID);
    if (!tweets) {
      tweets = { key: moduleSwitter.selectID, tweets: new I.Tweets() };
      this.stateTweet.tweets.push(tweets);
    }
    const { tweet, listTweet, user_id_str } = addTweet;
    const { dicMuteIds, listBlockIds } = moduleSwitter.stateIds;
    const { muteOption } = moduleOption;
    const listMuteIds = dicMuteIds.get(moduleSwitter.selectID);

    const orgTweets = tweets.tweets.favorites;
    let listConcatTweets: I.Tweet[] = [];
    listConcatTweets = tweet ? [tweet] : [];

    if (listTweet) {
      listConcatTweets = listConcatTweets.concat(listTweet);
    }
    if (tweet) {
      listConcatTweets = [tweet];
    }
    listConcatTweets.forEach(item => {
      if (orgTweets.find(x => x.id_str === addTweet.tweet?.id_str)) {
        console.log('exists');
        return; //exists
      }
      if (!CheckShowMentionTweet(item, user_id_str, muteOption, listBlockIds, listMuteIds)) return; //muted
      const idx = FindTweetIndex(item, orgTweets);
      orgTweets.splice(idx, 0, new I.Tweet(item));
    });
    const { favorite } = moduleUI.statePanel;
    const idx = tweets.tweets.mentions.findIndex(x => x.id_str === favorite.selectedId);
    moduleUI.SetStatePanel({
      ...moduleUI.statePanel,
      favorite: { ...favorite, index: idx }
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
      console.log('exists');
      return; //exists
    }
    const idx = FindTweetIndex(tweet, orgTweets);
    orgTweets.splice(idx, 0, new I.Tweet(tweet));
    const { open } = moduleUI.statePanel;
    const idx2 = tweets.tweets.mentions.findIndex(x => x.id_str === open.selectedId);
    moduleUI.SetStatePanel({
      ...moduleUI.statePanel,
      open: { ...open, index: idx2 }
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
    const { dicMuteIds, listBlockIds } = moduleSwitter.stateIds;
    const { muteOption } = moduleOption;
    const listMuteIds = dicMuteIds.get(moduleSwitter.selectID);
    if (!tweet) return;
    const orgTweets = tweets.tweets.conv;

    if (orgTweets.find(x => x.id_str === addTweet.tweet?.id_str)) {
      console.log('exists');
      return; //exists
    }
    if (!CheckShowMentionTweet(tweet, user_id_str, muteOption, listBlockIds, listMuteIds)) return; //muted

    const idx = FindTweetIndex(tweet, orgTweets);
    orgTweets.splice(idx, 0, new I.Tweet(tweet));
    const { conv } = moduleUI.statePanel;
    const idx2 = tweets.tweets.mentions.findIndex(x => x.id_str === conv.selectedId);
    moduleUI.SetStatePanel({
      ...moduleUI.statePanel,
      conv: { ...conv, index: idx2 }
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
    }
    eventBus.$emit('AddTweetHome');
  }

  // @Mutation
  // private resized() {
  //   this.tweetDatas.OnResized();
  // }

  // @Action
  // Resized() {
  //   this.context.commit('resized');
  // }

  // @Mutation
  // private moveScroll(move: A.MoveScroll) {
  //   this.tweetDatas.MoveScroll(move.listTweet, move.idxFrom, move.height);
  // }

  // @Action
  // MoveScroll(move: A.MoveScroll) {
  //   this.context.commit('moveScroll', move);
  // }

  @Mutation
  private updateRTandFav(tweet: I.Tweet) {
    const tweets = this.stateTweet.tweets.find(x => x.key === moduleSwitter.selectID)?.tweets;
    if (!tweets) return;
    const homes = tweets.homes;
    if (homes) {
      homes.forEach(item => {
        if (item.orgTweet.id_str === tweet.orgTweet.id_str) {
          console.log('update rt fav');
          item.orgTweet.retweeted = tweet.orgTweet.retweeted;
          item.orgTweet.favorited = tweet.orgTweet.favorited;
        }
      });
    }
    const mentions = tweets.mentions;
    if (mentions) {
      mentions.forEach(item => {
        if (item.orgTweet.id_str === tweet.orgTweet.id_str) {
          item.orgTweet.retweeted = tweet.orgTweet.retweeted;
          item.orgTweet.favorited = tweet.orgTweet.favorited;
        }
      });
    }
    const fav = tweets.favorites;
    if (fav) {
      fav.forEach(item => {
        if (item.orgTweet.id_str === tweet.orgTweet.id_str) {
          item.orgTweet.retweeted = tweet.orgTweet.retweeted;
          item.orgTweet.favorited = tweet.orgTweet.favorited;
        }
      });
    }
    const open = tweets.opens;
    if (open) {
      open.forEach(item => {
        if (item.orgTweet.id_str === tweet.orgTweet.id_str) {
          item.orgTweet.retweeted = tweet.orgTweet.retweeted;
          item.orgTweet.favorited = tweet.orgTweet.favorited;
        }
      });
    }
    const conv = tweets.conv;
    if (conv) {
      conv.forEach(item => {
        if (item.orgTweet.id_str === tweet.orgTweet.id_str) {
          item.orgTweet.retweeted = tweet.orgTweet.retweeted;
          item.orgTweet.favorited = tweet.orgTweet.favorited;
        }
      });
    }
  }

  @Action
  UpdateRTandFav(tweet: I.Tweet) {
    this.context.commit('updateRTandFav', tweet);
  }

  @Action
  AddConv(addTweet: A.AddTweet) {
    this.context.commit('addConv', addTweet);
  }

  @Mutation
  private clearConv(user_id_str: string) {
    const find = this.stateTweet.tweets.find(x => x.key === user_id_str);
    console.log('clreaconv', find);
    if (find) {
      find.tweets.conv.splice(0, 999);
      console.log(find.tweets.conv);
    }
  }

  @Action
  ClearConv(user_id_str: string) {
    this.context.commit('clearConv', user_id_str);
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
    console.log('stop streaming');
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
