export interface SystemBarItem {
  icon: string;
  text: string;
  toolTip: string;
  onClick?: (e: MouseEvent) => void;
}
