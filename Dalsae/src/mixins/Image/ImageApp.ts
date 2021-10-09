import * as I from '@/Interfaces';
import * as MIX from '@/mixins';
import * as M from '@/Managers';
import { Vue, Component, Provide, Ref } from 'vue-property-decorator';

@Component
export class ImageApp extends Vue implements MIX.ImagePageBase {
  @Provide()
  tweet!: I.Tweet;

  @Provide()
  option!: I.UIOption;
}
