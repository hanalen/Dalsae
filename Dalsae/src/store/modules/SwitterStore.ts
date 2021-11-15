/* eslint-disable @typescript-eslint/camelcase */
import * as I from '@/Interfaces';
import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators';
import * as A from '@/store/Interface';
import store from '@/store';
import { moduleTweet } from '@/store/modules/TweetStore';
import { FollowDatas } from '@/Interfaces/DalsaeDatas/FollowDatas';
import { UpdateFollowInfo } from '@/store/Interface';
class StateSwitter {
  switter: I.Switter;
  tempUser: I.DalsaeUser;
  constructor() {
    this.switter = { selectUser: new I.DalsaeUser(), listUser: [] };
    this.tempUser = new I.DalsaeUser();
  }
}

class StateIds {
  listBlockIds: string[] = [];
  dicMuteIds: Map<string, string[]> = new Map();

  followDatas = new FollowDatas();
}

@Module({ dynamic: true, store, name: 'switter' })
class SwitterStore extends VuexModule {
  // states
  stateSwitter: StateSwitter = new StateSwitter();
  stateIds = new StateIds();

  get listFollower() {
    const { user_id } = this.stateSwitter.switter.selectUser;
    const datas = this.stateIds.followDatas.dicUsers.get(user_id);
    return datas ? datas.listFollower : [];
  }
  get listFollowing() {
    const { user_id } = this.stateSwitter.switter.selectUser;
    const datas = this.stateIds.followDatas.dicUsers.get(user_id);
    return datas ? datas.listFollowing : [];
  }

  get listMuteIds() {
    const { user_id } = this.stateSwitter.switter.selectUser;
    const datas = this.stateIds.dicMuteIds.get(user_id);
    return datas ? datas : [];
  }

  // getters
  get selectID() {
    const id = this.stateSwitter.switter.selectUser.user_id;
    return id ? id : '';
  }

  get selectUser() {
    return this.stateSwitter.switter.selectUser;
  }

  get publicKey() {
    const { switter } = this.stateSwitter;
    return switter.selectUser.oauth_token;
  }

  get secretKey() {
    const { switter } = this.stateSwitter;
    return switter.selectUser.oauth_token_secret;
  }

  @Mutation
  private setStateSwitter(state: StateSwitter) {
    this.stateSwitter = state;
  }

  @Action
  SetStateSwitter(state: StateSwitter) {
    this.context.commit('setStateSwitter', state);
  }

  @Mutation
  private addUser(addUser: A.AddUser) {
    const { name, screenName, secretKey, userId, publicKey } = { ...addUser };
    const { switter, tempUser } = this.stateSwitter;
    const user = switter.listUser.find(x => x.user_id === userId);
    if (user) {
      switter.selectUser = user;
    } else {
      const selUser = tempUser;
      selUser.oauth_token = publicKey;
      selUser.oauth_token_secret = secretKey;
      selUser.name = name;
      selUser.screen_name = screenName;
      selUser.user_id = userId;
      switter.selectUser = tempUser;
      this.stateSwitter.tempUser = new I.DalsaeUser();
      switter.listUser.push(JSON.parse(JSON.stringify(selUser)));
      // moduleTweet.Init(userId);
      this.stateIds.followDatas.dicUsers.set(userId, { listFollower: [], listFollowing: [] });
    }
  }

  @Action
  AddUser(addUser: A.AddUser) {
    this.context.commit('addUser', addUser);
  }

  @Mutation
  private initSwitter(switter: I.Switter) {
    this.stateSwitter.switter = switter;
  }

  @Action
  public InitSwitter(switter: I.Switter) {
    this.context.commit('initSwitter', switter);
    if (switter) {
      switter.listUser?.forEach(user => {
        // moduleTweet.Init(user.user_id);
        this.stateIds.followDatas.dicUsers.set(user.user_id, {
          listFollower: [],
          listFollowing: []
        });
        this.stateIds.dicMuteIds.set(user.user_id, []);
      });
    }
  }

  @Mutation
  private updateSwitterUser(user: I.User) {
    const { switter } = this.stateSwitter;
    const find = switter.listUser.find(x => x.user_id === user.id_str);
    if (find) {
      find.user = user;
      find.name = user.name;
      find.screen_name = user.screen_name;
    }
    if (switter.selectUser.user_id === user.id_str) {
      switter.selectUser.user = user;
    }
  }

  @Action
  public UpdateSwitterUser(user: I.User) {
    this.context.commit('updateSwitterUser', user);
  }

  @Mutation
  private updateFollow(userInfo: UpdateFollowInfo) {
    const ids = this.stateIds.followDatas.dicUsers.get(userInfo.selecId);
    if (!ids) return;
    const { user } = userInfo;
    if (user.following) {
      //팔로잉 추가
      const idx = ids.listFollowing.findIndex(x => x.id_str === user.id_str);
      if (idx === -1) ids.listFollowing.push(user);
    } else {
      //언팔로잉
      const idx = ids.listFollowing.findIndex(x => x.id_str === user.id_str);
      if (idx !== -1) ids.listFollowing.splice(idx, 1);
    }
  }

  @Mutation
  private setStateIds(state: StateIds) {
    this.stateIds = state;
  }

  @Action
  SetStateIds(state: StateIds) {
    this.context.commit('setStateIds', state);
  }
}

export const moduleSwitter = getModule(SwitterStore);
