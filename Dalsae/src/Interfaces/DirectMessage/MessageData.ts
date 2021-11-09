import * as I from '@/Interfaces';
export interface MessageData {
  text: string;
  entities?: I.DMEntitie;
  attachment?: I.Attachment;
}
