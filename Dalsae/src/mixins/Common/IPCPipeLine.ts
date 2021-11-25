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
    window.ipc.ipcPipe.on(EIPcType.EDeleteTweet, (tweet: I.Tweet) => {
      moduleDom.DeleteTweet(tweet);
    });
    ///////////////////
    window.ipc.ipcPipe.on(EIPcType.EWindowFocused, () => {
      moduleDom.stateDom.textArea.focus();
    });

    window.ipc.ipcPipe.on(EIPcType.EPathSetting, (data: { path: string }) => {
      moduleOption.SetAppPath(data.path);
    });
    //////////////////
    //이미지 윈도우 전용
    window.ipc.ipcPipe.on(EIPcType.EShowIage, (ipcData: { ipcName: string }) => {
      window.ipc.ipcPipe.once(`switter_${ipcData.ipcName}`, (switter: I.Switter) => {
        console.log('ipc once switter', switter);
        moduleSwitter.InitSwitter(switter);
      });
      window.ipc.ipcPipe.once(`option_${ipcData.ipcName}`, (option: I.UIOption) => {
        console.log('ipc once option', option);
        moduleOption.ChangeOption(option);
      });
      window.ipc.ipcPipe.once(`tweet_${ipcData.ipcName}`, (tweet: I.Tweet) => {
        console.log('ipc once tweet', tweet);
        moduleImage.SetTweet(tweet);
      });

      window.ipc.ipcPipe.getData(`switter_${ipcData.ipcName}`);
      window.ipc.ipcPipe.getData(`tweet_${ipcData.ipcName}`);
      window.ipc.ipcPipe.getData(`option_${ipcData.ipcName}`);
    });

    window.ipc.ipcPipe.on(EIPcType.EShowVideo, (ipcData: { ipcName: string }) => {
      window.ipc.ipcPipe.once(`switter_${ipcData.ipcName}`, (switter: I.Switter) => {
        console.log('ipc once switter', switter);
        moduleSwitter.InitSwitter(switter);
      });
      window.ipc.ipcPipe.once(`option_${ipcData.ipcName}`, (option: I.UIOption) => {
        console.log('ipc once option', option);
        moduleOption.ChangeOption(option);
      });
      window.ipc.ipcPipe.once(`tweet_${ipcData.ipcName}`, (tweet: I.Tweet) => {
        console.log('ipc once tweet', tweet);
        moduleImage.SetTweet(tweet);
      });

      window.ipc.ipcPipe.getData(`switter_${ipcData.ipcName}`);
      window.ipc.ipcPipe.getData(`tweet_${ipcData.ipcName}`);
      window.ipc.ipcPipe.getData(`option_${ipcData.ipcName}`);
    });

    window.ipc.ipcPipe.on(EIPcType.EShowProfile, (ipcData: { ipcName: string }) => {
      window.ipc.ipcPipe.once(`switter_${ipcData.ipcName}`, (switter: I.Switter) => {
        console.log('ipc once switter', switter);
        moduleSwitter.InitSwitter(switter);
      });
      window.ipc.ipcPipe.once(`followdatas_${ipcData.ipcName}`, (followDatas: I.FollowDatas) => {
        moduleSwitter.SetStateIds({
          ...moduleSwitter.stateIds,
          followDatas: followDatas
        });
      });
      window.ipc.ipcPipe.once(
        `blokcids_${ipcData.ipcName}`,
        (blockIds: Map<string, I.BlockIds>) => {
          moduleSwitter.SetStateIds({
            ...moduleSwitter.stateIds,
            dicBlockIds: blockIds
          });
        }
      );
      window.ipc.ipcPipe.getData(`switter_${ipcData.ipcName}`);
      window.ipc.ipcPipe.getData(`followdatas_${ipcData.ipcName}`);
      window.ipc.ipcPipe.getData(`blokcids_${ipcData.ipcName}`);
    });
  }
}
