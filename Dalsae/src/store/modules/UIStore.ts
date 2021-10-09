/* eslint-disable @typescript-eslint/camelcase */
import * as I from '@/Interfaces';
import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { ETweetType, ChangeIndex } from '@/store/Interface';
import { moduleTweet } from '@/store/modules/TweetStore';

export interface IPanelState {
  tweetType: ETweetType;
  index: number;
}

@Module({ dynamic: true, store, name: 'ui' })
class UIStore extends VuexModule {
  // states
  selectMenu = 0;
  panelHome: IPanelState = { tweetType: ETweetType.E_HOME, index: 0 };
  panelMention: IPanelState = { tweetType: ETweetType.E_MENTION, index: 0 };
  panelDm: IPanelState = { tweetType: ETweetType.E_DM, index: 0 };
  panelFavorite: IPanelState = { tweetType: ETweetType.E_FAVORITE, index: 0 };
  panelOpen: IPanelState = { tweetType: ETweetType.E_OPEN, index: 0 };

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
        if (moduleTweet.homes.length <= change.index) {
          change.index = moduleTweet.homes.length - 1;
        }
        if (change.index < 0) {
          change.index = 0;
        }
        this.panelHome.index = change.index;
        break;
      case ETweetType.E_MENTION:
        if (moduleTweet.mentions.length <= change.index) {
          change.index = moduleTweet.homes.length - 1;
        }
        if (change.index < 0) {
          change.index = 0;
        }
        this.panelMention.index = change.index;
        break;
      case ETweetType.E_DM:
        this.panelDm.index = change.index;
        break;
      case ETweetType.E_FAVORITE:
        if (moduleTweet.favorites.length <= change.index) {
          change.index = moduleTweet.homes.length - 1;
        }
        if (change.index < 0) {
          change.index = 0;
        }
        this.panelFavorite.index = change.index;
        break;
      case ETweetType.E_OPEN:
        if (moduleTweet.opens.length <= change.index) {
          change.index = moduleTweet.homes.length - 1;
        }
        if (change.index < 0) {
          change.index = 0;
        }
        this.panelOpen.index = change.index;
        break;
    }
  }

  @Action
  ChangeIndex(change: ChangeIndex) {
    this.context.commit('changeIndex', change);
  }
}

export const moduleUI = getModule(UIStore);
