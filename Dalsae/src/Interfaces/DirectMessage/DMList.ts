import * as I from '@/Interfaces';

export interface DMList {
  next_cursor: string;
  events: I.DMEvent[];
}
