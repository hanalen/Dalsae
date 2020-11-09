import TwitterAPI from '@/API/APICall';
import * as M from '@/Managers';
export interface DalsaePageBase {
  ShowConfirm: (msg: string) => Promise<boolean>;
  ShowMessage: (msg: string) => void;
  ShowPin: () => void;

  api: TwitterAPI;
  mngAccount: M.AccountManager;
  mngOption: M.OptionManager;
}
