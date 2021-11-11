/* eslint-disable @typescript-eslint/camelcase */
import TwitterRequest from '@/API/TwitterRequest';
import * as P from '@/Interfaces';
import * as I from '@/Interfaces';
import * as S from '@/store/Interface';
import store from '@/store/index';
import { moduleSwitter } from '@/store/modules/SwitterStore';
import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators';
import twitterRequest from '@/API/TwitterRequest';
import { moduleTweet } from './TweetStore';
import { moduleUI } from './UIStore';
import { ESystemBar, ETweetType } from '@/store/Interface';
import { moduleProfile } from './ProfileStore';
import { moduleSysbar } from './SystemBarStore';
import { moduleModal } from './ModalStore';
import { Messagetype } from '@/mixins';
import { moduleDm } from './DmStore';

class Account {
  async VerifyCredentials(): Promise<P.APIResp<I.User>> {
    const result = await twitterRequest.call.account.VerifyCredentials();
    if (!twitterRequest.CheckAPIError(result.data)) {
      moduleSwitter.UpdateSwitterUser(result.data);
    }
    return result;
  }
  async UpdateProfile(
    name: string,
    url: string,
    location: string,
    description: string
  ): Promise<P.APIResp<I.User>> {
    moduleProfile.SetState({ ...moduleProfile.stateProfile, isUpdateProfile: true });
    const result = await twitterRequest.call.account.ProfileUpdate({
      name: name,
      location: location,
      description: description,
      url: url
    });
    if (!twitterRequest.CheckAPIError(result.data)) {
      moduleModal.AddMessage({
        errorType: Messagetype.E_INFO,
        message: '프로필이 수정 되었습니다.',
        time: 3
      });
      moduleProfile.ChangeShowUser(result.data);
    }
    moduleProfile.SetState({ ...moduleProfile.stateProfile, isUpdateProfile: false });
    return result;
  }
}

class Statuses {
  async Upload(media: string, isDm = false): Promise<P.MediaResp | undefined> {
    console.log(media);
    const split = media.split(','); //data:image/png;base64, 이거 잘라야함
    const str = split[0];
    media = split[1];
    const type = str.substring(5, str.indexOf(';'));
    if (media.length >= 5242880) {
      //이미지 전송 방식: base64 to binary -> 자르기 -> binary 자른 데이터 to base64 전송
      media = atob(split[1]);
      console.log('------start upload-----');
      const result = await twitterRequest.call.media.UploadInit({
        command: 'INIT',
        total_bytes: media.length,
        media_type: type,
        media_category: isDm ? 'dm_gif' : 'tweet_gif'
      });
      console.log(result);
      const loopCount = Math.ceil(media.length / 5242880);
      console.log('loop count: ' + loopCount);
      for (let i = 0; i < loopCount; i++) {
        const chunk = media.substr(i * 5242880, 5242880);
        console.log('chun size: ' + chunk.length);
        const resp = await twitterRequest.call.media.UploadAppend({
          command: 'APPEND',
          media: btoa(chunk),
          media_id: result.data.media_id_string,
          segment_index: i
        });
        console.log(resp);
      }
      const resFinal = await twitterRequest.call.media.UploadFinally({
        command: 'FINALIZE',
        media_id: result.data.media_id_string
      });
      const resStatus = await twitterRequest.call.media.UploadStatus({
        command: 'STATUS',
        media_id: result.data.media_id_string
      });
      console.log(resFinal);
      console.log(resStatus);
      return result.data;
    } else {
      const result = await twitterRequest.call.media.Upload({
        media: media,
        media_category: isDm ? 'dm_image' : 'tweet_image'
      });
      return result.data;
    }
  }
  async Update(
    tweet: string,
    image: string[],
    in_reply_to_status_id?: string
  ): Promise<P.APIResp<I.Tweet>> {
    let mediaStr = '';
    if (image) {
      for (let i = 0; i < image.length; i++) {
        const result = await this.Upload(image[i]);
        mediaStr += `${result?.media_id_string},`;
      }
      mediaStr = mediaStr.substring(0, mediaStr.length - 1);
    }
    const result = await twitterRequest.call.statuses.Update({
      status: tweet,
      media_ids: mediaStr,
      in_reply_to_status_id: in_reply_to_status_id
    });
    return result;
  }
  async Destroy(tweet: I.Tweet): Promise<void | P.APIResp<I.Tweet>> {
    if (moduleSwitter.selectUser?.user.id_str === tweet.orgUser.id_str) {
      const { id_str } = tweet.orgTweet;
      const result = await twitterRequest.call.statuses.Destroy({ id_str: id_str });
      return result;
    }
  }
  async Show(id_str: string) {
    moduleUI.SetStatePanel({
      ...moduleUI.statePanel,
      conv: { ...moduleUI.statePanel.conv, isLoad: true }
    });
    const result = await twitterRequest.call.statuses.Show({ id: id_str, tweet_mode: 'extended' });
    moduleUI.SetStatePanel({
      ...moduleUI.statePanel,
      conv: { ...moduleUI.statePanel.conv, isLoad: false }
    });
    if (result.data) {
      moduleTweet.AddConv({
        tweet: result.data,
        type: ETweetType.E_CONV,
        listTweet: undefined,
        user_id_str: moduleSwitter.selectID
      });
    }
    return result;
  }

  async Retweet(tweet: I.Tweet): Promise<P.APIResp<I.Tweet>> {
    if (tweet.orgTweet.retweeted) {
      return this.UnRetweet(tweet);
    } else {
      const { id_str } = tweet.orgTweet;
      const result = await twitterRequest.call.statuses.Retweet({ id_str: id_str });
      if (!twitterRequest.CheckAPIError(result.data)) {
        moduleTweet.UpdateRTandFav(result.data);
      }
      return result;
    }
  }
  async UnRetweet(tweet: I.Tweet): Promise<P.APIResp<I.Tweet>> {
    if (!tweet.orgTweet.retweeted) {
      return this.Retweet(tweet);
    } else {
      const { id_str } = tweet.orgTweet;
      const result = await twitterRequest.call.statuses.UnRetweet({ id_str: id_str });
      if (!twitterRequest.CheckAPIError(result.data)) {
        moduleTweet.UpdateRTandFav(result.data);
      }
      return result;
    }
  }
  async TimeLine(maxId?: string, sinceId?: string): Promise<P.APIResp<I.Tweet[]>> {
    moduleUI.SetStatePanel({
      ...moduleUI.statePanel,
      home: { ...moduleUI.statePanel.home, isLoad: true }
    });
    const id = moduleSwitter.selectID;
    const result = await twitterRequest.call.statuses.TimeLine({
      count: 200,
      tweet_mode: 'extended',
      max_id: maxId,
      since_id: sinceId
    });
    moduleUI.SetStatePanel({
      ...moduleUI.statePanel,
      home: { ...moduleUI.statePanel.home, isLoad: false }
    });
    if (!twitterRequest.CheckAPIError(result.data)) {
      store.dispatch('AddTweet', {
        type: S.ETweetType.E_HOME,
        user_id_str: id,
        listTweet: result.data
      });
    }
    return result;
  }
  async Mention(maxId?: string, sinceId?: string): Promise<P.APIResp<I.Tweet[]>> {
    moduleUI.SetStatePanel({
      ...moduleUI.statePanel,
      mention: { ...moduleUI.statePanel.mention, isLoad: true }
    });
    const id = store.getters.selectID;
    const result = await twitterRequest.call.statuses.Mention({
      count: 200,
      tweet_mode: 'extended',
      max_id: maxId,
      since_id: sinceId
    });
    moduleUI.SetStatePanel({
      ...moduleUI.statePanel,
      mention: { ...moduleUI.statePanel.mention, isLoad: false }
    });
    if (!twitterRequest.CheckAPIError(result.data)) {
      store.dispatch('AddTweet', {
        type: S.ETweetType.E_MENTION,
        user_id_str: id,
        listTweet: result.data
      });
    }
    return result;
  }
}

class Favorites {
  async Create(tweet: I.Tweet): Promise<P.APIResp<I.Tweet>> {
    if (tweet.orgTweet.favorited) {
      return this.Destroy(tweet);
    } else {
      const { id_str } = tweet.orgTweet;
      const result = await twitterRequest.call.favorites.Create({ id: id_str });
      if (!twitterRequest.CheckAPIError(result.data)) {
        moduleTweet.UpdateRTandFav(result.data);
      }
      return result;
    }
  }
  async Destroy(tweet: I.Tweet): Promise<P.APIResp<I.Tweet>> {
    if (!tweet.orgTweet.favorited) {
      return this.Create(tweet);
    } else {
      const { id_str } = tweet.orgTweet;
      const result = await twitterRequest.call.favorites.Destroy({ id: id_str });
      if (!twitterRequest.CheckAPIError(result.data)) {
        moduleTweet.UpdateRTandFav(result.data);
      }
      return result;
    }
  }
  async List(max_id?: string, since_id?: string) {
    moduleUI.SetStatePanel({
      ...moduleUI.statePanel,
      favorite: { ...moduleUI.statePanel.favorite, isLoad: true }
    });
    const id = moduleSwitter.selectID;
    const result = await twitterRequest.call.favorites.List({
      count: 200,
      tweet_mode: 'extended',
      max_id: max_id,
      since_id: since_id
    });
    moduleUI.SetStatePanel({
      ...moduleUI.statePanel,
      favorite: { ...moduleUI.statePanel.favorite, isLoad: false }
    });
    if (!twitterRequest.CheckAPIError(result.data)) {
      store.dispatch('AddTweet', {
        type: S.ETweetType.E_FAVORITE,
        user_id_str: id,
        listTweet: result.data
      });
    }
  }
}

class Block {
  async Ids(data: P.ReqBlockIds): Promise<P.APIResp<I.BlockIds>> {
    moduleSysbar.RemoveSystemBar(S.ESystemBar.EErrorBlockIds);
    moduleSysbar.AddSystemBar({
      type: S.ESystemBar.EBolckIds,
      icon: 'mdi-user-cancel-outline',
      text: '',
      toolTip: '차단 목록 불러오는 중'
    });
    const result = await twitterRequest.call.block.Ids(data);
    if (!twitterRequest.CheckAPIError(result.data)) {
      moduleSwitter.SetStateIds({
        ...moduleSwitter.stateIds,
        listBlockIds: moduleSwitter.stateIds.listBlockIds.concat(result.data.ids)
      });
      if (result.data.next_cursor_str !== '0') {
        this.Ids({
          cursor: result.data.next_cursor_str,
          stringify_ids: true
        });
      }
    } else {
      const error = twitterRequest.GetApiError(result.data as I.ResponseTwitterError);
      moduleSysbar.AddSystemBar({
        type: S.ESystemBar.EErrorBlockIds,
        icon: 'mdi-alert-circle-outline',
        text: '차단 목록 에러',
        toolTip: error
      });
      setTimeout(() => {
        this.Ids(data);
      }, 600000);
    }
    moduleSysbar.RemoveSystemBar(ESystemBar.EBolckIds);
    return result;
  }
  async Destroy(data: P.ReqBlockDestroy): Promise<P.APIResp<I.BlockDestroy>> {
    const result = await twitterRequest.call.block.Destory(data);
    return result;
  }
}

class Users {
  async Show(data: P.ReqShow): Promise<P.APIResp<I.User>> {
    const result = await twitterRequest.call.users.Show(data);
    return result;
  }
}

class Followers {
  async List(
    data: P.ReqList,
    selectId: string,
    isLoadFull: boolean
  ): Promise<P.APIResp<I.FollowerList>> {
    moduleSysbar.RemoveSystemBar(S.ESystemBar.EErrorFollower);
    moduleSysbar.AddSystemBar({
      type: S.ESystemBar.EFollower,
      icon: 'mdi-account-arrow-left-outline',
      text: '',
      toolTip: '팔로워 불러오는 중...'
    });
    const result = await twitterRequest.call.followers.List(data);
    if (!twitterRequest.CheckAPIError(result.data)) {
      if (result.data && selectId && data.screen_name === '') {
        const { followDatas } = moduleSwitter.stateIds;
        const datas = followDatas.dicUsers.get(selectId);
        if (datas) {
          datas.listFollower = datas.listFollower.concat(result.data.users);
          moduleSwitter.SetStateIds({ ...moduleSwitter.stateIds, followDatas: followDatas });
        }
      }
      if (result.data.next_cursor_str !== '0' && isLoadFull) {
        this.List(
          {
            screen_name: '',
            count: 200,
            cursor: result.data.next_cursor_str
          },
          selectId,
          isLoadFull
        );
      }
    } else {
      const error = twitterRequest.GetApiError(result.data as I.ResponseTwitterError);
      moduleSysbar.AddSystemBar({
        type: S.ESystemBar.EErrorFollower,
        icon: 'mdi-alert-circle-outline',
        text: '팔로워 목록 에러',
        toolTip: error
      });
      setTimeout(() => {
        this.List(data, selectId, isLoadFull);
      }, 60000);
    }
    moduleSysbar.RemoveSystemBar(S.ESystemBar.EFollower);

    return result;
  }

  async Ids(data: P.ReqBlockIds): Promise<P.APIResp<I.BlockIds>> {
    moduleProfile.SetState({ ...moduleProfile.stateProfile, isLoadFollowerIds: true });
    const result = await twitterRequest.call.followers.Ids(data);
    if (twitterRequest.CheckAPIError(result.data)) {
      const error = twitterRequest.GetApiError(result.data as I.ResponseTwitterError);
      moduleSysbar.AddSystemBar({
        type: S.ESystemBar.EERROR_FOLLOWERIDS,
        icon: 'mdi-alert-circle-outline',
        text: `팔로워 목록 에러`,
        toolTip: error
      });
    } else {
      moduleProfile.AddFollowerIds(result.data);
      if (result.data.next_cursor_str !== '0') {
        this.Ids({
          cursor: result.data.next_cursor_str,
          stringify_ids: true
        });
      }
    }
    moduleProfile.SetState({ ...moduleProfile.stateProfile, isLoadFollowerIds: false });
    return result;
  }
}

class Friends {
  async List(
    data: P.ReqList,
    selectId: string,
    isLoadFull: boolean
  ): Promise<P.APIResp<I.FollowerList>> {
    moduleSysbar.RemoveSystemBar(S.ESystemBar.EErrorFollowing);
    moduleSysbar.AddSystemBar({
      type: ESystemBar.EFollwing,
      icon: 'mdi-account-arrow-right-outline',
      text: '',
      toolTip: '팔로잉 불러오는 중...'
    });
    const result = await twitterRequest.call.friends.List(data);
    if (!twitterRequest.CheckAPIError(result.data)) {
      if (result.data && selectId && data.screen_name === '') {
        const { followDatas } = moduleSwitter.stateIds;
        const datas = followDatas.dicUsers.get(selectId);
        if (datas) {
          datas.listFollowing = datas.listFollowing.concat(result.data.users);
          moduleSwitter.SetStateIds({ ...moduleSwitter.stateIds, followDatas: followDatas });
        }
      }
      if (result.data.next_cursor_str !== '0' && isLoadFull) {
        this.List(
          {
            screen_name: '',
            count: 200,
            cursor: result.data.next_cursor_str
          },
          selectId,
          isLoadFull
        );
      }
    } else {
      const error = twitterRequest.GetApiError(result.data as I.ResponseTwitterError);
      moduleSysbar.AddSystemBar({
        type: S.ESystemBar.EErrorFollowing,
        icon: 'mdi-alert-circle-outline',
        text: '팔로잉 목록 에러',
        toolTip: error
      });
      setTimeout(() => {
        this.List(data, selectId, isLoadFull);
      }, 60000);
    }
    moduleSysbar.RemoveSystemBar(S.ESystemBar.EFollwing);
    return result;
  }

  async Ids(data: P.ReqBlockIds): Promise<P.APIResp<I.BlockIds>> {
    moduleProfile.SetState({ ...moduleProfile.stateProfile, isLoadFollowingIds: true });
    const result = await twitterRequest.call.friends.Ids(data);
    if (twitterRequest.CheckAPIError(result.data)) {
      const error = twitterRequest.GetApiError(result.data as I.ResponseTwitterError);
      moduleSysbar.AddSystemBar({
        type: S.ESystemBar.EERROR_FOLLOWINGIDS,
        icon: 'mdi-alert-circle-outline',
        text: `팔로잉 목록 에러`,
        toolTip: error
      });
    } else {
      moduleProfile.AddFollowingIds(result.data);
      if (result.data.next_cursor_str !== '0') {
        this.Ids({
          cursor: result.data.next_cursor_str,
          stringify_ids: true
        });
      }
    }
    moduleProfile.SetState({ ...moduleProfile.stateProfile, isLoadFollowingIds: false });
    return result;
  }
}

class Mutes {
  async Ids(data: P.ReqMuteIds, userId: string): Promise<P.APIResp<I.BlockIds>> {
    const result = await twitterRequest.call.mutes.Ids(data);
    if (!twitterRequest.CheckAPIError(result.data)) {
      const { dicMuteIds } = moduleSwitter.stateIds;
      const datas = dicMuteIds.get(userId);
      if (datas) {
        dicMuteIds.set(userId, datas.concat(result.data.ids));
        moduleSwitter.SetStateIds({ ...moduleSwitter.stateIds, dicMuteIds: dicMuteIds });
      }
    }
    return result;
  }
  async List(data: P.ReqMuteList): Promise<P.APIResp<I.BlockIds>> {
    const result = await twitterRequest.call.mutes.List(data);
    return result;
  }
}

class Friendships {
  async Create(data: P.ReqFollowCreate): Promise<P.APIResp<I.User>> {
    const result = await twitterRequest.call.friendships.Create(data);
    if (!twitterRequest.CheckAPIError(result.data)) {
      if (result.data.protected) {
        moduleProfile.AddRequestIds({
          ids: [result.data.id_str],
          next_cursor_str: '',
          previous_cursor_str: ''
        });
      } else {
        result.data.following = true;
        moduleProfile.UpdateFollowUserInfo(result.data);
      }
    }
    return result;
  }
  async Destroy(data: P.ReqFollowDestroy): Promise<P.APIResp<I.User>> {
    const result = await twitterRequest.call.friendships.Destroy(data);
    if (!twitterRequest.CheckAPIError(result.data)) {
      result.data.following = false;
      moduleProfile.UpdateFollowUserInfo(result.data);
      // window.preload.profile.UpdateFollow(result.data);
    }
    return result;
  }
  async Outgoing(data: P.ReqBlockIds): Promise<P.APIResp<I.BlockIds>> {
    moduleProfile.SetState({ ...moduleProfile.stateProfile, isLoadRequestIds: true });
    const result = await twitterRequest.call.friendships.Outgoing(data);
    if (twitterRequest.CheckAPIError(result.data)) {
      const error = twitterRequest.GetApiError(result.data as I.ResponseTwitterError);
      moduleSysbar.AddSystemBar({
        type: S.ESystemBar.EERROR_FOLLOW_REQUEST_IDS,
        icon: 'mdi-alert-circle-outline',
        text: `팔로우 요청 목록 에러`,
        toolTip: error
      });
    } else {
      moduleProfile.AddRequestIds(result.data);
      if (result.data.next_cursor_str !== '0') {
        this.Outgoing({
          cursor: result.data.next_cursor_str,
          stringify_ids: true
        });
      }
    }
    moduleProfile.SetState({ ...moduleProfile.stateProfile, isLoadRequestIds: false });
    return result;
  }
}

class OAuth {
  async ReqToken(data: P.ReqToken): Promise<P.APIResp<P.OAuthRes>> {
    return twitterRequest.requestOAuth<P.ReqToken>('https://api.twitter.com/oauth/request_token', {
      data
    });
  }
  async ReqAccessToken(data: P.ReqAccessToken): Promise<P.APIResp<P.OAuthRes>> {
    const result = await twitterRequest.requestOAuth<P.ReqAccessToken>(
      'https://api.twitter.com/oauth/access_token',
      {
        data
      }
    );
    if (!result.data) return result;
    const user = result.data;
    moduleSwitter.AddUser({
      publicKey: user.oauth_token,
      secretKey: user.oauth_token_secret,
      screenName: user.screen_name,
      name: user.name,
      userId: user.user_id
    });

    return result;
  }
}

class DirectMessage {
  async New(text: string, recvUserId: string, media?: string) {
    const dmEvent: I.ReqDMNew = {
      event: {
        created_timestamp: '',
        type: 'message_create',
        message_create: { target: { recipient_id: recvUserId }, message_data: { text: text } }
      }
    };
    const result = await twitterRequest.call.directMessage.New(dmEvent);
    if (!twitterRequest.GetApiError(result.data as I.ResponseTwitterError)) {
      moduleDm.AddDm(result.data);
    }
  }
  async List() {
    const result = await twitterRequest.call.directMessage.List({ count: '50' });
    if (!twitterRequest.GetApiError(result.data as I.ResponseTwitterError)) {
      moduleDm.AddDm(result.data.events);
    }
  }
  async Show(id: string) {
    const result = await twitterRequest.call.directMessage.Show({ id: id });
    return result;
  }
}

@Module({ dynamic: true, store, name: 'api' })
class APIStore extends VuexModule {
  account = new Account();
  statuses = new Statuses();
  favorites = new Favorites();
  block = new Block();
  oauth = new OAuth();
  users = new Users();
  followers = new Followers();
  friends = new Friends();
  friendships = new Friendships();
  mutes = new Mutes();
  directMessage = new DirectMessage();
}
export const moduleApi = getModule(APIStore);
