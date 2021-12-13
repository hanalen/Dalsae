/* eslint-disable @typescript-eslint/camelcase */
import * as I from '@/Interfaces';
import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '@/store';
import * as M from '@/store/Interface';

class ImageViewState {
  isZoom: boolean;
  left: number;
  top: number;
  maxHeight: number;
  maxWidth: number;
  prevX: number;
  prevY: number;
  clickX: number;
  clickY: number;
  isDrag: boolean;
  index: number;
  isShowContext: boolean;

  constructor() {
    this.isZoom = false;
    this.left = 0;
    this.top = 0;
    this.maxHeight = 0;
    this.maxWidth = 0;
    this.prevX = 0;
    this.prevY = 0;
    this.clickX = 0;
    this.clickY = 0;
    this.isDrag = false;
    this.index = 0;
    this.isShowContext = false;
  }
}

class StateProgress {
  listProgress: M.Progress[];
  constructor() {
    this.listProgress = [
      { bError: false, bStartDownload: false, percent: 0 },
      { bError: false, bStartDownload: false, percent: 0 },
      { bError: false, bStartDownload: false, percent: 0 },
      { bError: false, bStartDownload: false, percent: 0 }
    ];
  }
}

@Module({ dynamic: true, store, name: 'image' })
class ImageStore extends VuexModule {
  // states
  stateImage = new ImageViewState();
  stateProgress = new StateProgress();
  tweet = new I.Tweet();
  isInit = false;

  @Mutation
  private changeState(state: ImageViewState) {
    this.stateImage = state;
  }
  @Action
  ChangeState(state: ImageViewState) {
    this.context.commit('changeState', state);
  }

  @Mutation
  private reset() {
    this.stateImage = new ImageViewState();
    this.stateProgress = new StateProgress();
  }
  @Action
  Reset() {
    this.context.commit('reset');
  }

  @Mutation
  private resetImageState() {
    this.stateImage = new ImageViewState();
  }

  @Action
  ResetImageState() {
    this.context.commit('resetImageState');
  }

  @Mutation
  private setTweet(tweet: I.Tweet) {
    this.tweet = tweet;
  }

  @Action
  SetTweet(tweet: I.Tweet) {
    this.context.commit('setTweet', tweet);
  }

  @Mutation
  private updateRTandFav(tweet: I.Tweet) {
    if (!this.tweet || !this.tweet.orgTweet) return;
    if (this.tweet.orgTweet.id_str !== tweet.orgTweet.id_str) return;

    this.tweet.orgTweet.favorited = tweet.orgTweet.favorited;
    this.tweet.orgTweet.retweeted = tweet.orgTweet.retweeted;
  }

  @Mutation
  private deleteTweet(tweet: I.Tweet) {
    if (!this.tweet.orgTweet) return;
    if (this.tweet.orgTweet.id_str === tweet.id_str) {
      this.tweet.isDelete = true;
    }
  }

  @Mutation
  private changeProgress(change: M.ChangeProgress) {
    if (change.index > 3) return;
    this.stateProgress.listProgress[change.index].percent = change.progress.percent;
    this.stateProgress.listProgress[change.index].bError = change.progress.bError;
    this.stateProgress.listProgress[change.index].bStartDownload = change.progress.bStartDownload;
  }

  @Action
  ChangeProgress(change: M.ChangeProgress) {
    this.context.commit('changeProgress', change);
  }
}

export const moduleImage = getModule(ImageStore);
