/* eslint-disable @typescript-eslint/camelcase */
import * as I from '@/Interfaces';
import * as MIX from '@/mixins';
import { Vue, Component, Provide, Ref, Watch } from 'vue-property-decorator';
import store from '@/store/index';
import { moduleSwitter } from '@/store/modules/SwitterStore';
import { moduleOption } from '@/store/modules/OptionStore';
import { moduleModal } from '@/store/modules/ModalStore';
import faker, { fake } from 'faker';
import { moduleTweet } from '@/store/modules/TweetStore';
import { moduleUI } from '@/store/modules/UIStore';
import { moduleApi } from '@/store/modules/APIStore';
import { eventBus } from '@/plugins';
import { moduleUtil } from '@/store/modules/UtilStore';
import { ETweetType } from '@/store/Interface';
import { UserStreaming } from '@/API';
import { moduleDom } from '@/store/modules/DomStore';
import { moduleDm } from '@/store/modules/DmStore';
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
      if (oldID) {
        moduleTweet.StopStreaming(oldID);
      }
      if (newID && oldID) {
        moduleDom.ResetScrollDatas();
        this.StartDalsae();
      }
    });
  }

  async created() {
    // moduleTweet.Init(moduleSwitter.selectID);
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
      const testTweets = window.preload.LoadTestTweet();
      store.dispatch('AddTweet', {
        type: ETweetType.E_HOME,
        user_id_str: moduleSwitter.selectID,
        listTweet: testTweets
      });
      const following = window.preload.LoadTestFriends();
      const follower = window.preload.LoadTestFollower();
      const { followDatas } = moduleSwitter.stateIds;
      const datas = followDatas.dicUsers.get(moduleSwitter.selectID);
      if (datas) {
        datas.listFollowing = following;
        datas.listFollower = follower;
        moduleSwitter.SetStateIds({ ...moduleSwitter.stateIds, followDatas: followDatas });
      }

      const dms = window.preload.LoadTestDM();
      console.log(dms);
      moduleDm.AddDm(dms.events);
      //api 콜 등등
      //홈, 멘션, 관글, 차단 비동기로 호출
      //사용자 정보의 경우 그때그때 호출 하고 인장은 switter에 저장 해놓자
      // await moduleApi.account.VerifyCredentials(); //사용자 정보 수신 대기 후 user 최신 정보 update
      // window.preload.SaveSwitter(moduleSwitter.stateSwitter.switter);
      // moduleApi.friends.List({ screen_name: '', count: 200 }, moduleSwitter.selectID, true);
      // moduleApi.followers.List({ screen_name: '', count: 200 }, moduleSwitter.selectID, true);
      // moduleApi.mutes.Ids({ cursor: '-1', stringify_ids: true }, moduleSwitter.selectID);
      // moduleApi.block.Ids({ cursor: '-1', stringify_ids: true });
      // moduleApi.statuses.TimeLine();
      // moduleApi.statuses.Mention();
      // moduleApi.directMessage.List();
      // const streaming = new UserStreaming();
      // streaming.Connect(moduleSwitter.publicKey, moduleSwitter.secretKey, moduleSwitter.selectID);
      // moduleTweet.AddStreaming({ key: moduleSwitter.selectID, streaming: streaming });
    }
  }

  async OnKeyDownHotKey(hotKeyType: I.E_HOTKEY) {
    console.log('hotkey', hotKeyType);
    let selectTweet: I.Tweet | undefined = undefined;
    if (moduleUI.selectTweet) selectTweet = moduleUI.selectTweet;
    switch (hotKeyType) {
      case I.E_HOTKEY.SHOWTL:
        moduleUI.SetStateUI({ ...moduleUI.stateUI, selectMenu: ETweetType.E_HOME });
        break;
      case I.E_HOTKEY.SHOWMENTION:
        moduleUI.SetStateUI({ ...moduleUI.stateUI, selectMenu: ETweetType.E_MENTION });
        break;
      case I.E_HOTKEY.SHOWDM:
        moduleUI.SetStateUI({ ...moduleUI.stateUI, selectMenu: ETweetType.E_DM });
        break;
      case I.E_HOTKEY.SHOWFAVORITE:
        moduleUI.SetStateUI({ ...moduleUI.stateUI, selectMenu: ETweetType.E_FAVORITE });
        break;
      case I.E_HOTKEY.SHOWURL:
        moduleUI.SetStateUI({ ...moduleUI.stateUI, selectMenu: ETweetType.E_OPEN });
        break;
      case I.E_HOTKEY.SENDDM:
        break;
      case I.E_HOTKEY.LOADING:
        moduleUtil.LoadTweets();
        break;
      case I.E_HOTKEY.COPY:
        if (selectTweet) moduleUtil.CopyTweet(selectTweet);
        break;
      case I.E_HOTKEY.LOADCONV:
        if (selectTweet) {
          moduleUtil.LoadConv(selectTweet);
          moduleUI.SetStateUI({ ...moduleUI.stateUI, selectMenu: ETweetType.E_CONV });
        }
        break;
      case I.E_HOTKEY.SHOWQT:
        moduleTweet.AddTweet({
          tweet: selectTweet,
          listTweet: undefined,
          user_id_str: moduleSwitter.selectID,
          type: ETweetType.E_CONV
        });
        moduleUI.SetStateUI({ ...moduleUI.stateUI, selectMenu: ETweetType.E_CONV });
        break;
      case I.E_HOTKEY.SENDQT:
        if (selectTweet) moduleUtil.OnClickQt(selectTweet);
        break;
      case I.E_HOTKEY.HASH:
        if (selectTweet) moduleUtil.AddHashs(selectTweet);
        break;
      case I.E_HOTKEY.DELETE:
        if (selectTweet) moduleApi.statuses.Destroy(selectTweet);
        break;
      case I.E_HOTKEY.INPUT:
        break;
      case I.E_HOTKEY.SHOWCONTEXT:
        if (selectTweet) eventBus.$emit('ShowContextMenu', selectTweet.id_str);
        break;
      case I.E_HOTKEY.HOME:
        eventBus.$emit('PanelHome', moduleUI.stateUI.selectMenu);
        moduleUI.Home(moduleUI.stateUI.selectMenu);
        break;
      case I.E_HOTKEY.END:
        eventBus.$emit('PanelEnd', moduleUI.stateUI.selectMenu);
        moduleUI.End(moduleUI.stateUI.selectMenu);
        break;
      case I.E_HOTKEY.SHOWIMAGE:
        if (selectTweet) moduleUtil.OpenImage(selectTweet);
        break;
      case I.E_HOTKEY.RETWEET:
        moduleUtil.Retweet(selectTweet);
        break;
      case I.E_HOTKEY.SENDFAVORITE:
        if (selectTweet) moduleApi.favorites.Create(selectTweet);
        break;
      case I.E_HOTKEY.REPLY:
        if (selectTweet) moduleUtil.Reply(selectTweet);
        break;
      case I.E_HOTKEY.REPLYALL:
        if (selectTweet) moduleUtil.ReplyAll(selectTweet);
        break;
    }
  }
}
