import * as I from '@/Interfaces';

export interface ContextEvent {
  tweet?: I.Tweet;
  isShow: boolean;
  x: number;
  y: number;
}
