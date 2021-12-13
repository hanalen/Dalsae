import { mixins } from 'vue-class-component';
import { Vue, Component, Inject, Emit } from 'vue-property-decorator';
import * as I from '@/Interfaces';
import { moduleModal } from '@/store/modules/ModalStore';
import { moduleSwitter } from '@/store/modules/SwitterStore';
import { EIPcType } from '..';
import { moduleOption } from '@/store/modules/OptionStore';
class State {
  isShow: boolean;
  msg: string;
  title: string;
  buttons: string[];
  constructor() {
    this.isShow = false;
    this.msg = '';
    this.title = '';
    this.buttons = [];
  }
}
@Component
export class OptionModalBase extends Vue {
  state: State = new State();

  get appPath() {
    return moduleOption.appPath;
  }

  get version() {
    return window.ipc.files.GetVersion();
  }

  OnClickAddAccount() {
    moduleModal.ShowOptionModal(true);
    moduleModal.ShowPinModal(true);
  }

  OnClickAccount(account: I.DalsaeUser) {
    moduleModal.ShowOptionModal(false);
    moduleSwitter.SetStateSwitter({
      ...moduleSwitter.stateSwitter,
      switter: { ...moduleSwitter.stateSwitter.switter, selectUser: account }
    });
  }

  OnClickOptionDetail() {
    moduleModal.ShowOptionModal(false);
    moduleModal.ShowOptionDetailModal(true);
  }

  get listUser() {
    return moduleSwitter.stateSwitter.switter.listUser;
  }
  // OnClickChangePath() {
  //   window.ipc.ipcPipe.openPathSetting();
  // }
  OnClickOpenPath() {
    // path
    window.ipc.browser.OpenFolder(this.appPath);
  }
}
