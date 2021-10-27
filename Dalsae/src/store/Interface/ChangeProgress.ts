export interface Progress {
  bStartDownload: boolean;
  bError: boolean;
  percent: number;
}

export interface ChangeProgress {
  index: number;
  progress: Progress;
}
