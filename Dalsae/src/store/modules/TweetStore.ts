/* eslint-disable @typescript-eslint/camelcase */
import * as I from '@/Interfaces';
import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators';
import * as A from '@/store/Interface';
import store from '@/store';
import { moduleSwitter } from '@/store/modules/SwitterStore';
export interface ITweetStore {
  tweetDatas: I.TweetDatas;
}

@Module({ dynamic: true, store, name: 'tweet' })
class TweetStore extends VuexModule {
  // states
  tweetDatas: I.TweetDatas = new I.TweetDatas();

  // getters

  get homes() {
    const tweets = this.tweetDatas.dicTweets.get(moduleSwitter.selectID);
    return tweets ? tweets.homes : [];
  }

  get mentions() {
    const tweets = this.tweetDatas.dicTweets.get(moduleSwitter.selectID);
    return tweets ? tweets.mentions : [];
  }

  get favorites() {
    const tweets = this.tweetDatas.dicTweets.get(moduleSwitter.selectID);
    return tweets ? tweets.favorites : [];
  }

  get opens() {
    const tweets = this.tweetDatas.dicTweets.get(moduleSwitter.selectID);
    return tweets ? tweets.opens : [];
  }

  @Mutation
  private init(userId: string) {
    this.tweetDatas.dicTweets.set(userId, new I.Tweets());
  }

  @Action
  Init(userId: string) {
    this.context.commit('init', userId);
  }
}

export const moduleTweet = getModule(TweetStore);
