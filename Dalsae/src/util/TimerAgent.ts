import * as I from '@/Interfaces';
import { ESystemBar, ETweetType } from '@/store/Interface';
import { moduleApi } from '@/store/modules/APIStore';
import { moduleDm } from '@/store/modules/DmStore';
import { moduleSysbar } from '@/store/modules/SystemBarStore';
import { moduleTweet } from '@/store/modules/TweetStore';

export class TimerAgent {
  timerTweet!: NodeJS.Timeout;
  StartRemoveTweetObserver() {
    clearTimeout(this.timerTweet);
    this.timerTweet = setTimeout(() => {
      this.ClearTweetObserver();
    }, 60000);
  }
  ClearTweetObserver() {
    delete (moduleTweet.stateTweet as any).__ob__;
    delete (moduleTweet.stateTweet.tweets as any).__ob__;
    for (const pair of moduleTweet.stateTweet.tweets) {
      delete (pair as any).__ob__;
      delete (pair.tweets as any).__ob__;
      (pair.tweets.homes as any).__ob__.value = [];
      (pair.tweets.mentions as any).__ob__.value = [];
      (pair.tweets.favorites as any).__ob__.value = [];
      (pair.tweets.conv as any).__ob__.value = [];
      (pair.tweets.opens as any).__ob__.value = [];
    }
    this.StartRemoveTweetObserver();
  }
}
