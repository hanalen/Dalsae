import * as I from '@/Interfaces';
import * as M from '@/mixins';
export interface MoveScroll {
  height: number;
  idxFrom: number;
  listTweet: M.ScrollItem<I.Tweet>[];
}
