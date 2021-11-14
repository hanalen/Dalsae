import { Component, Vue } from 'vue-property-decorator';
import * as I from '@/Interfaces';
import { moduleTweet } from '@/store/modules/TweetStore';
import { EIPcType } from '.';
import { moduleImage } from '@/store/modules/ImageStore';
@Component
export class IPCPipeLine extends Vue {
  ipctitle = 'awrwearjwaekraejfkjwekfnwj';

  async created() {
    window.ipc.ipcPipe.on(EIPcType.EFollow, (user: I.User) => {
      console.log('callbacked! data EFollow:', user);
    });
    window.ipc.ipcPipe.on(EIPcType.EUnFollow, (user: I.User) => {
      console.log('callbacked! data EUnFollow:', user);
    });
    window.ipc.ipcPipe.on(EIPcType.ERetweet, (tweet: I.Tweet) => {
      console.log('callbacked! data ERetweet:', tweet);
      const sendTweet = new I.Tweet(tweet);
      moduleTweet.UpdateRTandFav(sendTweet);
    });
    window.ipc.ipcPipe.on(EIPcType.EFavorite, (tweet: I.Tweet) => {
      console.log('callbacked! data EFavorite:', tweet);
      const sendTweet = new I.Tweet(tweet);
      moduleTweet.UpdateRTandFav(sendTweet);
    });
    window.ipc.ipcPipe.on(EIPcType.EOpenWeb, (data: I.Tweet) => {
      console.log('callbacked! data EOpenWeb:', data);
    });
  }
}
