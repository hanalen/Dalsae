import * as I from '@/Interfaces';

export class Entitie {
  hashtags: I.Hashtag[];
  user_mentions: I.UserMention[];
  urls: I.Url[];
  media: I.Media[];
  constructor(entitie?: Entitie) {
    if (entitie) {
      this.hashtags = entitie.hashtags;
      this.user_mentions = [];
      this.urls = entitie.urls;
      this.media = [];
      for (const media of entitie.media) {
        this.media.push(new I.Media(media));
      }
      for (const user of entitie.user_mentions) {
        this.user_mentions.push(new I.UserMention(user));
      }
    } else {
      this.hashtags = [];
      this.user_mentions = [];
      this.urls = [];
      this.media = [];
    }
  }
}
