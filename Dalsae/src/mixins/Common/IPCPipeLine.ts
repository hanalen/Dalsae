/* eslint-disable @typescript-eslint/camelcase */
import { Component, Vue } from 'vue-property-decorator';
import * as I from '@/Interfaces';
import { moduleTweet } from '@/store/modules/TweetStore';
import { EIPcType } from '.';
import { moduleImage } from '@/store/modules/ImageStore';
import { moduleProfile } from '@/store/modules/ProfileStore';
import { ETweetType, UpdateFollowInfo } from '@/store/Interface';
import { moduleSwitter } from '@/store/modules/SwitterStore';
@Component
export class IPCPipeLine extends Vue {
  async created() {
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
  }
}
