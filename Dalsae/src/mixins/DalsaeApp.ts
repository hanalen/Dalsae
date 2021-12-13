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

  get appPath() {
    return moduleOption.appPath;
  }

  get pathSound() {
    return this.appPath + '/Sound/' + this.pathSoundOrg;
  }

  get pathSoundOrg() {
    return moduleOption.muteOption.pathSound;
  }

  @Ref()
  refAudio!: HTMLAudioElement;

  @Watch('selectUserID', { immediate: true, deep: true })
  OnChangeData(newID: string, oldID: string) {
    this.$nextTick(() => {
      console.info('selct user id', newID, oldID);
      if (!newID && !moduleSwitter.selectUser.user_id) {
        moduleModal.ShowPinModal(true);
      }
      if (oldID) {
        moduleTweet.StopStreaming(oldID);
      }
      if (newID && !moduleModal.bPin) {
        moduleDom.ResetScrollDatas();
        this.StartDalsae();
      }
    });
  }

  async created() {
    // window.ipc.ipcPipe.on('GetAppPath', (data: object) => {
    //   this.appPath = data['path'];
    //   this.LoadConfig();
    // });
    this.LoadConfig();
    this.$nextTick(() => {
      window.ipc.ipcPipe.on('test_on', (data: object) => {
        console.log('callbacked! data:', data);
      });
      moduleDom.RegisterAudio(this.refAudio);
    });
  }

  LoadConfig() {
    window.ipc.files.LoadConfig();
    moduleOption.SetAppPath(window.ipc.files.GetAppPath());
    const switter = window.ipc.files.LoadSwitter();
    if (switter) {
      moduleSwitter.InitSwitter(switter);
    }
    const option = window.ipc.files.LoadOption();
    moduleOption.ChangeOptions(option);
    if (!option) {
      const { uiOption, muteOption, hotKey } = moduleOption;
      window.ipc.files.SaveOption({ uiOption: uiOption, muteOption: muteOption, hotKey: hotKey });
    }
  }

  OnOptionChange() {
    if (moduleModal.bOption) return; //open할때
    window.ipc.files.SaveOption({
      hotKey: moduleOption.hotKey,
      muteOption: moduleOption.muteOption,
      uiOption: moduleOption.uiOption
    });
  }

  async StartDalsae() {
    const id = moduleSwitter.selectID;
    if (id) {
      // const testTweets = window.ipc.files.LoadTestTweet();
      // store.dispatch('AddTweet', {
      //   type: ETweetType.E_HOME,
      //   user_id_str: id,
      //   listTweet: testTweets
      // });
      // const following = window.ipc.files.LoadTestFriends();
      // const follower = window.ipc.files.LoadTestFollower();
      // const { followDatas } = moduleSwitter.stateIds;
      // const datas = followDatas.dicUsers.get(id);
      // if (datas) {
      //   datas.listFollowing = following;
      //   datas.listFollower = follower;
      //   moduleSwitter.SetStateIds({ ...moduleSwitter.stateIds, followDatas: followDatas });
      // }

      // const dms = window.ipc.files.LoadTestDM();
      // console.log(dms);
      // moduleDm.AddDm(dms.events);
      //api 콜 등등
      //홈, 멘션, 관글, 차단 비동기로 호출
      //사용자 정보의 경우 그때그때 호출 하고 인장은 switter에 저장 해놓자
      await moduleApi.account.VerifyCredentials(); //사용자 정보 수신 대기 후 user 최신 정보 update
      window.ipc.files.SaveSwitter(moduleSwitter.stateSwitter.switter);
      moduleDm.ClearDM();
      moduleApi.friends.List({ screen_name: '', count: 200 }, id, true);
      moduleApi.followers.List({ screen_name: '', count: 200 }, id, true);
      const dicBlock = moduleSwitter.stateIds.dicBlockIds.get(id);
      const cursorBlock = dicBlock ? dicBlock.next_cursor_str : '-1';
      moduleApi.mutes.Ids({ cursor: '-1', stringify_ids: true }, id);
      moduleApi.block.Ids({ cursor: cursorBlock, stringify_ids: true }, id);
      moduleApi.statuses.TimeLine();
      moduleApi.statuses.Mention();
      moduleApi.directMessage.List();
      const streaming = new UserStreaming();
      streaming.Connect(moduleSwitter.publicKey, moduleSwitter.secretKey, id);
      moduleTweet.AddStreaming({ key: id, streaming: streaming });
    }
  }

  async OnKeyDownHotKey(hotKeyType: I.E_HOTKEY) {
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
        if (selectTweet) {
          moduleDm.StartDM(selectTweet.orgUser);
          moduleUI.SetStateUI({ ...moduleUI.stateUI, selectMenu: ETweetType.E_DM });
        }
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
        if (selectTweet) {
          moduleUtil.AddQtTweet(new I.Tweet(selectTweet.orgTweet.quoted_status));
        }
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
        moduleDom.stateDom.textArea.focus();
        break;
      case I.E_HOTKEY.SHOWCONTEXT:
        if (selectTweet) eventBus.$emit('ShowContextMenu', selectTweet.id_str);
        break;
      case I.E_HOTKEY.HOME:
        moduleUtil.ScrollToIndex(0);
        break;
      case I.E_HOTKEY.END:
        if (moduleUI.selectTweetList) {
          moduleUtil.ScrollToIndex(moduleUI.selectTweetList.length - 1);
        }
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
