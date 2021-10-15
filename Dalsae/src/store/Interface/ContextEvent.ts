import * as I from '@/Interfaces';
import { ContextItem } from '@/mixins';

export interface ContextEvent {
  tweet?: I.Tweet;
  maxIndex: number;
  isShow: boolean;
  listContext: ContextItem[];
  x: number;
  y: number;
}
