import * as I from '@/Interfaces';

export interface Tweet {
  created_at: string;
  id_str: string;
  full_text: string;
  entities: I.Entitie;
  extended_entities: I.ExtendedEntitie;
  in_reply_to_status_id_str: string;
  in_reply_to_user_id_str: string;
  in_reply_to_screen_name: string;
  user: I.User;
  place: string;
  is_quote_status: boolean;
  retweet_count: number;
  favorite_count: number;
  favorited: boolean;
  retweeted: boolean;
}
