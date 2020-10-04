import * as I from '@/Interfaces';

export interface Entitie {
  hashtags: I.Hashtag[];
  user_mentions: I.UserMention[];
  urls: I.Url[];
  media: I.Media;
}
