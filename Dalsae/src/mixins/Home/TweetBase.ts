import { Vue, Mixins, Component, Inject, Emit, Prop, Provide } from 'vue-property-decorator';
import * as MIX from '@/mixins';
import * as I from '@/Interfaces';
import moment from 'moment';
import { moduleOption } from '@/store/modules/OptionStore';
import store from '@/store';

@Component
export class TweetBase extends Vue {
  @Prop()
  tweet!: I.Tweet;

  @Prop()
  selected!: boolean;

  get isRetweet() {
    return this.tweet.retweeted_status !== undefined;
  }

  get isQT() {
    return this.tweet.is_quote_status;
  }

  get qtTweet() {
    return new I.Tweet(this.orgTweet.quoted_status);
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
    return this.tweet.retweeted_status ? this.tweet.retweeted_status : this.tweet; //원본 트윗 저장
  }

  get orgUser() {
    return this.orgTweet.user;
  }

  get media() {
    return this.orgTweet.extended_entities?.media;
  }

  get name() {
    return this.orgUser.screen_name + ' / ' + this.orgUser.name;
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
    text = text.replace(/(?:\r\n|\r|\n)/g, '<br />');
    return text;
  }
}
