import * as I from '@/Interfaces';
import * as M from '@/mixins';
export interface MoveScroll {
  moveY: number;
  top: number;
  idxFrom: number;
  listTweet: M.ScrollItem<I.Tweet>[];
}
