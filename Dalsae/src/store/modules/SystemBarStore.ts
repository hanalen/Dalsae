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

  @Mutation
  private removeSystemBar(type: A.ESystemBar) {
    const idx = this.stateSystemBar.listSystemBarItem.findIndex(x => x.type === type);
    if (idx > -1) {
      this.stateSystemBar.listSystemBarItem.splice(idx, 1);
    }
  }

  @Action
  RemoveSystemBar(type: A.ESystemBar) {
    this.context.commit('removeSystemBar', type);
  }

  @Mutation
  private clearSystamBar() {
    this.stateSystemBar.listSystemBarItem = [];
  }

  @Action
  ClearSystamBar() {
    this.context.commit('clearSystamBar');
  }
}

export const moduleSysbar = getModule(SystemBarStore);
