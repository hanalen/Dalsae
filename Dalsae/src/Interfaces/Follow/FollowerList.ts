import * as I from '@/Interfaces';

export interface FollowerList {
  next_cursor_str: string;
  previous_cursor_str: string;
  users: I.User[];
}
