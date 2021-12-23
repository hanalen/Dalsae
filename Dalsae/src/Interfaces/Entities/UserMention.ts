export class UserMention {
  screen_name: string;
  name: string;
  id: bigint;
  id_str!: string;
  constructor(userMention?: UserMention) {
    if (userMention) {
      this.id = BigInt(userMention.id_str);
      this.name = userMention.name;
      this.screen_name = userMention.screen_name;
    } else {
      this.name = '';
      this.screen_name = '';
      this.id = BigInt(0);
    }
  }
}
