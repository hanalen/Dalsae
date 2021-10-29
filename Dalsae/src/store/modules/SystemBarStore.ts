/* eslint-disable @typescript-eslint/camelcase */
import * as I from '@/Interfaces';
import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '@/store';
import * as A from '@/store/Interface';
import * as M from '@/mixins';
import { moduleSwitter } from './SwitterStore';

class StateSystemBar {
  listSystemBarItem: A.SystemBarItem[];
  constructor() {
    this.listSystemBarItem = [];
  }
}

@Module({ dynamic: true, store, name: 'systembar' })
class SystemBarStore extends VuexModule {
  // states
  stateSystemBar = new StateSystemBar();

  @Mutation
  private addSystemBar(item: A.SystemBarItem) {
    this.stateSystemBar.listSystemBarItem.push(item);
  }

  @Action
  AddSystemBar(item: A.SystemBarItem) {
    this.context.commit('addSystemBar', item);
  }
}

export const moduleSysbar = getModule(SystemBarStore);
