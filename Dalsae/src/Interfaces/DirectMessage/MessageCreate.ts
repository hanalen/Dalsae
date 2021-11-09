import * as I from '@/Interfaces';

export interface MessageCreate {
  target?: I.Target;
  sender_id?: string;
  source_app_id?: string;
  message_data?: I.MessageData;
}
