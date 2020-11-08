import TwitterAPI from '@/API/APICall';
import * as I from '@/Interfaces';
import * as MIX from '@/mixins';
import * as M from '@/Managers';
import { Vue, Component, Provide, Ref } from 'vue-property-decorator';

@Component
export class DalsaeApp extends Vue implements MIX.DalsaePageBase {
  @Provide()
  api = new TwitterAPI();

  @Ref()
  messageModal!: MIX.MessageModalBase;

  @Ref()
  pinModal!: MIX.PinModalBase;

  @Provide()
  async ShowMessage(msg: string) {
    if (!this.messageModal) return;
    this.messageModal.ShowModal(msg);
  }

  async created() {
    this.LoadConfig();
    this.$nextTick(() => {
      this.StardDalsae();
    });
  }

  LoadConfig() {
    window.preload.LoadConfig();
    M.AccountMng.switter = window.preload.LoadSwitter();
  }

  async StardDalsae() {
    if (M.AccountMng.selectUser) {
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
