import * as I from '@/Interfaces';

export interface DMEvent {
  type: string;
  id?: string;
  created_timestamp: string;
  message_create?: I.MessageCreate;
}
