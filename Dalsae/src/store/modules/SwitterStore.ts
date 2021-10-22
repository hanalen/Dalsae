/* eslint-disable @typescript-eslint/camelcase */
import * as I from '@/Interfaces';
import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators';
import * as A from '@/store/Interface';
import store from '@/store';
import { moduleTweet } from '@/store/modules/TweetStore';
import { FollowDatas } from '@/Interfaces/DalsaeDatas/FollowDatas';
export interface ISwitterState {
  switter: I.Switter;
  tempUser: I.DalsaeUser;
}

@Module({ dynamic: true, store, name: 'switter' })
class SwitterStore extends VuexModule {
  // states
  switter: I.Switter = { selectUser: new I.DalsaeUser(), listUser: [] };
  tempUser: I.DalsaeUser = new I.DalsaeUser();
  listBlockIds: string[] = [];
  dicMuteIds: Map<string, string[]> = new Map();

  followDatas = new FollowDatas();

  get listFollower() {
    return this.followDatas.dicUsers.get(this.selectID)?.listFollower;
  }
  get listFolloing() {
    return this.followDatas.dicUsers.get(this.selectID)?.listFollowing;
  }

  get listMuteIds() {
    const ret = this.dicMuteIds.get(this.switter.selectUser.user_id);
    return ret ? ret : [];
  }

  // getters
  get selectID() {
    console.log('selectid', this.switter.selectUser);
    let id = this.switter.selectUser.user_id;
    id = id ? id : '';
    return id;
  }

  get selectUser() {
    if (this.switter?.selectUser.user_id) {
      return this.switter.selectUser;
    } else {
      return null;
    }
  }

  get publicKey() {
    return this.switter ? this.switter?.selectUser?.oauth_token : '';
  }

  get secretKey() {
    return this.switter ? this.switter?.selectUser?.oauth_token_secret : '';
  }

  // mutations
  @Mutation
  private setKey(setkey: A.SetKey) {
    this.tempUser = new I.DalsaeUser();
    this.tempUser.oauth_token = setkey.publicKey;
    this.tempUser.oauth_token_secret = setkey.secretKey;
  }

  @Action
  public SetKey(setKey: A.SetKey) {
    this.context.commit('setKey', setKey);
  }

  @Mutation
  private addUser(addUser: A.AddUser) {
    const { name, screenName, secretKey, userId, publicKey } = { ...addUser };
    const user = this.switter.listUser?.find(x => x.user_id === userId);
    if (user) {
      this.switter.selectUser = user;
    } else {
      const selUser = this.tempUser;
      selUser.oauth_token = publicKey;
      selUser.oauth_token_secret = secretKey;
      selUser.name = name;
      selUser.screen_name = screenName;
      selUser.user_id = userId;
      this.switter.selectUser = this.tempUser;
      this.tempUser = new I.DalsaeUser();
      this.switter.listUser?.push(JSON.parse(JSON.stringify(selUser)));
      moduleTweet.Init(userId);
    }
  }

  @Action
  AddUser(addUser: A.AddUser) {
    this.context.commit('addUser', addUser);
  }

  @Mutation
  private initSwitter(switter: I.Switter) {
    this.switter = switter;
  }

  @Action
  public InitSwitter(switter: I.Switter) {
    this.context.commit('initSwitter', switter);
    if (switter) {
      switter.listUser?.forEach(user => {
        moduleTweet.Init(user.user_id);
        this.dicMuteIds.set(user.user_id, []);
      });
    }
  }

  @Mutation
  private reset() {
    this.tempUser = new I.DalsaeUser();
  }

  @Action
  public Reset() {
    this.context.commit('reset');
  }

  @Mutation
  private updateUserInfo(user: I.User) {
    const updateUser = this.switter.listUser?.find(x => x.user_id === user.id_str);
    if (updateUser) {
      updateUser.user = user;
      updateUser.name = user.name;
      updateUser.screen_name = user.screen_name;
    }
    if (this.switter.selectUser.user_id === user.id_str) {
      this.switter.selectUser.user = user;
    }
  }

  @Mutation
  private changeAccount(user: I.DalsaeUser) {
    console.log('change account', user.user_id);
    this.switter.selectUser = user;
  }

  @Action
  public UpdateUserInfo(user: I.User) {
    this.context.commit('updateUserInfo', user);
  }

  @Mutation
  private blockIds(ids: string[]) {
    this.listBlockIds = this.listBlockIds.concat(ids);
  }

  @Action
  public BlockIds(ids: string[]) {
    this.context.commit('blockIds', ids);
  }

  @Mutation
  private muteIds(ids: string[]) {
    const selectId = this.switter.selectUser.user_id;
    const list = this.dicMuteIds.get(selectId);
    console.log('muteids', selectId, ids);
    if (!list) {
      if (selectId) this.dicMuteIds.set(selectId, ids);
    } else {
      list.push(...ids);
    }
  }

  @Action
  MuteIds(ids: string[]) {
    this.context.commit('muteIds', ids);
  }

  @Action
  public ChangeAccount(user: I.DalsaeUser) {
    this.context.commit('changeAccount', user);
  }

  @Mutation
  initFollowDatas(datas: FollowDatas) {
    this.followDatas.dicUsers = datas.dicUsers;
  }

  @Action
  InitFollowDatas(datas: FollowDatas) {
    this.context.commit('initFollowDatas', datas);
  }

  @Mutation
  private addFollowingList(listUser: I.FollowerList) {
    this.followDatas.AddFollowing(listUser.users, this.selectID);
  }

  @Action
  AddFollowingList(listUser: I.FollowerList) {
    this.context.commit('addFollowingList', listUser);
  }

  @Mutation
  private addFollowerList(listUser: I.FollowerList) {
    this.followDatas.AddFollower(listUser.users, this.selectID);
  }

  @Action
  AddFollowerList(listUser: I.FollowerList) {
    this.context.commit('addFollowerList', listUser);
  }

  @Mutation
  private initBlockIds(ids: string[]) {
    this.listBlockIds = ids;
  }

  @Action
  InitBlockIds(ids: string[]) {
    this.context.commit('initBlockIds', ids);
  }

  @Mutation
  private updateFollowInfo(user: I.User) {
    this.followDatas.UpdateUserInfo(user, this.selectID);
  }

  @Action
  UpdateFollowInfo(user: I.User) {
    this.context.commit('updateFollowInfo', user);
  }
}

export const moduleSwitter = getModule(SwitterStore);
