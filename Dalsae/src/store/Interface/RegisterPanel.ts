import { ScrollPanelBase } from '@/mixins';
import { ETweetType } from './AddTweet';

export interface RegisterPanel {
  panel: ScrollPanelBase;
  panelType: ETweetType;
}
