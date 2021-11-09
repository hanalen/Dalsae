import * as I from '@/Interfaces';

export interface DMEntitie {
  hashtags: I.Hashtag[];
  user_mentions: I.UserMention[];
  urls: I.Url[];
  media: I.Media;
}
