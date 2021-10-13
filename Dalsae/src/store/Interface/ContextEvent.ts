import * as I from '@/Interfaces';

export interface ContextEvent {
  tweet?: I.Tweet;
  maxIndex: number;
  isShow: boolean;
  x: number;
  y: number;
}
