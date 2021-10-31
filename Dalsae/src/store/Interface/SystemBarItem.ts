export interface SystemBarItem {
  type: ESystemBar;
  icon: string;
  text: string;
  toolTip: string;
  onClick?: (e: MouseEvent) => void;
}

export enum ESystemBar {
  EACCOUNT,
  EFOLLOWERIDS,
  EFOLLOWINGIDS,
  EFOLLOW_REQUEST_IDS,
  EERROR_FOLLOWERIDS,
  EERROR_FOLLOWINGIDS,
  EERROR_FOLLOW_REQUEST_IDS
}
