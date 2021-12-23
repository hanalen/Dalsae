import * as I from '@/Interfaces';

export class DirectMessage {
  id: bigint;
  id_str!: string;
  text: string; //dm내용
  created_at: string;
  sender: I.User; //송신자
  recipient: I.User; //수신자
  constructor(dm?: DirectMessage) {
    if (dm) {
      this.id = BigInt(dm.id_str);
      this.text = dm.text;
      this.created_at = dm.created_at;
      this.sender = new I.User(dm.sender);
      this.recipient = new I.User(dm.recipient);
    } else {
      this.id = BigInt(0);
      this.text = '';
      this.created_at = '';
      this.sender = new I.User();
      this.recipient = new I.User();
    }
  }
}
