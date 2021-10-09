/* eslint-disable @typescript-eslint/camelcase */
import * as I from '@/Interfaces';
import * as MIX from '@/mixins';
import * as M from '@/Managers';
import { Vue, Component, Provide, Ref } from 'vue-property-decorator';
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
  }

  OnOptionChange() {
    if (moduleModal.bOption) return; //open할때
    window.preload.SaveOption(store.state.option);
  }

  LoadTestTweet() {
    const list: I.Tweet[] = [];
    for (let i = 0; i < 200; i++) {
      list.push({
        full_text: faker.lorem.text() + faker.lorem.text(),
        created_at: Date.now.toString(),
        entities: { hashtags: [], media: [], urls: [], user_mentions: [] },
        extended_entities: { media: [] },
        favorite_count: 0,
        favorited: false,
        id_str: faker.datatype.number(1000000).toString(),
        in_reply_to_screen_name: '',
        in_reply_to_status_id_str: '',
        in_reply_to_user_id_str: '',
        is_quote_status: false,
        place: '',
        retweet_count: 0,
        retweeted: false,
        retweeted_status: undefined,
        source: '',
        user: {
          profile_image_url_https: faker.image.avatar(),
          name: faker.name.firstName(),
          screen_name: faker.finance.accountName(),
          created_at: Date.now.toString(),
          default_profile: false,
          default_profile_image: false,
          description: '',
          favourites_count: 0,
          follow_request_sent: false,
          followers_count: 0,
          following: false,
          friends_count: 0,
          has_extended_profile: false,
          id_str: faker.datatype.number(1000000).toString(),
          listed_count: 0,
          location: '',
          profile_background_color: '',
          profile_background_image_url: '',
          profile_background_image_url_https: '',
          profile_background_tile: false,
          profile_banner_url: '',
          profile_image_url: faker.image.avatar(),
          profile_link_color: '',
          profile_sidebar_border_color: '',
          profile_sidebar_fill_color: '',
          protected: false,
          statuses_count: 0,
          verified: false
        }
      });
    }
    return list;
  }

  async StartDalsae() {
    if (moduleSwitter.selectUser) {
      //api 콜 등등
      //홈, 멘션, 관글, 차단 비동기로 호출
      //사용자 정보의 경우 그때그때 호출 하고 인장은 switter에 저장 해놓자
      await moduleApi.call.account.VerifyCredentials(); //사용자 정보 수신 대기 후 user 최신 정보 update
      window.preload.SaveSwitter(store.state.switter.switter);
      moduleApi.call.statuses.TimeLine();
      // moduleApi.call.statuses.Mention();
      // moduleApi.call.block.Ids({ cursor: '-1', stringify_ids: true });
    } else {
      moduleModal.ShowPinModal(true);
    }
  }

  async OnKeyDownHotKey(hotKeyType: I.E_HOTKEY) {
    switch (hotKeyType) {
      case I.E_HOTKEY.E_SHOWTL:
        moduleUI.ChangeMenu(1);
        break;
      case I.E_HOTKEY.E_SHOWMENTION:
        break;
    }
  }
}
