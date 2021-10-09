import { Vue, Mixins, Component, Inject, Ref, Prop } from 'vue-property-decorator';
import * as I from '@/Interfaces';

@Component
export class ImagePopupPreviewBase extends Mixins(Vue) {
  @Prop()
  media!: I.Media;
}
