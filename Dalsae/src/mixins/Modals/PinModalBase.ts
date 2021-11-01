/* eslint-disable @typescript-eslint/camelcase */
import { mixins } from 'vue-class-component';
import { Vue, Component, Inject, Emit, Watch } from 'vue-property-decorator';
import store from '@/store';
import { moduleSwitter } from '@/store/modules/SwitterStore';
import { moduleModal } from '@/store/modules/ModalStore';
import { moduleApi } from '@/store/modules/APIStore';
import * as I from '@/Interfaces';

class State {
  pin: string;
  constructor() {
    this.pin = '';
  }
}

@Component
export class PinModalBase extends Vue {
  state = new State();

  get isShow() {
    return moduleModal.bPin;
  }
  set isShow(bShow: boolean) {
    moduleModal.ShowPinModal(bShow);
  }

  @Watch('isShow', { immediate: true, deep: true })
  OnChangeShow(newVal: boolean) {
    if (newVal) {
      this.ShowModal();
    }
  }

  async ShowModal() {
    moduleSwitter.SetStateSwitter({ ...moduleSwitter.stateSwitter, tempUser: new I.DalsaeUser() });
    this.state.pin = '';
    const result = await moduleApi.oauth.ReqToken({ oauth_callback: 'oob' });
    if (!result.data) return;
    result.data.oauth_token_secret;
    console.log(result.data);
    window.preload.OpenBrowser(
      `https://api.twitter.com/oauth/authorize?oauth_token=${result.data.oauth_token}`
    );
    const user = new I.DalsaeUser();
    user.oauth_token = result.data.oauth_token;
    user.oauth_token_secret = result.data.oauth_token_secret;
    moduleSwitter.SetStateSwitter({ ...moduleSwitter.stateSwitter, tempUser: user });
    //아래 방법도 사용 가능
    // store.dispatch('SetKey', {
    //   publicKey: result.data.oauth_token,
    //   secretKey: result.data.oauth_token_secret
    // });
  }

  async GetAccessToken(pin: string) {
    const result = await moduleApi.oauth.ReqAccessToken({ oauth_verifier: pin });
    if (result.data) {
      window.preload.SaveSwitter(moduleSwitter.stateSwitter.switter);
      this.CloseModal();
    }
  }

  async ClickOk() {
    await this.GetAccessToken(this.state.pin);
    this.CloseModal();
  }

  async ClickClose() {
    this.CloseModal();
  }

  async CloseModal() {
    moduleModal.ShowPinModal(false);
    this.state.pin = '';
  }
}
