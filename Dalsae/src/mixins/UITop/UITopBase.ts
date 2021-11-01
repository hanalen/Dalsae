/* eslint-disable @typescript-eslint/camelcase */
import { mixins } from 'vue-class-component';
import { Vue, Component, Inject, Emit, Watch } from 'vue-property-decorator';
import * as I from '@/Interfaces';
import store from '@/store';
import { moduleOption } from '@/store/modules/OptionStore';
import { moduleSwitter } from '@/store/modules/SwitterStore';

class State {
  tweet: string;
  listImage: string[];
  constructor() {
    this.tweet = '';
    this.listImage = [];
  }
}

@Component
export class UITopBase extends Vue {
  state = new State();
  get selectUser() {
    return moduleSwitter.stateSwitter.switter.selectUser;
  }
  propicPath = '';
  option = moduleOption.uiOption;

  @Watch('selectUser', { immediate: true, deep: true })
  OnUserChanged(dalsaeUser: I.DalsaeUser) {
    const user = dalsaeUser.user;
    this.propicPath = this.option.isBigPropic
      ? user.profile_image_url_https.replace('_normal', '')
      : user.profile_image_url_https.replace('_normal', '_bigger');
  }

  get isShowPropic() {
    return moduleOption.uiOption.isShowPropic;
  }

  get propicClass() {
    const option = moduleOption.uiOption;
    if (option.isBigPropic) return 'big';
    else return 'normal';
  }
}
