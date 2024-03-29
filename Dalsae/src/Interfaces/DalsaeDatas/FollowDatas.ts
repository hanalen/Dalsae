/* eslint-disable @typescript-eslint/camelcase */
import * as I from '@/Interfaces';
import * as M from '@/mixins';
import { eventBus } from '@/plugins';
import { ETweetType } from '@/store/Interface';

export class FollowUsers {
  listFollowing: I.User[] = [];
  listFollower: I.User[] = [];
}

export class FollowDatas {
  dicUsers: Map<string, FollowUsers>;

  constructor() {
    this.dicUsers = new Map();
  }

  CheckKey(user_id_str: string) {
    if (!this.dicUsers.has(user_id_str)) {
      this.dicUsers.set(user_id_str, new FollowUsers());
    }
  }

  AddFollowing(listUser: I.User[], user_id_str: string) {
    this.CheckKey(user_id_str);
    const users = this.dicUsers.get(user_id_str);
    if (!users) return;
    listUser.forEach(user => {
      if (!users.listFollowing.find(x => x.id_str === user.id_str)) {
        users.listFollowing.push(user);
      }
    });
  }
  AddFollower(listUser: I.User[], user_id_str: string) {
    this.CheckKey(user_id_str);
    const users = this.dicUsers.get(user_id_str);
    if (!users) return;
    listUser.forEach(user => {
      if (!users.listFollower.find(x => x.id_str === user.id_str)) {
        users.listFollower.push(user);
      }
    });
  }
  UpdateUserInfo(user: I.User, user_id_str: string) {
    const users = this.dicUsers.get(user_id_str);
    if (!users) return;
    //팔로잉 팔로워 데이터 갱신
    const idxFollowing = users.listFollowing.findIndex(x => x.id_str === user.id_str);
    const idxFollower = users.listFollower.findIndex(x => x.id_str === user.id_str);
    if (idxFollowing > -1) users.listFollowing.splice(idxFollowing, 1, user);
    if (idxFollower > -1) users.listFollower.splice(idxFollower, 1, user);

    //언팔로우 시 팔로우 목록에서 제외
    if (!user.following && idxFollowing > -1) {
      users.listFollowing.splice(idxFollowing, 1);
    }
  }
}
