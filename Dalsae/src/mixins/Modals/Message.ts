export enum Messagetype {
  E_ERROR = 'error',
  E_INFO = 'info',
  E_WARNING = 'warning',
  E_MESSAGE = 'success'
}

export interface Message {
  message: string;
  errorType: Messagetype;
  time: number;
  key?: number;
}
