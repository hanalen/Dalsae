import TwitterAPI from '@/API/APICall';
import * as M from '@/Managers';
import * as MIX from '@/mixins';
export interface DalsaePageBase {
  ShowConfirm: (msg: string) => Promise<boolean>;
  ShowMessage: (msg: string) => void;
  ShowPin: () => void;
  ShowOptionModal: () => void;
  ShowOptionDetailModal: () => void;

  mngAccount: M.AccountManager;
  mngTweet: M.TweetDataManager;
  mngOption: M.OptionManager;
  tweetPanel: MIX.TweetPanelBase;
  isShowOptionModal: boolean;
  api: M.APIManager;
}
