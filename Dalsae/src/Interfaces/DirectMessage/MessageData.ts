import * as I from '@/Interfaces';
export interface MessageData {
  text: string;
  entities?: I.Entitie;
  attachment?: I.Attachment;
}
