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

class StateProfile {
  isLoadProfile = false;
  isLoadFollowing = false;
  isLoadFollower = false;
  isFollwRequest = false;

  isLoadFollowerIds = false;
  selectMenu = 0;
}

@Module({ dynamic: true, store, name: 'profile' })
class ProfileStore extends VuexModule {
  showUser: I.User = new I.User(); //상단에 보이는 유저
  selectUser: I.User = new I.User(); //하단 목록에 사용되는 유저
  stateProfile = new StateProfile();
  listFollower: I.FollowerList = { next_cursor_str: '', users: [], previous_cursor_str: '' };
  listFollowing: I.FollowerList = { next_cursor_str: '', users: [], previous_cursor_str: '' };
  listFollowerIds: I.BlockIds = {
    next_cursor_str: '',
    previous_cursor_str: '',
    ids: []
  };

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
  private setSelectUserFollowerList(listUser: I.FollowerList) {
    this.listFollower = listUser;
  }

  @Action
  SetSelectUserFollowerList(listUser: I.FollowerList) {
    this.context.commit('setSelectUserFollowerList', listUser);
  }

  @Mutation
  private setSelectUserFollowingList(listUser: I.FollowerList) {
    this.listFollowing = listUser;
  }

  @Action
  SetSelectUserFollowingList(listUser: I.FollowerList) {
    this.context.commit('setSelectUserFollowingList', listUser);
  }

  @Mutation
  private clear() {
    this.listFollower = { previous_cursor_str: '', users: [], next_cursor_str: '' };
    this.listFollowing = { previous_cursor_str: '', users: [], next_cursor_str: '' };
    this.stateProfile = new StateProfile();
  }

  @Action
  Clear() {
    this.context.commit('clear');
  }

  @Mutation
  private updateFollowUserInfo(user: I.User) {
    const idx = this.listFollower.users.findIndex(x => x.id_str === user.id_str);
    if (idx > -1) {
      this.listFollower.users.splice(idx, 1, user);
    }
    const idx2 = this.listFollowing.users.findIndex(x => x.id_str === user.id_str);
    if (idx2 > -1) {
      this.listFollowing.users.splice(idx2, 1, user);
    }
    //TODO 메인 윈도우store에 데이터 넘겨야 함
  }

  @Action
  UpdateFollowUserInfo(user: I.User) {
    this.context.commit('updateFollowUserInfo', user);
    this.context.commit('updateFollowInfo', user);
  }

  @Mutation
  private addFollowerIds(ids: I.BlockIds) {
    if (!ids) return;
    this.listFollowerIds.ids = this.listFollowerIds.ids.concat(ids.ids);
    this.listFollowerIds.next_cursor_str = ids.next_cursor_str;
    this.listFollowerIds.previous_cursor_str = ids.previous_cursor_str;
  }

  @Action
  AddFollowerIds(ids: I.BlockIds) {
    this.context.commit('addFollowerIds', ids);
  }

  @Mutation
  private addFollowingIds(ids: I.BlockIds) {
    console.log(ids);
  }

  @Action
  AddFollowingIds(ids: I.BlockIds) {
    this.context.commit('addFollowingIds', ids);
  }

  @Mutation
  private setState(state: StateProfile) {
    this.stateProfile = state;
  }
  @Action
  SetState(state: StateProfile) {
    this.context.commit('setState', state);
  }
  @Mutation
  private clearIds() {
    this.listFollowerIds = { ids: [], previous_cursor_str: '', next_cursor_str: '' };
  }

  @Action
  ClearIds() {
    this.context.commit('clearIds');
  }
}

export const moduleProfile = getModule(ProfileStore);
