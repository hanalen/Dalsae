export interface UploadStatus {
  media_id_string: string;
  media_key: string;
  processing_info: ProcessingInfo;
}

export interface ProcessingInfo {
  state: string;
  check_after_secs: number;
  progress_percent: number;
}
