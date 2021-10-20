/* eslint-disable @typescript-eslint/camelcase */
import * as I from '@/Interfaces';
import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators';
import * as M from '@/mixins';
import store from '@/store';
import { ETweetType, ChangeIndex, ContextEvent, LoadEvent } from '@/store/Interface';
import { moduleTweet } from '@/store/modules/TweetStore';
import { moduleSwitter } from './SwitterStore';
import { moduleOption } from './OptionStore';
import { ContextItem } from '@/mixins';

@Module({ dynamic: true, store, name: 'profile' })
class ProfileStore extends VuexModule {
  selectUser: I.User = new I.User();
  isLoadProfile = false;
  selectMenu = 0;

  @Mutation
  private changeUser(user: I.User) {
    this.selectUser = user;
  }

  @Action
  ChangeUser(user: I.User) {
    this.context.commit('changeUser', user);
  }

  @Mutation
  private setLoad(isLoad: boolean) {
    this.isLoadProfile = isLoad;
  }

  @Action
  SetLoad(isLoad: boolean) {
    this.context.commit('setLoad', isLoad);
  }

  @Mutation
  private changeSelectMenu(menu: number) {
    this.selectMenu = menu;
  }

  @Action
  ChangeSelectMenu(menu: number) {
    this.context.commit('changeSelectMenu', menu);
  }
}

export const moduleProfile = getModule(ProfileStore);
