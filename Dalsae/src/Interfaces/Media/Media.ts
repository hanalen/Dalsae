import * as I from '@/Interfaces';
export class Media {
  id: bigint;
  id_str!: string;
  media_url: string;
  media_url_https: string;
  url: string;
  display_url: string;
  expanded_url: string;
  type: string;
  video_info?: I.VideoInfo;
  constructor(media?: Media) {
    if (media) {
      this.id = BigInt(media.id_str);
      this.media_url = media.media_url;
      this.media_url_https = media.media_url_https;
      this.url = media.url;
      this.display_url = media.display_url;
      this.expanded_url = media.expanded_url;
      this.type = media.type;
    } else {
      this.id = BigInt(0);
      this.id_str = '';
      this.media_url = '';
      this.media_url_https = '';
      this.url = '';
      this.display_url = '';
      this.expanded_url = '';
      this.type = '';
    }
  }
}
