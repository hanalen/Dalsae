import TwitterAPI from '@/API/APICall';
import * as I from '@/Interfaces';
import * as MIX from '@/mixins';
import * as M from '@/Managers';
import { Vue, Component, Provide, Ref } from 'vue-property-decorator';
import { TouchBarScrubber } from 'electron';

@Component
export class DalsaeApp extends Vue implements MIX.DalsaePageBase {
  @Provide()
  selectMenu = 0;

  @Provide()
  api = new TwitterAPI();

  @Provide()
  mngAccount = new M.AccountManager();

  @Provide()
  mngOption = new M.OptionManager();

  @Ref()
  messageModal!: MIX.MessageModalBase;

  @Ref()
  pinModal!: MIX.PinModalBase;

  @Provide()
  async ShowMessage(msg: string) {
    if (!this.messageModal) return;
    this.messageModal.ShowModal(msg);
  }

  @Provide()
  async MenuChange(menu: number) {
    this.selectMenu = menu;
  }

  async created() {
    this.LoadConfig();
    this.$nextTick(() => {
      this.StardDalsae();
    });
  }

  LoadConfig() {
    this.api.mngAccount = this.mngAccount; //나중에 이 구조는 바꾸는 게 좋을 거 같다
    window.preload.LoadConfig();
    this.mngAccount.switter = window.preload.LoadSwitter();
    const option = window.preload.LoadOption();
    this.mngOption = option ? option : new M.OptionManager();
  }

  async StardDalsae() {
    if (this.mngAccount.selectUser) {
      //api 콜 등등
      //홈, 멘션, 관글, 차단 비동기로 호출
      //사용자 정보의 경우 그때그때 호출 하고 인장은 switter에 저장 해놓자
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
}
