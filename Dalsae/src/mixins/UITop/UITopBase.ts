/* eslint-disable @typescript-eslint/camelcase */
import { mixins } from 'vue-class-component';
import { Vue, Component, Inject, Emit, Watch } from 'vue-property-decorator';
import { DalsaePage } from '@/mixins';
import * as M from '@/Managers';
import * as I from '@/Interfaces';

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
  user = this.mngAccount.switter;
  propicPath = '';
  option = this.mngOption.uiOption;

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
    return this.mngOption.uiOption.isShowPropic;
  }

  get propicClass() {
    const option = this.mngOption.uiOption;
    if (option.isBigPropic) return 'big';
    else return 'normal';
  }
}
