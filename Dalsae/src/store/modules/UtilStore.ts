/* eslint-disable @typescript-eslint/camelcase */
import * as I from '@/Interfaces';
import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators';
import * as M from '@/mixins';
import store from '@/store';
import { ETweetType, ChangeIndex, ContextEvent } from '@/store/Interface';
import { moduleTweet } from '@/store/modules/TweetStore';
import { moduleSwitter } from './SwitterStore';
import { moduleOption } from './OptionStore';
import { ContextItem } from '@/mixins';
import { moduleUI } from './UIStore';
import { moduleApi } from './APIStore';

@Module({ dynamic: true, store, name: 'util' })
class UtilStore extends VuexModule {
  @Action
  OpenImage(tweet: I.Tweet) {
    window.preload.image.OpenImageWindow(tweet, moduleOption.uiOption);
  }
  @Action
  OnEnterByContext() {
    const { index, listContext } = moduleUI.stateContext;
    const context = listContext.find(x => x.value === index);
    context?.onClick(index);
    moduleUI.OnContext({ isShow: false, x: 0, y: 0, listContext: [], maxIndex: 0 });
  }
  @Action
  OpenLink(tweet: I.Tweet, title: string) {
    const url = tweet.orgTweet.entities.urls.find(x => x.display_url === title);
    if (!url) return;
    window.preload.OpenBrowser(url.expanded_url);
  }
  @Action
  OnClickViewWeb(tweet: I.Tweet) {
    const url = `https://twitter.com/${tweet.orgUser.screen_name}/status/${tweet.orgTweet.id_str}`;
    window.preload.OpenBrowser(url);
  }
  @Action
  OnClickQt(tweet: I.Tweet) {
    const str = `https://twitter.com/${tweet.orgUser.screen_name}/status/${tweet.orgTweet.id_str}`;
    moduleUI.SetInputText(str);
  }

  @Action
  Reply(tweet: I.Tweet) {
    const mentions = `@${tweet.orgUser.screen_name} `;
    console.log(moduleUI);
    moduleUI.ChangeReplyTweet(tweet);
    moduleUI.SetInputText(mentions);
  }

  @Action
  ReplyAll(tweet: I.Tweet) {
    const set = new Set();
    set.add(tweet.user.screen_name);
    set.add(tweet.orgUser.screen_name);
    tweet.orgTweet.entities.user_mentions.forEach(user => {
      set.add(user.screen_name);
    });
    const screenName = moduleSwitter.selectUser?.user.screen_name;
    if (screenName) set.delete(screenName);
    let mentions = '';
    set.forEach(user => {
      mentions += `@${user} `;
    });
    moduleUI.ChangeReplyTweet(tweet);
    moduleUI.SetInputText(mentions);
  }
  @Action
  LoadTweets() {
    switch (moduleUI.selectMenu) {
      case 0:
        moduleApi.statuses.TimeLine('', moduleTweet.homes[0].data.id_str);
        break;
      case 1:
        moduleApi.statuses.Mention('', moduleTweet.mentions[0].data.id_str);
        break;
      case 3:
        moduleApi.favorites.List('', moduleTweet.homes[0].data.id_str);
        break;
    }
  }
}
export const moduleUtil = getModule(UtilStore);
