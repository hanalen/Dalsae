/* eslint-disable @typescript-eslint/camelcase */
import * as I from '@/Interfaces';
import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '@/store';
export interface IOptionStore {
  uiOption: I.UIOption;
  muteOption: I.MuteOption;
  hotKey: I.Hotkey;
}

@Module({ dynamic: true, store, name: 'ui' })
class UIStore extends VuexModule {
  // states
  selectMenu = 0;

  @Mutation
  private changeMenu(menu: number) {
    this.selectMenu = menu;
  }
  @Action
  ChangeMenu(menu: number) {
    this.context.commit('changeMenu', menu);
  }
}

export const moduleUI = getModule(UIStore);
