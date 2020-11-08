import TwitterAPI from '@/API/APICall';

export interface DalsaePageBase {
  ShowConfirm: (msg: string) => Promise<boolean>;
  ShowMessage: (msg: string) => void;
  ShowPin: () => void;

  api: TwitterAPI;
}
