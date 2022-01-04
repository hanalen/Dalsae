export interface ReqUserTimeLine {
  count: number;
  screen_name: string;
  tweet_mode: string;
  trim_user?: boolean;
  exclude_replies?: boolean;
  include_rts?: boolean;
  max_id?: string;
  since_id?: string;
}
