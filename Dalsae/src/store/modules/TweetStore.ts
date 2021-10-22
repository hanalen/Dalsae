/* eslint-disable @typescript-eslint/camelcase */
import * as I from '@/Interfaces';
import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators';
import * as A from '@/store/Interface';
import store from '@/store';
import { moduleSwitter } from '@/store/modules/SwitterStore';
import { eventBus } from '@/plugins';
import { ETweetType } from '@/store/Interface';
import { moduleOption } from './OptionStore';
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

  get convs() {
    const tweets = this.tweetDatas.dicTweets.get(moduleSwitter.selectID);
    return tweets ? tweets.conv : [];
  }

  @Mutation
  private init(userId: string) {
    this.tweetDatas.dicTweets.set(userId, new I.Tweets());
  }

  @Action
  Init(userId: string) {
    this.context.commit('init', userId);
  }

  @Mutation
  private addTweet(addTweet: A.AddTweet) {
    const { type, tweet, listTweet, user_id_str } = { ...addTweet };
    switch (type) {
      case A.ETweetType.E_HOME:
        if (tweet)
          this.tweetDatas.AddHome(
            tweet,
            user_id_str,
            moduleOption.muteOption,
            moduleSwitter.listBlockIds,
            moduleSwitter.listMuteIds
          );
        else
          this.tweetDatas.AddHomeList(
            listTweet,
            user_id_str,
            moduleOption.muteOption,
            moduleSwitter.listBlockIds,
            moduleSwitter.listMuteIds
          );
        break;
      case A.ETweetType.E_MENTION:
        if (tweet)
          this.tweetDatas.AddMention(
            tweet,
            user_id_str,
            moduleOption.muteOption,
            moduleSwitter.listBlockIds,
            moduleSwitter.listMuteIds
          );
        else
          this.tweetDatas.AddMentionList(
            listTweet,
            user_id_str,
            moduleOption.muteOption,
            moduleSwitter.listBlockIds,
            moduleSwitter.listMuteIds
          );
        break;
      case A.ETweetType.E_FAVORITE:
        break;
      case A.ETweetType.E_OPEN:
        break;
      case A.ETweetType.E_CONV:
        break;
    }
  }

  @Action
  AddTweet(addTweet: A.AddTweet) {
    this.context.commit('addTweet', addTweet);
    eventBus.$emit('AddTweetHome');
  }

  @Mutation
  private resized() {
    this.tweetDatas.OnResized();
  }

  @Action
  Resized() {
    this.context.commit('resized');
  }

  @Mutation
  private moveScroll(move: A.MoveScroll) {
    this.tweetDatas.MoveScroll(move.listTweet, move.idxFrom, move.height);
  }

  @Action
  MoveScroll(move: A.MoveScroll) {
    this.context.commit('moveScroll', move);
  }

  @Mutation
  private updateRTandFav(tweet: I.Tweet) {
    this.homes.forEach(item => {
      if (item.data.orgTweet.id_str === tweet.orgTweet.id_str) {
        item.data.orgTweet.retweeted = tweet.orgTweet.retweeted;
        item.data.orgTweet.favorited = tweet.orgTweet.favorited;
      }
    });
  }

  @Action
  UpdateRTandFav(tweet: I.Tweet) {
    this.context.commit('updateRTandFav', tweet);
  }

  @Mutation
  private showQt(addTweet: A.AddTweet) {
    if (addTweet.tweet) this.tweetDatas.AddConv(addTweet.tweet, addTweet.user_id_str);
  }

  @Action
  ShowQt(addTweet: A.AddTweet) {
    this.context.commit('showQt', addTweet);
  }

  @Mutation
  private addConv(addTweet: A.AddTweet) {
    console.log(addTweet);
    if (addTweet.tweet) this.tweetDatas.AddConv(addTweet.tweet, addTweet.user_id_str);
  }

  @Action
  AddConv(addTweet: A.AddTweet) {
    this.context.commit('addConv', addTweet);
  }

  @Mutation
  private clearConv(user_id_str: string) {
    this.tweetDatas.ClearTweet(ETweetType.E_CONV, user_id_str);
  }

  @Action
  ClearConv(user_id_str: string) {
    this.context.commit('clearConv', user_id_str);
  }
}

export const moduleTweet = getModule(TweetStore);
