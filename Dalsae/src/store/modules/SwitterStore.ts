/* eslint-disable @typescript-eslint/camelcase */
import * as I from '@/Interfaces';
import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators';
import * as A from '@/store/Interface';
import store from '@/store';
export interface ISwitterState {
  switter: I.Switter;
}

@Module({ dynamic: true, store, name: 'switter' })
class SwitterStore extends VuexModule {
  // states
  switter!: I.Switter;
  public tempUser!: I.DalsaeUser;

  // getters
  get selectID() {
    let id = this.switter?.selectUser.user_id;
    id = id ? id : '';
    return id;
  }

  // mutations
  @Mutation
  private setKey(setkey: A.SetKey) {
    console.log('mutateion');
    console.log(setkey);
    this.tempUser = new I.DalsaeUser();
    this.tempUser.oauth_token = setkey.publicKey;
    this.tempUser.oauth_token_secret = setkey.secretKey;
  }

  @Action
  public SetKey(setKey: A.SetKey) {
    console.log('setkey action');
    console.log(setKey);
    this.context.commit('setKey', setKey);
  }

  @Mutation
  private initSwitter(switter: I.Switter) {
    console.log('init switter mutation');
    this.switter = switter;
  }

  @Action({ commit: 'initSwitter' })
  public InitSwitter(switter: I.Switter) {
    console.log('init switter');
    console.log(switter);
    this.context.commit('initSwitter', switter);
  }
}

export const moduleSwitter = getModule(SwitterStore);
