import * as I from '@/Interfaces';
export interface Media {
  id_str: string;
  media_url: string;
  media_url_https: string;
  url: string;
  display_url: string;
  expanded_url: string;
  type: string;
  video_info?: I.VideoInfo;
}
