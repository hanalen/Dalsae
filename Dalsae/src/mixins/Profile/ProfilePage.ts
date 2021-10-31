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
import { moduleModal } from '@/store/modules/ModalStore';

@Component
export class ProfilePage extends Vue {
  get listMsg() {
    return moduleModal.stateMessage.listMessage;
  }
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

  get isLoadFollowerIds() {
    return moduleProfile.stateProfile.isLoadFollowerIds;
  }

  get isLoadFollowingIds() {
    return moduleProfile.stateProfile.isLoadFollowingIds;
  }

  get selectAccount() {
    return moduleSwitter.selectUser;
  }

  get showUser() {
    return moduleProfile.showUser;
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
    moduleApi.friends.Ids({ stringify_ids: true, cursor: '-1' });
  }

  @Watch('isLoadFollowerIds', { immediate: true, deep: true })
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

  @Watch('isLoadFollowingIds', { immediate: true, deep: true })
  OnChangeLoadFollwingIds(newVal: I.DalsaeUser) {
    if (newVal) {
      moduleSysbar.AddSystemBar({
        type: A.ESystemBar.EFOLLOWINGIDS,
        icon: 'mdi-download',
        text: '',
        toolTip: '팔로잉 불러오는 중...'
      });
    } else {
      moduleSysbar.RemoveSystemBar(A.ESystemBar.EFOLLOWINGIDS);
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
    const user = this.showUser;
    if (!user) return '';
    if (moduleProfile.listFollowerIds.ids.findIndex(x => x === user.id_str) > -1) {
      return ' 님은 나를 팔로우 하고 있습니다.';
    } else {
      return '';
    }
  }

  get followText() {
    const user = this.showUser;
    if (!user) return '';
    if (moduleProfile.listFollowingIds.ids.findIndex(x => x === user.id_str) > -1) {
      return '언팔로우';
    } else {
      return '팔로잉';
    }
  }

  get userText() {
    const { name, screen_name } = this.showUser;
    return name + '<br />' + screen_name;
  }

  get selectMenu() {
    return moduleProfile.stateProfile.selectMenu;
  }

  set selectMenu(menu: number) {
    moduleProfile.SetState({ ...moduleProfile.stateProfile, selectMenu: menu });
  }

  get userHeader() {
    return this.showUser.profile_banner_url + '/1080x360';
  }

  get userPropic() {
    return this.showUser.profile_image_url_https.replace('_normal', '');
  }

  get countTweet() {
    if (!this.showUser) return '';
    return this.showUser.statuses_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  get countFollowing() {
    return this.showUser.friends_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  get countFollower() {
    return this.showUser.followers_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  get name() {
    return this.showUser.name;
  }
  get screenName() {
    const ret = this.showUser.protected
      ? `@${this.showUser.screen_name} 🔒`
      : `@${this.showUser.screen_name}`;

    return ret;
  }

  get selectName() {
    return moduleProfile.selectUser.name;
  }

  get selectScreenName() {
    return `@${moduleProfile.selectUser.screen_name}`;
  }

  get userBio() {
    let text = this.showUser.description;
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
    return this.showUser.location;
  }

  get url() {
    const entities = this.showUser.entities;
    if (!entities) return '';
    if (entities.url?.urls?.length > 0) {
      return entities.url.urls[0].expanded_url;
    } else {
      return '';
    }
  }

  OnClickFollow(e: MouseEvent) {
    moduleUtil.Follow(this.showUser);
  }
  OnClickShowFollowing(e: MouseEvent) {
    moduleProfile.ClearProfileState();
    moduleProfile.ChangeSelectUser(this.showUser);
    this.LoadFollowingList();
    this.LoadFollowerList();
  }
  OnClickShowFollower(e: MouseEvent) {
    moduleProfile.ClearProfileState();
    moduleProfile.ChangeSelectUser(this.showUser);
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
  OnClickProfileURL() {
    if (!this.showUser.url) return;
    const url = this.showUser.entities.url.urls.find(x => x.url === this.showUser.url);
    if (!url) return;
    window.preload.OpenBrowser(url?.expanded_url);
  }
}
