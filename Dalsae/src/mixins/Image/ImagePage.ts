import { Vue, Mixins, Component, Inject, Emit, Prop, Provide } from 'vue-property-decorator';
import * as MIX from '@/mixins';
import * as I from '@/Interfaces';

class State {
  download: number;
  constructor() {
    this.download = 0;
  }
}

@Component
export class ImagePage extends Vue {
  state = new State();
  tweet!: I.Tweet;
  option!: I.UIOption;
  index = 0;
  get orgTweet() {
    return this.tweet.retweeted_status ? this.tweet.retweeted_status : this.tweet; //원본 트윗 저장
  }

  get media() {
    return this.orgTweet.extended_entities.media;
  }

  @Provide()
  PreviewClick(media: I.Media) {
    console.log(media);
    for (let i = 0; i < this.media.length; i++) {
      if (media.media_url_https === this.media[i].media_url_https) {
        this.index = i;
        break;
      }
    }
  }
}
