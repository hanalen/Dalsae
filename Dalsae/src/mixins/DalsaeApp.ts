/* eslint-disable @typescript-eslint/camelcase */
import * as I from '@/Interfaces';
import * as MIX from '@/mixins';
import * as M from '@/Managers';
import { Vue, Component, Provide, Ref, Watch } from 'vue-property-decorator';
import store from '@/store/index';
import { moduleSwitter } from '@/store/modules/SwitterStore';
import { moduleOption } from '@/store/modules/OptionStore';
import { moduleModal } from '@/store/modules/ModalStore';
import faker, { fake } from 'faker';
import { moduleTweet } from '@/store/modules/TweetStore';
import { moduleUI } from '@/store/modules/UIStore';
import { moduleApi } from '@/store/modules/APIStore';
@Component
export class DalsaeApp extends Vue {
  get selectUserID() {
    return moduleSwitter.selectID;
  }

  @Watch('selectUserID', { immediate: true, deep: true })
  OnChangeData(newID: string, oldID: string) {
    this.$nextTick(() => {
      if (!newID && !moduleSwitter.selectUser) {
        moduleModal.ShowPinModal(true);
      }
      if (newID && oldID) {
        this.StartDalsae();
      }
    });
  }

  async created() {
    moduleTweet.Init(moduleSwitter.selectID);
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
    moduleOption.ChangeOptions(option);
    if (!option) {
      const { uiOption, muteOption, hotKey } = moduleOption;
      window.preload.SaveOption({ uiOption: uiOption, muteOption: muteOption, hotKey: hotKey });
    }
  }

  OnOptionChange() {
    if (moduleModal.bOption) return; //open할때
    window.preload.SaveOption({
      hotKey: moduleOption.hotKey,
      muteOption: moduleOption.muteOption,
      uiOption: moduleOption.uiOption
    });
  }

  async StartDalsae() {
    if (moduleSwitter.selectUser) {
      //api 콜 등등
      //홈, 멘션, 관글, 차단 비동기로 호출
      //사용자 정보의 경우 그때그때 호출 하고 인장은 switter에 저장 해놓자
      await moduleApi.account.VerifyCredentials(); //사용자 정보 수신 대기 후 user 최신 정보 update
      window.preload.SaveSwitter(store.state.switter.switter);
      moduleApi.statuses.TimeLine();
      // moduleApi.statuses.Mention();
      // moduleApi.block.Ids({ cursor: '-1', stringify_ids: true });
    }
  }

  async OnKeyDownHotKey(hotKeyType: I.E_HOTKEY) {
    console.log('hotkey', hotKeyType);
    switch (hotKeyType) {
      case I.E_HOTKEY.SHOWTL:
        moduleUI.ChangeMenu(0);
        break;
      case I.E_HOTKEY.SHOWMENTION:
        moduleUI.ChangeMenu(1);
        break;
      case I.E_HOTKEY.SHOWDM:
        moduleUI.ChangeMenu(2);
        break;
      case I.E_HOTKEY.SHOWFAVORITE:
        moduleUI.ChangeMenu(3);
        break;
      case I.E_HOTKEY.SHOWURL:
        moduleUI.ChangeMenu(4);
        break;
    }
  }
}
