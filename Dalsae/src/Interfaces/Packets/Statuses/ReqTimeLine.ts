import * as P from '@/Interfaces';

export interface ReqTimeLine {
  count: number;
  tweet_mode: string;
  max_id?: string;
  since_id?: string;
}
