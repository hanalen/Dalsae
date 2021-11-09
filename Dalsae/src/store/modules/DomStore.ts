/* eslint-disable @typescript-eslint/camelcase */
import * as I from '@/Interfaces';
import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '@/store';
import * as M from '@/mixins';

@Module({ dynamic: true, store, name: 'dom' })
class DomStore extends VuexModule {
  listScrollPanel: M.ScrollPanelBase[] = [];

  @Mutation
  private registeScrollPanel(panel: M.ScrollPanelBase) {
    this.listScrollPanel.push(panel);
  }

  @Action
  RegisteScrollPanel(panel: M.ScrollPanelBase) {
    this.context.commit('registeScrollPanel', panel);
  }

  @Mutation
  private resetScrollDatas() {
    this.listScrollPanel.forEach(item => {
      item.Clear();
    });
  }

  @Action
  ResetScrollDatas() {
    this.context.commit('resetScrollDatas');
  }
}

export const moduleDom = getModule(DomStore);
