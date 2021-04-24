import TwitterAPI from '@/API/APICall';
import * as M from '@/Managers';
import * as MIX from '@/mixins';
import * as I from '@/Interfaces';
export interface DalsaePageBase {
  ShowConfirm: (msg: string) => Promise<boolean>;
  ShowMessage: (msg: string) => void;
  ShowPin: () => void;
  ShowOptionModal: () => void;
  ShowOptionDetailModal: () => void;
  AccountChange: (user: I.DalsaeUser) => void;

  mngOption: M.OptionManager;
  tweetPanel: MIX.TweetPanelBase;
  isShowOptionModal: boolean;
  api: M.APIManager;
}
