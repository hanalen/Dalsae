import * as I from '@/Interfaces';

export interface DirectMessage {
  id_str: string;
  text: string; //dm내용
  created_at: string;
  sender: I.User; //송신자
  recipient: I.User; //수신자
}
