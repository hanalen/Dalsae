/* eslint-disable @typescript-eslint/camelcase */
import { Vue, Mixins, Component, Inject, Emit, Prop, Provide } from 'vue-property-decorator';
import * as MIX from '@/mixins';
import * as I from '@/Interfaces';
import { moduleApi } from '@/store/modules/APIStore';
import { moduleProfile } from '@/store/modules/ProfileStore';
import { moduleSwitter } from '@/store/modules/SwitterStore';
import { moduleUtil } from '@/store/modules/UtilStore';

@Component
export class ProfilePage extends Vue {
  get itsMe() {
    return moduleProfile.showUser.id_str === moduleSwitter.selectID;
  }
  get isLoadProfile() {
    return moduleProfile.isLoadProfile;
  }

  set isLoadProfile(isLoad: boolean) {
    moduleProfile.SetLoadUser(isLoad);
  }

  get verified() {
    return moduleProfile.selectUser.verified;
  }

  async LoadUserInfo(screenName: string) {
    this.isLoadProfile = true;
    const resp = await moduleApi.users.Show({ screen_name: screenName });
    if (!resp.data) {
      //TODO 에러 표시
    } else {
      moduleProfile.ChangeShowUser(resp.data);
      moduleProfile.ChangeSelectUser(resp.data);
    }
    this.isLoadProfile = false;
  }

  async LoadFollowerList() {
    const resp = await moduleApi.followers.List(
      {
        screen_name: moduleProfile.selectUser.screen_name,
        count: 200
      },
      ''
    );
    if (resp.data) {
      moduleProfile.SetSelectUserFollowerList(resp.data);
    }
  }

  async LoadFollowingList() {
    const resp = await moduleApi.friends.List(
      {
        screen_name: moduleProfile.selectUser.screen_name,
        count: 200
      },
      ''
    );
    if (resp.data) {
      moduleProfile.SetSelectUserFollowingList(resp.data);
    }
  }

  get listFollower() {
    return moduleProfile.listFollower.users;
  }

  get listFollowing() {
    return moduleProfile.listFollowing.users;

  get followerText() {
    const user = moduleProfile.showUser;
    if (!user) return '';
    if (moduleProfile.listFollowerIds.ids.findIndex(x => x === user.id_str) > -1) {
      return ' 님은 나를 팔로우 하고 있습니다.';
    } else {
      return '';
    }
  }

  get followText() {
    return moduleProfile.showUser.following ? '언팔로우' : '팔로우';
  }

  get userText() {
    const { name, screen_name } = moduleProfile.showUser;
    return name + '<br />' + screen_name;
  }

  get selectMenu() {
    return moduleProfile.selectMenu;
  }

  set selectMenu(menu: number) {
    moduleProfile.ChangeSelectMenu(menu);
  }

  get userHeader() {
    return moduleProfile.showUser.profile_banner_url;
  }

  get userPropic() {
    return moduleProfile.showUser.profile_image_url_https.replace('_normal', '');
  }

  get countTweet() {
    if (!moduleProfile.showUser) return '';
    return moduleProfile.showUser.statuses_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  get countFollowing() {
    return moduleProfile.showUser.friends_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  get countFollower() {
    return moduleProfile.showUser.followers_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  get name() {
    return moduleProfile.showUser.name;
  }
  get screenName() {
    const ret = moduleProfile.showUser.protected
      ? `@${moduleProfile.showUser.screen_name} 🔒`
      : `@${moduleProfile.showUser.screen_name}`;

    return ret;
  }

  get selectName() {
    return moduleProfile.selectUser.name;
  }

  get selectScreenName() {
    return `@${moduleProfile.selectUser.screen_name}`;
  }

  get userBio() {
    const text = moduleProfile.showUser.description;
    if (moduleProfile.showUser.entities?.description.length > 0) {
      moduleProfile.showUser.entities?.description.forEach(url => {
        text.replace(url.display_url, url.expanded_url);
      });
    }
    return moduleProfile.showUser.description;
  }

  get place() {
    return moduleProfile.showUser.location;
  }

  get url() {
    const entities = moduleProfile.showUser.entities;
    if (!entities) return '';
    if (entities.url?.urls?.length > 0) {
      return entities.url.urls[0].expanded_url;
    } else {
      return '';
    }
  }

  OnClickFollow(e: MouseEvent) {
    moduleUtil.Follow(moduleProfile.showUser);
  }
  OnClickShowFollowing(e: MouseEvent) {
    moduleProfile.Clear();
    moduleProfile.ChangeSelectUser(moduleProfile.showUser);
    this.LoadFollowingList();
    this.LoadFollowerList();
  }
  OnClickShowFollower(e: MouseEvent) {
    moduleProfile.Clear();
    moduleProfile.ChangeSelectUser(moduleProfile.showUser);
    this.LoadFollowingList();
    this.LoadFollowerList();
  }

  ClickTweet() {
    console.log('click tweet');
  }
}
