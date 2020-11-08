import * as I from '@/Interfaces';
import * as M from '@/mixins';
import { Vue, Component, Provide, Ref } from 'vue-property-decorator';

@Component
export class DalsaeApp extends Vue implements M.DalsaePageBase {
  @Ref()
  messageModal!: M.MessageModalBase;

  @Provide()
  async ShowMessage(msg: string) {
    console.log('provide msg', msg);
    if (!this.messageModal) return;
    this.messageModal.state.isShow = true;
    this.messageModal.state.msg = msg;
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
  }
}
