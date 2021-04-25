import * as I from '@/Interfaces';
import * as M from '@/mixins';
export interface MoveScroll {
  moveY: number;
  idxFrom: number;
  listTweet: M.ScrollItem<I.Tweet>[];
}
