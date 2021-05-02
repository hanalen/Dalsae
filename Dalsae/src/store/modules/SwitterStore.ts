/* eslint-disable @typescript-eslint/camelcase */
import * as I from '@/Interfaces';
import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators';
import * as A from '@/store/Interface';
import store from '@/store';
import { moduleTweet } from '@/store/modules/TweetStore';
export interface ISwitterState {
  switter: I.Switter;
  tempUser: I.DalsaeUser;
}

@Module({ dynamic: true, store, name: 'switter' })
class SwitterStore extends VuexModule {
  // states
  switter: I.Switter = { selectUser: new I.DalsaeUser(), listUser: [] };
  tempUser: I.DalsaeUser = new I.DalsaeUser();
  bolckIds: string[] = [];

  // getters
  get selectID() {
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
      const selUser = this.switter.selectUser;
      selUser.oauth_token = publicKey;
      selUser.oauth_token_secret = secretKey;
      selUser.name = name;
      selUser.screen_name = screenName;
      selUser.user_id = userId;
      this.switter.listUser?.push(JSON.parse(JSON.stringify(selUser)));
      console.log('sel user------');
      console.log(selUser);
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
    console.log(this.switter);
  }

  @Action
  public InitSwitter(switter: I.Switter) {
    this.context.commit('initSwitter', switter);
    if (switter) {
      switter.listUser?.forEach(user => {
        moduleTweet.Init(user.user_id);
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
    this.switter.listUser?.forEach(item => {
      item.user = user;
      item.name = user.name;
    });
    if (this.switter.selectUser.user_id === user.id_str) {
      this.switter.selectUser.user = user;
    }
  }

  @Action
  public UpdateUserInfo(user: I.User) {
    this.context.commit('updateUserInfo', user);
  }

  @Mutation
  private blockIds(ids: string[]) {
    this.bolckIds = this.bolckIds.concat(ids);
  }

  @Action
  public BlockIds(ids: string[]) {
    this.context.commit('blockIds', ids);
  }
}

export const moduleSwitter = getModule(SwitterStore);
