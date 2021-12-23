import * as I from '@/Interfaces';
export enum ETweetType {
  E_HOME,
  E_MENTION,
  E_DM,
  E_FAVORITE,
  E_OPEN,
  E_CONV
}
export interface AddTweet {
  type: ETweetType;
  user_id: bigint;
  listTweet: I.Tweet[] | undefined;
  tweet: I.Tweet | undefined;
}
