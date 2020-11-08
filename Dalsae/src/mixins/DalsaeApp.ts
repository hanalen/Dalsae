import TwitterAPI from '@/API/APICall';
import * as I from '@/Interfaces';
import * as M from '@/mixins';
import { Vue, Component, Provide, Ref } from 'vue-property-decorator';

@Component
export class DalsaeApp extends Vue implements M.DalsaePageBase {
  @Provide()
  api = new TwitterAPI();

  @Ref()
  messageModal!: M.MessageModalBase;

  @Ref()
  pinModal!: M.PinModalBase;

  @Provide()
  async ShowMessage(msg: string) {
    if (!this.messageModal) return;
    this.messageModal.ShowModal(msg);
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
