/* eslint-disable @typescript-eslint/camelcase */
import { Vue, Mixins, Component, Inject, Emit, Prop, Provide } from 'vue-property-decorator';
import * as MIX from '@/mixins';
import * as I from '@/Interfaces';
import { moduleApi } from '@/store/modules/APIStore';
import { moduleProfile } from '@/store/modules/ProfileStore';

@Component
export class ProfilePage extends Vue {
  get isLoad() {
    return moduleProfile.isLoad;
  }

  set isLoad(isLoad: boolean) {
    moduleProfile.SetLoad(isLoad);
  }

  async LoadUserInfo(screenName: string) {
    this.isLoad = true;
    const resp = await moduleApi.users.Show({ screen_name: screenName });
    if (!resp.data) {
      //TODO 에러 표시
    } else {
      moduleProfile.ChangeUser(resp.data);
    }
    this.isLoad = false;
  }

  get selectMenu() {
    return moduleProfile.selectMenu;
  }

  set selectMenu(menu: number) {
    moduleProfile.ChangeSelectMenu(menu);
  }

  get userHeader() {
    return moduleProfile.selectUser.profile_banner_url;
  }

  get userPropic() {
    return moduleProfile.selectUser.profile_image_url_https.replace('_normal', '_bigger');
  }

  get countTweet() {
    if (!moduleProfile.selectUser) return '';
    return moduleProfile.selectUser.statuses_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  get countFollowing() {
    return moduleProfile.selectUser.friends_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  get countFollower() {
    return moduleProfile.selectUser.followers_count
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  get name() {
    return moduleProfile.selectUser.protected
      ? moduleProfile.selectUser.name + '🔒'
      : moduleProfile.selectUser.name;
  }
  get screenName() {
    return moduleProfile.selectUser.screen_name;
  }

  get userBio() {
    const text = moduleProfile.selectUser.description;
    if (moduleProfile.selectUser.entities?.description.length > 0) {
      moduleProfile.selectUser.entities?.description.forEach(url => {
        text.replace(url.display_url, url.expanded_url);
      });
    }
    return moduleProfile.selectUser.description;
  }

  get place() {
    return moduleProfile.selectUser.location;
  }

  get url() {
    const entities = moduleProfile.selectUser.entities;
    if (!entities) return '';
    if (entities.url.urls.length > 0) {
      return entities.url.urls[0].expanded_url;
    } else {
      return '';
    }
  }

  ClickTweet() {
    console.log('click tweet');
  }
}
