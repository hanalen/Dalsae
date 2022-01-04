import * as I from '@/Interfaces';
export enum ETweetType {
  E_HOME,
  E_MENTION,
  E_DM,
  E_FAVORITE,
  E_OPEN,
  E_CONV,
  E_USER
}
export interface AddTweet {
  type: ETweetType;
  user_id_str: string;
  listTweet: I.Tweet[] | undefined;
  tweet: I.Tweet | undefined;
}
