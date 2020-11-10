import { mixins } from 'vue-class-component';
import { Vue, Component, Inject, Emit } from 'vue-property-decorator';
import { DalsaePage } from '@/mixins';
import * as M from '@/Managers';

class State {
  tweet: string;
  listImage: string[];
  constructor() {
    this.tweet = '';
    this.listImage = [];
  }
}

@Component
export class TweetInput extends mixins(Vue, DalsaePage) {
  state = new State();
}
