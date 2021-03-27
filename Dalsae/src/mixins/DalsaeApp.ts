import TwitterAPI from '@/API/APICall';
import * as I from '@/Interfaces';
import * as MIX from '@/mixins';
import * as M from '@/Managers';
import { Vue, Component, Provide, Ref } from 'vue-property-decorator';

@Component
export class DalsaeApp extends Vue implements MIX.DalsaePageBase {
  @Provide()
  api = new M.APIManager();
  @Provide()
  mngAccount = new M.AccountManager();

  @Provide()
  mngOption = new M.OptionManager();

  @Provide()
  mngTweet = new M.TweetDataManager();

  @Ref()
  messageModal!: MIX.MessageModalBase;

  @Ref()
  pinModal!: MIX.PinModalBase;

  @Provide()
  tweetPanel = new MIX.TweetPanelBase();

  @Provide()
  async ShowMessage(msg: string) {
    if (!this.messageModal) return;
    this.messageModal.ShowModal(msg);
  }

  async created() {
    this.Init();
    this.LoadConfig();
    this.$nextTick(() => {
      this.StartDalsae();
    });
  }

  Init() {
    this.api.api.mngAccount = this.mngAccount; //나중에 이 구조는 바꾸는 게 좋을 거 같다
    this.api.mngAccount = this.mngAccount;
    this.api.mngTweet = this.mngTweet;
    this.tweetPanel.mngTweet = this.mngTweet;
    this.api.ShowMessage = this.ShowMessage;
    this.api.ShowConfirm = this.ShowConfirm;
  }

  LoadConfig() {
    window.preload.LoadConfig();
    const switter = window.preload.LoadSwitter();
    if (switter) {
      this.mngAccount.switter = switter;
    }
    const option = window.preload.LoadOption();
    this.mngOption = option ? option : new M.OptionManager();
  }

  @Provide()
  async StartDalsae() {
    // this.LoadTestTweet();
    if (this.mngAccount.selectUser) {
      //api 콜 등등
      //홈, 멘션, 관글, 차단 비동기로 호출
      //사용자 정보의 경우 그때그때 호출 하고 인장은 switter에 저장 해놓자
      this.api.call.account.VerifyCredentials();
      await this.api.call.account.VerifyCredentials(); //사용자 정보 수신 대기 후 user 최신 정보 update
      window.preload.SaveSwitter(this.mngAccount.switter);
      this.api.call.statuses.TimeLine();
      this.api.call.statuses.Mention();
    } else {
      this.ShowPin();
    }
  }

  LoadTestTweet() {
    const tweet = window.preload.LoadTestTweet();
    this.mngTweet.homes = tweet;
    this.mngTweet.mentions = tweet;
    this.mngTweet.favorites = tweet;
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
}
