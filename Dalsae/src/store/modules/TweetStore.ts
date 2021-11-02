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
export interface ITweetStore {
  tweetDatas: I.TweetDatas;
}

interface TweetPair {
  key: string;
  tweets: I.Tweets;
}

class StateTweet {
  tweets: TweetPair[];
  constructor() {
    this.tweets = [];
  }
}

@Module({ dynamic: true, store, name: 'tweet' })
class TweetStore extends VuexModule {
  // states
  stateTweet = new StateTweet();

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

    if (listTweet) {
      listConcatTweets = listConcatTweets.concat(listTweet);
    }
    if (tweet) {
      listConcatTweets = [tweet];
    }
    listConcatTweets.forEach(item => {
      if (orgTweets.find(x => x.id_str === addTweet.tweet?.id_str)) return; //exists
      if (!CheckShowHomeTweet(item, user_id_str, muteOption, listBlockIds, listMuteIds)) return; //muted
      if (CheckMention(item, user_id_str, muteOption)) {
        const mentions = tweets?.tweets.mentions;
        if (mentions) {
          const idx = FindTweetIndex(item, mentions);
          mentions.splice(idx, 0, new I.Tweet(item));
        }
      } else {
        if (!CheckShowHomeTweet(item, user_id_str, muteOption, listBlockIds, listMuteIds)) return;
      }
      const idx = FindTweetIndex(item, orgTweets);
      orgTweets.splice(idx, 0, new I.Tweet(item));
    });
  }

  @Mutation
  private addMention(addTweet: A.AddTweet) {
    console.log(addTweet);
  }

  @Mutation
  private addFavorite(addTweet: A.AddTweet) {
    console.log(addTweet);
  }
  @Mutation
  private addOpen(addTweet: A.AddTweet) {
    console.log(addTweet);
  }
  @Mutation
  private addConv(addTweet: A.AddTweet) {
    console.log(addTweet);
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
    const homes = this.homes;
    if (homes) {
      homes.forEach(item => {
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
    if (find) {
      find.tweets.conv = [];
    }
  }

  @Action
  ClearConv(user_id_str: string) {
    this.context.commit('clearConv', user_id_str);
  }
}

export const moduleTweet = getModule(TweetStore);
