import { mixins } from 'vue-class-component';
import { Vue, Component, Inject, Emit } from 'vue-property-decorator';
import { DalsaePage } from '@/mixins';
import * as M from '@/Managers';

class State {
  isShow: boolean;
  pin: string;
  constructor() {
    this.isShow = false;
    this.pin = '';
  }
}

@Component
export class PinModalBase extends mixins(Vue, DalsaePage) {
  state = new State();

  async ShowModal() {
    this.mngAccount.Reset();
    this.state.isShow = true;
    this.state.pin = '';
    // eslint-disable-next-line @typescript-eslint/camelcase
    const result = await this.api.call.oauth.ReqToken({ oauth_callback: 'oob' });
    if (!result.data) return;
    result.data.oauth_token_secret;
    console.log(result.data);
    window.preload.OpenBrowser(
      `https://api.twitter.com/oauth/authorize?oauth_token=${result.data.oauth_token}`
    );
    this.mngAccount.SetKey(result.data.oauth_token, result.data.oauth_token_secret);
  }

  async GetAccessToken(pin: string) {
    // eslint-disable-next-line @typescript-eslint/camelcase
    const result = await this.api.call.oauth.ReqAccessToken({ oauth_verifier: pin });
    if (!result.data) return;
    this.mngAccount.AddUser(
      result.data.oauth_token,
      result.data.oauth_token_secret,
      result.data.user_id,
      result.data.name,
      result.data.screen_name
    );
    window.preload.SaveSwitter(this.mngAccount.switter);
  }
}
