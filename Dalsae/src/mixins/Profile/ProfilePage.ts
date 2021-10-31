/* eslint-disable @typescript-eslint/camelcase */
import { Vue, Mixins, Component, Inject, Emit, Prop, Provide, Watch } from 'vue-property-decorator';
import * as MIX from '@/mixins';
import * as I from '@/Interfaces';
import * as A from '@/store/Interface';
import { moduleApi } from '@/store/modules/APIStore';
import { moduleProfile } from '@/store/modules/ProfileStore';
import { moduleSwitter } from '@/store/modules/SwitterStore';
import { moduleUtil } from '@/store/modules/UtilStore';
import { moduleSysbar } from '@/store/modules/SystemBarStore';

@Component
export class ProfilePage extends Vue {
  get itsMe() {
    return moduleProfile.showUser.id_str === moduleSwitter.selectID;
  }
  get isLoadProfile() {
    return moduleProfile.stateProfile.isLoadProfile;
  }

  set isLoadProfile(isLoad: boolean) {
    moduleProfile.SetState({ ...moduleProfile.stateProfile, isLoadProfile: isLoad });
  }

  get verified() {
    return moduleProfile.selectUser.verified;
  }

  get isLoadFollwerIds() {
    return moduleProfile.stateProfile.isLoadFollowerIds;
  }

  get selectAccount() {
    return moduleSwitter.selectUser;
  }

  isShowContext = false;
  x = 0;
  y = 0;

  @Watch('selectAccount', { immediate: true, deep: true })
  OnChangeSelectAccount(newVal: I.DalsaeUser) {
    if (!newVal) return;
    moduleProfile.ClearIds();
    moduleSysbar.ClearSystamBar();
    moduleSysbar.AddSystemBar({
      type: A.ESystemBar.EACCOUNT,
      icon: 'mdi-account',
      text: `@${newVal.screen_name}`,
      toolTip: '계정 선택',
      onClick: this.OnClickSelectAccount
    });
    moduleApi.followers.Ids({ stringify_ids: true, cursor: '-1' });
  }

  @Watch('isLoadFollwerIds', { immediate: true, deep: true })
  OnChangeLoadFollwerIds(newVal: I.DalsaeUser) {
    if (newVal) {
      moduleSysbar.AddSystemBar({
        type: A.ESystemBar.EFOLLOWERIDS,
        icon: 'mdi-download',
        text: '',
        toolTip: '팔로워 불러오는 중...'
      });
    } else {
      moduleSysbar.RemoveSystemBar(A.ESystemBar.EFOLLOWERIDS);
    }
  }

  get listUser() {
    return moduleSwitter.switter.listUser;
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
      '',
      false
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
      '',
      false
    );
    if (resp.data) {
      moduleProfile.SetSelectUserFollowingList(resp.data);
    }
  }

  get listFollower() {
    return moduleProfile.listFollower.users;
  }

  get listFollowing() {
    return moduleProfile.listFollowing.users.slice(0, 10);
  }

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
    return moduleProfile.stateProfile.selectMenu;
  }

  set selectMenu(menu: number) {
    moduleProfile.SetState({ ...moduleProfile.stateProfile, selectMenu: menu });
  }

  get userHeader() {
    console.log(moduleProfile.showUser);
    return moduleProfile.showUser.profile_banner_url + '/1080x360';
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
    let text = moduleProfile.showUser.description;
    const { entities } = moduleProfile.showUser;
    if (!entities) return text;
    const { url, description } = entities;
    if (url) {
      url.urls.forEach(url => {
        text = text.replace(url.url, url.display_url);
      });
    }
    if (description) {
      description.urls.forEach(url => {
        text = text.replace(url.url, url.display_url);
      });
    }
    return text;
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
    moduleProfile.ClearProfileState();
    moduleProfile.ChangeSelectUser(moduleProfile.showUser);
    this.LoadFollowingList();
    this.LoadFollowerList();
  }
  OnClickShowFollower(e: MouseEvent) {
    moduleProfile.ClearProfileState();
    moduleProfile.ChangeSelectUser(moduleProfile.showUser);
    this.LoadFollowingList();
    this.LoadFollowerList();
  }

  OnClickSelectAccount(e: MouseEvent) {
    this.isShowContext = true;
    this.x = e.pageX;
    this.y = e.pageY;
  }
  OnClickAccount(user: I.DalsaeUser) {
    moduleSwitter.ChangeAccount(user);
  }

  ClickTweet() {
    console.log('click tweet');
  }
}
