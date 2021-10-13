/* eslint-disable @typescript-eslint/camelcase */
import * as I from '@/Interfaces';
import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '@/store';

@Module({ dynamic: true, store, name: 'modal' })
class ModalStore extends VuexModule {
  // states
  bMessage = false;
  bPin = false;
  bOptionDetail = false;
  bOption = false;
  message = '';

  @Action
  ChangeMenu(menu: number) {
    this.context.commit('changeMenu', menu);
  }

  @Mutation
  private showOptionModal(bShow: boolean) {
    this.bOption = bShow;
  }

  @Mutation
  private showPinModal(bShow: boolean) {
    this.bPin = bShow;
  }
  @Mutation
  private showMessageModal(bShow: boolean) {
    this.bMessage = bShow;
  }
  @Mutation
  private showOptionDetailModal(bShow: boolean) {
    this.bOptionDetail = bShow;
  }
  @Mutation
  private closeAll() {
    this.bPin = false;
    this.bMessage = false;
    this.bOptionDetail = false;
  }

  @Action
  ShowPinModal(bShow: boolean) {
    this.context.commit('showPinModal', bShow);
  }

  @Action
  ShowMessageModal(bShow: boolean) {
    this.context.commit('showMessageModal', bShow);
  }
  @Action
  ShowOptionDetailModal(bShow: boolean) {
    this.context.commit('showOptionDetailModal', bShow);
  }
  @Action
  ShowOptionModal(bShow: boolean) {
    this.context.commit('showOptionModal', bShow);
  }

  @Action
  CloseAll() {
    this.context.commit('closeAll');
  }
}

export const moduleModal = getModule(ModalStore);
