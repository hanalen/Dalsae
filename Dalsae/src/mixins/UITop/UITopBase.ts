/* eslint-disable @typescript-eslint/camelcase */
import { mixins } from 'vue-class-component';
import { Vue, Component, Inject, Emit, Watch } from 'vue-property-decorator';
import { DalsaePage } from '@/mixins';
import * as M from '@/Managers';
import * as I from '@/Interfaces';
import store from '@/store';

class State {
  tweet: string;
  listImage: string[];
  constructor() {
    this.tweet = '';
    this.listImage = [];
  }
}

@Component
export class UITopBase extends mixins(Vue, DalsaePage) {
  state = new State();
  user = store.state.switter.switter;
  propicPath = '';
  option = store.state.option.uiOption;

  @Watch('user', { immediate: true, deep: true })
  OnUserChanged(switter: I.Switter) {
    const user = switter.selectUser.user;
    if (!user) this.propicPath = '';
    else
      this.propicPath = this.option.isBigPropic
        ? user.profile_image_url_https.replace('_normal', '_bigger')
        : user.profile_image_url_https;
  }

  get isShowPropic() {
    return store.state.option.uiOption.isShowPropic;
  }

  get propicClass() {
    const option = store.state.option.uiOption;
    if (option.isBigPropic) return 'big';
    else return 'normal';
  }
}
