import { ETweetType } from '@/store/Interface';
export interface ChangeIndex {
  tweetType: ETweetType;
  index: number;
  selectedId: string;
}
