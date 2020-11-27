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
}
