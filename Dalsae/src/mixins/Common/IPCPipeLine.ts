/* eslint-disable @typescript-eslint/camelcase */
import { Component, Vue } from 'vue-property-decorator';
import * as I from '@/Interfaces';
import { moduleTweet } from '@/store/modules/TweetStore';
import { EIPcType } from '.';
import { moduleImage } from '@/store/modules/ImageStore';
import { moduleProfile } from '@/store/modules/ProfileStore';
import { ETweetType, UpdateFollowInfo } from '@/store/Interface';
import { moduleSwitter } from '@/store/modules/SwitterStore';
import { moduleDom } from '@/store/modules/DomStore';
import { moduleOption } from '@/store/modules/OptionStore';
@Component
export class IPCPipeLine extends Vue {
  async created() {
    const appPath = window.ipc.files.GetAppPath();
    moduleOption.SetAppPath(appPath);

    window.ipc.ipcPipe.on(EIPcType.EFollow, (user: I.User) => {
      moduleProfile.UpdateFollowUserInfo(user);
    });
    window.ipc.ipcPipe.on(EIPcType.ERetweet, (tweet: I.Tweet) => {
      const sendTweet = new I.Tweet(tweet);
      moduleTweet.UpdateRTandFav(sendTweet);
    });
    window.ipc.ipcPipe.on(EIPcType.EFavorite, (tweet: I.Tweet) => {
      const sendTweet = new I.Tweet(tweet);
      moduleTweet.UpdateRTandFav(sendTweet);
    });
    window.ipc.ipcPipe.on(EIPcType.EOpenWeb, (tweet: I.Tweet) => {
      moduleTweet.AddTweet({
        listTweet: undefined,
        tweet: tweet,
        type: ETweetType.E_OPEN,
        user_id_str: moduleSwitter.selectID
      });
    });
    ///////////////////
    window.ipc.ipcPipe.on(EIPcType.EWindowFocused, () => {
      moduleDom.stateDom.textArea.focus();
    });

    window.ipc.ipcPipe.on(EIPcType.EPathSetting, (data: { path: string }) => {
      moduleOption.SetAppPath(data.path);
    });
  }
}
