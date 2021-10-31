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
  EERROR_FOLLOWERIDS,
  EERROR_FOLLOWINGIDS
}
