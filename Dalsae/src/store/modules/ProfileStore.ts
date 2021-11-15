/* eslint-disable @typescript-eslint/camelcase */
import * as I from '@/Interfaces';
import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators';
import * as M from '@/mixins';
import store from '@/store';
import { ETweetType, UpdateFollowInfo } from '@/store/Interface';
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
  isLoadFollowingIds = false;
  isLoadRequestIds = false;
  selectMenu = 0;

  indexFollowing = 0;
  indexFollower = 0;

  isEditMode = false;
  isUpdateProfile = false;
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
  listFollowingIds: I.BlockIds = {
    next_cursor_str: '',
    previous_cursor_str: '',
    ids: []
  };
  listRequestIds: I.BlockIds = {
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
    if (this.listFollower.users.length > 0) {
      this.listFollower.users = this.listFollower.users.concat(listUser.users);
      this.listFollower.next_cursor_str = listUser.next_cursor_str;
      this.listFollower.previous_cursor_str = listUser.previous_cursor_str;
    } else {
      this.listFollower = listUser;
    }
  }

  @Action
  SetSelectUserFollowerList(listUser: I.FollowerList) {
    this.context.commit('setSelectUserFollowerList', listUser);
  }

  @Mutation
  private setSelectUserFollowingList(listUser: I.FollowerList) {
    if (this.listFollowing.users.length > 0) {
      this.listFollowing.users = this.listFollowing.users.concat(listUser.users);
      this.listFollowing.next_cursor_str = listUser.next_cursor_str;
      this.listFollowing.previous_cursor_str = listUser.previous_cursor_str;
    } else {
      this.listFollowing = listUser;
    }
  }

  @Action
  SetSelectUserFollowingList(listUser: I.FollowerList) {
    this.context.commit('setSelectUserFollowingList', listUser);
  }

  @Mutation
  private clearProfileState() {
    this.listFollower = { previous_cursor_str: '', users: [], next_cursor_str: '' };
    this.listFollowing = { previous_cursor_str: '', users: [], next_cursor_str: '' };
    this.stateProfile = new StateProfile();
  }

  @Action
  ClearProfileState() {
    this.context.commit('ClearProfileState');
  }

  @Mutation
  private updateFollow(userInfo: UpdateFollowInfo) {
    const { user } = userInfo;
    if (user.following) {
      this.listFollowingIds.ids.push(user.id_str);
    } else {
      const idx = this.listFollowingIds.ids.indexOf(user.id_str);
      if (idx > -1) {
        this.listFollowingIds.ids.splice(idx, 1);
      }
    }
  }

  @Action
  UpdateFollowUserInfo(user: I.User) {
    this.context.commit('updateFollow', { selecId: moduleSwitter.selectID, user: user });
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
    if (!ids) return;
    this.listFollowingIds.ids = this.listFollowingIds.ids.concat(ids.ids);
    this.listFollowingIds.next_cursor_str = ids.next_cursor_str;
    this.listFollowingIds.previous_cursor_str = ids.previous_cursor_str;
  }

  @Action
  AddFollowingIds(ids: I.BlockIds) {
    this.context.commit('addFollowingIds', ids);
  }

  @Mutation
  private addRequestIds(ids: I.BlockIds) {
    if (!ids) return;
    this.listRequestIds.ids = this.listRequestIds.ids.concat(ids.ids);
    this.listRequestIds.next_cursor_str = ids.next_cursor_str;
    this.listRequestIds.previous_cursor_str = ids.previous_cursor_str;
  }

  @Action
  AddRequestIds(ids: I.BlockIds) {
    this.context.commit('addRequestIds', ids);
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
    this.listFollowingIds = { ids: [], previous_cursor_str: '', next_cursor_str: '' };
    this.listRequestIds = { ids: [], previous_cursor_str: '', next_cursor_str: '' };
  }

  @Action
  ClearIds() {
    this.context.commit('clearIds');
  }
}

export const moduleProfile = getModule(ProfileStore);
