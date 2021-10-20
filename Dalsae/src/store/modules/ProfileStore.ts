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
  showUser: I.User = new I.User(); //상단에 보이는 유저
  selectUser: I.User = new I.User(); //하단 목록에 사용되는 유저
  isLoadProfile = false;
  isLoadFollowing = false;
  isLoadFollower = false;
  selectMenu = 0;
  listFollower: I.FollowerList = { next_cursor_str: '', users: [], previous_cursor_str: '' };
  listFollowing: I.FollowerList = { next_cursor_str: '', users: [], previous_cursor_str: '' };

  @Mutation
  private changeShowUser(user: I.User) {
    this.showUser = user;
  }

  @Action
  ChangeShowUser(user: I.User) {
    this.context.commit('changeShowUser', user);
  }

  @Mutation
  private changeSelectUser(user: I.User) {
    this.selectUser = user;
  }

  @Action
  ChangeSelectUser(user: I.User) {
    console.log('change select user', user);
    this.context.commit('changeSelectUser', user);
  }

  @Mutation
  private setLoadUser(isLoad: boolean) {
    this.isLoadProfile = isLoad;
  }

  @Action
  SetLoadUser(isLoad: boolean) {
    this.context.commit('setLoadUser', isLoad);
  }

  @Mutation
  private changeSelectMenu(menu: number) {
    this.selectMenu = menu;
  }

  @Action
  ChangeSelectMenu(menu: number) {
    this.context.commit('changeSelectMenu', menu);
  }

  @Mutation
  private addFollowerList(listUser: I.FollowerList) {
    this.listFollower = listUser;
  }

  @Action
  AddFollowerList(listUser: I.FollowerList) {
    this.context.commit('addFollowerList', listUser);
  }

  @Mutation
  private addFollowingList(listUser: I.FollowerList) {
    this.listFollowing = listUser;
  }

  @Action
  AddFollowingList(listUser: I.FollowerList) {
    this.context.commit('addFollowingList', listUser);
  }

  @Mutation
  private setLoadFollowing(isLoad: boolean) {
    this.isLoadFollowing = isLoad;
  }

  @Action
  SetLoadFollowing(isLoad: boolean) {
    this.context.commit('setLoadFollowing', isLoad);
  }

  @Mutation
  private setLoadFollower(isLoad: boolean) {
    this.isLoadFollower = isLoad;
  }

  @Action
  SetLoadFollower(isLoad: boolean) {
    this.context.commit('setLoadFollower', isLoad);
  }

  @Mutation
  private clear() {
    this.listFollower = { previous_cursor_str: '', users: [], next_cursor_str: '' };
    this.listFollowing = { previous_cursor_str: '', users: [], next_cursor_str: '' };
    this.isLoadFollower = false;
    this.isLoadFollowing = false;
  }

  @Action
  Clear() {
    this.context.commit('clear');
  }
}

export const moduleProfile = getModule(ProfileStore);
