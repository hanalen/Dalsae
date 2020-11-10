import { mixins } from 'vue-class-component';
import { Vue, Component, Inject, Emit } from 'vue-property-decorator';
import { DalsaePage } from '@/mixins';
import * as M from '@/Managers';

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
  get propic() {
    return 'https://pbs.twimg.com/profile_images/782880157786791936/TTJ7Fo5c_400x400.jpg';
    const option = this.mngOption.uiOption;
    // eslint-disable-next-line @typescript-eslint/camelcase
    const url = this.mngAccount.selectUser?.user?.profile_image_url_https;
    return option.isBigPropic ? url?.replace('_normal', '_bigger') : url;
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
