/* eslint-disable @typescript-eslint/camelcase */
import * as I from '@/Interfaces';
import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators';
import * as M from '@/mixins';
import store from '@/store';
import { ETweetType } from '@/store/Interface';
import { moduleTweet } from '@/store/modules/TweetStore';
import { moduleSwitter } from './SwitterStore';
import { moduleOption } from './OptionStore';
import { ContextItem } from '@/mixins';
import { moduleUI } from './UIStore';
import { moduleApi } from './APIStore';
import copy from 'copy-to-clipboard';
import { moduleProfile } from './ProfileStore';
import { moduleModal } from './ModalStore';
import { eventBus } from '@/plugins';
@Module({ dynamic: true, store, name: 'util' })
class UtilStore extends VuexModule {
  get isFocusPanel() {
    const { bOption, stateMessage, bOptionDetail, bPin } = moduleModal;
    const { bAutoComplete } = moduleModal.stateAutoComplete;
    if (bOption || bAutoComplete || stateMessage.bMessage || bOption || bOptionDetail || bPin)
      return false;
    return true;
  }
  @Action
  OpenImage(tweet: I.Tweet) {
    window.preload.image.OpenImageWindow(tweet, moduleOption.uiOption);
  }
  @Action
  OnEnterByContext() {
    const { index, listContext } = moduleUI.stateContext;
    const context = listContext.find(x => x.value === index);
    context?.onClick(index);
    moduleUI.SetStateContext({
      ...moduleUI.stateContext,
      isShow: false,
      x: 0,
      y: 0,
      listContext: [],
      maxIndex: 0
    });
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
    moduleUI.SetStateInput({ ...moduleUI.stateInput, inputText: str });
  }

  @Action
  Reply(tweet: I.Tweet) {
    const mentions = `@${tweet.orgUser.screen_name} `;
    moduleUI.SetStateInput({ ...moduleUI.stateInput, replyTweet: tweet, inputText: mentions });
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
    moduleUI.SetStateInput({ ...moduleUI.stateInput, replyTweet: tweet, inputText: mentions });
  }
  @Action
  LoadTweets() {
    let id_str = '';
    switch (moduleUI.stateUI.selectMenu) {
      case 0:
        if (moduleTweet.homes.length > 0) id_str = moduleTweet.homes[0].data.id_str;
        moduleApi.statuses.TimeLine('', id_str);
        break;
      case 1:
        if (moduleTweet.mentions.length > 0) id_str = moduleTweet.mentions[0].data.id_str;
        moduleApi.statuses.Mention('', id_str);
        break;
      case 3:
        if (moduleTweet.favorites.length > 0) id_str = moduleTweet.favorites[0].data.id_str;
        moduleApi.favorites.List('', id_str);
        break;
    }
  }

  ///대화 불러오기
  @Action
  LoadConv(tweet: I.Tweet) {
    moduleTweet.AddConv({
      listTweet: undefined,
      tweet: tweet,
      type: ETweetType.E_CONV,
      user_id_str: moduleSwitter.selectID
    });
    let id_str = tweet.orgTweet.in_reply_to_status_id_str;
    if (!id_str) return;
    let find = moduleTweet.tweetDatas.FindTweet(id_str, moduleSwitter.selectID);
    while (find) {
      moduleTweet.AddConv({
        listTweet: undefined,
        tweet: find,
        type: ETweetType.E_CONV,
        user_id_str: moduleSwitter.selectID
      });
      id_str = find.in_reply_to_status_id_str;
      find = moduleTweet.tweetDatas.FindTweet(id_str, moduleSwitter.selectID);
    }
    if (id_str && !find) {
      moduleApi.statuses.Show(id_str);
    }
  }

  @Action
  CopyTweet(tweet: I.Tweet) {
    let text = tweet.orgTweet.full_text;
    text = text;
    tweet.entities.urls.forEach(url => {
      text = text.replace(url.url, url.expanded_url);
    });
    if (tweet.media) {
      tweet.media.forEach(media => {
        text = text.replace(media.url, media.display_url);
      });
    }
    copy(text);
  }

  @Action
  AddHashs(tweet: I.Tweet) {
    if (!tweet.entities.hashtags.length) return;
    let text = '';
    tweet.entities.hashtags.forEach(hash => {
      text += `#${hash.text} `;
    });
    moduleUI.SetStateInput({ ...moduleUI.stateInput, inputText: text });
  }

  @Action
  AddHash(hash: I.Hashtag) {
    if (!hash) return;
    moduleUI.SetStateInput({ ...moduleUI.stateInput, inputText: `#${hash.text}` });
  }

  @Action
  Follow(user: I.User) {
    if (!user) return;
    if (moduleProfile.stateProfile.isFollwRequest) return; //글로벌로 요청 중
    const isFollowing = moduleProfile.listFollowingIds.ids.findIndex(x => x === user.id_str) > -1;
    moduleProfile.SetState({ ...moduleProfile.stateProfile, isFollwRequest: true });
    if (isFollowing) {
      moduleApi.friendships.Destroy({ screen_name: user.screen_name });
    } else {
      moduleApi.friendships.Create({ screen_name: user.screen_name });
    }
    moduleProfile.SetState({ ...moduleProfile.stateProfile, isFollwRequest: false });
  }

  @Action
  AutoCompleted(user: I.User | undefined) {
    if (!moduleModal.stateAutoComplete.bAutoComplete) return;
    let text = moduleUI.stateInput.inputText;
    const { autoCompleteWord, indexAutoComplete } = moduleModal.stateAutoComplete;
    if (!user) {
      user = moduleModal.users[indexAutoComplete];
    }
    text = text.replace(`@${autoCompleteWord}`, `@${user.screen_name} `);
    moduleModal.SetAutoComplete({
      ...moduleModal.stateAutoComplete,
      bAutoComplete: false,
      autoCompleteWord: ''
    });
    moduleUI.SetStateInput({ ...moduleUI.stateInput, inputText: text });
    eventBus.$emit('FocusInput');
  }
}
export const moduleUtil = getModule(UtilStore);
