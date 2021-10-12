/* eslint-disable @typescript-eslint/camelcase */
import * as I from '@/Interfaces';
import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators';
import * as M from '@/mixins';
import store from '@/store';
import { ETweetType, ChangeIndex, ContextEvent } from '@/store/Interface';
import { moduleTweet } from '@/store/modules/TweetStore';

export interface IPanelState {
  tweetType: ETweetType;
  index: number;
  selectedId: string;
}

@Module({ dynamic: true, store, name: 'ui' })
class UIStore extends VuexModule {
  // states
  selectMenu = 0;
  panelHome: IPanelState = { tweetType: ETweetType.E_HOME, index: -1, selectedId: '' };
  panelMention: IPanelState = { tweetType: ETweetType.E_MENTION, index: -1, selectedId: '' };
  panelDm: IPanelState = { tweetType: ETweetType.E_DM, index: -1, selectedId: '' };
  panelFavorite: IPanelState = { tweetType: ETweetType.E_FAVORITE, index: -1, selectedId: '' };
  panelOpen: IPanelState = { tweetType: ETweetType.E_OPEN, index: -1, selectedId: '' };

  contextTweet: I.Tweet = new I.Tweet();
  isShowContext = false;
  contextX = 0;
  contextY = 0;

  @Mutation
  private changeMenu(menu: number) {
    this.selectMenu = menu;
  }
  @Action
  ChangeMenu(menu: number) {
    this.context.commit('changeMenu', menu);
  }

  @Mutation
  private changeIndex(change: ChangeIndex) {
    if (change.index < 0) {
      change.index = 0;
    }
    switch (change.tweetType) {
      case ETweetType.E_HOME:
        this.panelHome.index = change.index;
        this.panelHome.selectedId = change.selectedId;
        break;
      case ETweetType.E_MENTION:
        this.panelMention.index = change.index;
        this.panelMention.selectedId = change.selectedId;
        break;
      case ETweetType.E_DM:
        this.panelDm.index = change.index;
        break;
      case ETweetType.E_FAVORITE:
        this.panelFavorite.index = change.index;
        this.panelFavorite.selectedId = change.selectedId;
        break;
      case ETweetType.E_OPEN:
        this.panelOpen.index = change.index;
        this.panelOpen.selectedId = change.selectedId;
        break;
    }
  }

  @Action
  ChangeIndex(change: ChangeIndex) {
    this.context.commit('changeIndex', change);
  }

  @Action
  ChangeSelectTweet(change: ChangeIndex) {
    let listTweet: M.ScrollItem<I.Tweet>[] = [];
    switch (change.tweetType) {
      case ETweetType.E_HOME:
        listTweet = moduleTweet.homes;
        break;
      case ETweetType.E_MENTION:
        listTweet = moduleTweet.mentions;
        break;
      case ETweetType.E_DM:
        break;
      case ETweetType.E_FAVORITE:
        listTweet = moduleTweet.favorites;
        break;
      case ETweetType.E_OPEN:
        listTweet = moduleTweet.opens;
        break;
      default:
        listTweet = moduleTweet.homes;
        break;
    }
    change.index = listTweet.findIndex(x => x.key === change.selectedId);
    if (change.index === -1) return;
    this.context.commit('changeIndex', change);
  }

  @Mutation
  private onContext(contextEvent: ContextEvent) {
    this.isShowContext = contextEvent.isShow;
    if (contextEvent.tweet) {
      this.contextTweet = contextEvent.tweet;
    }
    this.contextX = contextEvent.x;
    this.contextY = contextEvent.y;
  }

  @Action
  OnContext(contextEvent: ContextEvent) {
    this.context.commit('onContext', contextEvent);
  }
}

export const moduleUI = getModule(UIStore);
