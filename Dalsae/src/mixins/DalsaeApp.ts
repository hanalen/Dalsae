import TwitterAPI from '@/API/APICall';
import * as I from '@/Interfaces';
import * as MIX from '@/mixins';
import * as M from '@/Managers';
import { Vue, Component, Provide, Ref } from 'vue-property-decorator';
import { createApiManager } from '@/Managers';
import store from '@/store/index';
import { moduleSwitter } from '@/store/modules/SwitterStore';

@Component
export class DalsaeApp extends Vue implements MIX.DalsaePageBase {
  @Provide()
  api = createApiManager(this.ShowMessage, this.ShowConfirm);

  @Provide()
  mngOption = new M.OptionManager();

  @Ref()
  messageModal!: MIX.MessageModalBase;

  @Ref()
  pinModal!: MIX.PinModalBase;

  @Ref()
  optionDetailModal!: MIX.OptionDetailModalBase;

  @Provide()
  tweetPanel = new MIX.TweetPanelBase();

  @Provide()
  async ShowMessage(msg: string) {
    if (!this.messageModal) return;
    this.messageModal.ShowModal(msg);
  }

  async created() {
    this.LoadConfig();
    this.$nextTick(() => {
      this.StartDalsae();
    });
  }

  LoadConfig() {
    window.preload.LoadConfig();
    const switter = window.preload.LoadSwitter();
    if (switter) {
      moduleSwitter.InitSwitter(switter);
    }
    const option = window.preload.LoadOption();
    this.mngOption.ChangeOptions(option);
  }

  OnOptionChange() {
    if (this.isShowOptionModal) return; //open할때
    window.preload.SaveOption(this.mngOption);
  }

  @Provide()
  async StartDalsae() {
    // this.LoadTestTweet();
    if (moduleSwitter.selectUser) {
      //api 콜 등등
      //홈, 멘션, 관글, 차단 비동기로 호출
      //사용자 정보의 경우 그때그때 호출 하고 인장은 switter에 저장 해놓자
      await this.api.call.account.VerifyCredentials(); //사용자 정보 수신 대기 후 user 최신 정보 update
      window.preload.SaveSwitter(store.state.switter.switter);
      this.api.call.statuses.TimeLine();
      this.api.call.statuses.Mention();
    } else {
      this.ShowPin();
    }
  }

  @Provide()
  async ShowConfirm(msg: string): Promise<boolean> {
    return new Promise(resolve => {
      resolve(false);
    });
  }

  @Provide()
  async ShowPin() {
    console.log('showpin');
    if (!this.pinModal) return;
    this.pinModal.ShowModal();
  }

  @Provide()
  async ShowOptionDetailModal() {
    this.optionDetailModal.ShowModal();
  }

  @Provide()
  isShowOptionModal = false;

  @Provide()
  async ShowOptionModal() {
    console.log(this.isShowOptionModal);
    this.isShowOptionModal = !this.isShowOptionModal;
  }

  @Provide()
  async AccountChange(user: I.DalsaeUser) {
    store.dispatch('ChangeAccount', user);
    this.StartDalsae();
  }
}
