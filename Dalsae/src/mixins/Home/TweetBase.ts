import { Vue, Mixins, Component, Inject, Emit, Prop, Provide } from 'vue-property-decorator';
import * as MIX from '@/mixins';
import * as I from '@/Interfaces';
import moment from 'moment';
import { moduleOption } from '@/store/modules/OptionStore';
import store from '@/store';
import { moduleSwitter } from '@/store/modules/SwitterStore';
import { moduleUtil } from '@/store/modules/UtilStore';
import { moduleUI } from '@/store/modules/UIStore';
import { ETweetType } from '@/store/Interface';

@Component
export class TweetBase extends Vue {
  @Prop()
  tweet!: I.Tweet;

  @Prop()
  selected!: boolean;

  OnClickConv() {
    moduleUtil.LoadConv(this.tweet);
    moduleUI.SetStateUI({ ...moduleUI.stateUI, selectMenu: ETweetType.E_CONV });
  }

  get isNoData() {
    if (this.tweet === undefined) return true;
    else {
      return this.tweet.created_at === '';
    }
  }

  get isRetweet() {
    return this.tweet.retweeted_status !== undefined;
  }

  get isQT() {
    return this.tweet.is_quote_status;
  }

  get qtTweet() {
    return this.orgTweet.quoted_status;
  }

  get retweetText() {
    return `${this.tweet.user.screen_name} / ${this.tweet.user.name}`;
  }

  get isConv() {
    return this.orgTweet.in_reply_to_status_id_str ? true : false;
  }

  get uiOption() {
    return moduleOption.uiOption;
  }

  get orgTweet() {
    return this.tweet.orgTweet;
  }

  get orgUser() {
    return this.tweet.orgUser;
  }

  get media() {
    return this.orgTweet.extended_entities?.media;
  }

  get name() {
    let ret = this.orgUser.screen_name + ' / ' + this.orgUser.name;
    if (this.orgUser.protected) ret += '🔒';
    return ret;
  }

  get date() {
    const locale = window.navigator.language;
    moment.locale(locale);
    const date = new Date(this.orgTweet.created_at);
    return moment(date).format('LLLL') + ':' + moment(date).format('ss');
  }

  get via() {
    let str = this.orgTweet.source;
    str = str.substring(str.indexOf('>') + 1, 999);
    str = str.substring(0, str.indexOf('<'));
    return ` / ${str}`;
  }

  get tweetText() {
    let text = this.orgTweet.full_text;
    const entities = this.orgTweet.entities;
    entities.media?.forEach(item => {
      text = text.replace(item.url, item.display_url);
    });
    entities.urls?.forEach(url => {
      text = text.replace(url.url, url.display_url);
    });
    moduleOption.muteOption.highlight.forEach(item => {
      text = text.replaceAll(item, `<span class="primary--text">${item}</span>`);
    });
    const screenName = moduleSwitter.selectUser.user.screen_name;
    text = text.replaceAll(`@${screenName}`, `<span class="primary--text">@${screenName}</span>`);
    text = text.replace(/(?:\r\n|\r|\n)/g, '<br />');
    if (this.tweet.isDelete) {
      text = '<del>' + text + '</del>';
    }
    return text;
  }

  get isShowPreview() {
    return moduleOption.uiOption.isShowPreview;
  }

  get styleTweetText() {
    if (moduleOption.uiOption.isUseRead && !this.tweet.isRead) {
      return {
        'font-weight': 'bold'
      };
    } else {
      return {
        'font-weight': 'normal'
      };
    }
  }

  get styleConv() {
    if (this.uiOption.isBigPropic) {
      return {
        top: '26px'
      };
    }
    return {
      top: '14px'
    };
  }
}
