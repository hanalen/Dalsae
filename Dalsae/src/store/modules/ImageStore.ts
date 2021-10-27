/* eslint-disable @typescript-eslint/camelcase */
import * as I from '@/Interfaces';
import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '@/store';

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
  }
}

@Module({ dynamic: true, store, name: 'image' })
class ImageStore extends VuexModule {
  // states
  stateImage = new ImageViewState();
  tweet = new I.Tweet();
  option: I.UIOption = {
    isBigPropic: true,
    isLoadOrgImg: false,
    isSendCheck: false,
    isSendEnter: true,
    isSendRTCheck: true,
    isSendRTProtected: true,
    isShowBottomPreview: true,
    isShowPreview: true,
    isShowPropic: true,
    isShowTweet: true,
    isSmallInput: false,
    isSmallTweet: false,
    isUseRead: false
  };

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
  }
  @Action
  Reset() {
    this.context.commit('reset');
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
  private setOption(option: I.UIOption) {
    this.option = option;
  }

  @Action
  SetOption(option: I.UIOption) {
    this.context.commit('setOption', option);
  }
}

export const moduleImage = getModule(ImageStore);
