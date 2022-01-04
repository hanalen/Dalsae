/* eslint-disable @typescript-eslint/camelcase */
import { Vue, Component, Provide, Watch, Ref } from 'vue-property-decorator';
import * as MIX from '@/mixins';
import * as I from '@/Interfaces';
import * as A from '@/store/Interface';
import { moduleApi } from '@/store/modules/APIStore';
import { moduleProfile } from '@/store/modules/ProfileStore';
import { moduleSwitter } from '@/store/modules/SwitterStore';
import { moduleUtil } from '@/store/modules/UtilStore';
import { moduleSysbar } from '@/store/modules/SystemBarStore';
import { moduleModal } from '@/store/modules/ModalStore';
import { EIPcType, ScrollPanelBase } from '@/mixins';
import twitterRequest from '@/API/TwitterRequest';

@Component
export class ProfilePage extends Vue {
  state = {
    name: '',
    bio: '',
    place: '',
    url: ''
  };
  @Ref()
  refScrollFollowing!: ScrollPanelBase;
  @Ref()
  refScrollFollower!: ScrollPanelBase;
  get isUpdateProfile() {
    return moduleProfile.stateProfile.isUpdateProfile;
  }
  get isLoadFollowing() {
    return moduleProfile.stateProfile.isLoadFollowing;
  }
  get isLoadFollower() {
    return moduleProfile.stateProfile.isLoadFollower;
  }
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

  get isLoadRequest() {
    return moduleProfile.stateProfile.isLoadRequestIds;
  }

  get verified() {
    return moduleProfile.showUser.verified;
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

  get indexFollowing() {
    return moduleProfile.stateProfile.indexFollowing;
  }

  get indexFollower() {
    return moduleProfile.stateProfile.indexFollower;
  }

  get styleScroll() {
    return {
      height: 'calc(100vh - 552px)'
    };
  }

  isShowContext = false;
  x = 0;
  y = 0;

  @Watch('selectAccount', { immediate: true, deep: true })
  OnChangeSelectAccount(newVal: I.DalsaeUser) {
    if (!newVal) return;
    if (!newVal.oauth_token) return;
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
    moduleApi.friendships.Outgoing({ stringify_ids: true, cursor: '-1' });
  }

  @Watch('isLoadFollowerIds', { immediate: true, deep: true })
  OnChangeLoadFollwerIds(newVal: I.DalsaeUser) {
    if (newVal) {
      moduleSysbar.AddSystemBar({
        type: A.ESystemBar.EFOLLOWERIDS,
        icon: 'mdi-account-arrow-left-outline',
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
        icon: 'mdi-account-arrow-right-outline',
        text: '',
        toolTip: '팔로잉 불러오는 중...'
      });
    } else {
      moduleSysbar.RemoveSystemBar(A.ESystemBar.EFOLLOWINGIDS);
    }
  }

  @Watch('isLoadRequest', { immediate: true, deep: true })
  OnChangeLoadRequestIds(newVal: I.DalsaeUser) {
    if (newVal) {
      moduleSysbar.AddSystemBar({
        type: A.ESystemBar.EFOLLOW_REQUEST_IDS,
        icon: 'mdi-account-clock-outline',
        text: '',
        toolTip: '팔로우 요청 불러오는 중...'
      });
    } else {
      moduleSysbar.RemoveSystemBar(A.ESystemBar.EFOLLOW_REQUEST_IDS);
    }
  }

  get listUser() {
    return moduleSwitter.stateSwitter.switter.listUser;
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

  async LoadFollowerList(cursor = '-1') {
    if (moduleProfile.stateProfile.isLoadFollower) return;
    moduleProfile.SetState({ ...moduleProfile.stateProfile, isLoadFollower: true });
    const { screen_name } = moduleProfile.selectUser;
    const resp = await moduleApi.followers.List(
      { screen_name: screen_name, count: 200, cursor: cursor },
      '',
      false
    );
    moduleProfile.SetState({ ...moduleProfile.stateProfile, isLoadFollower: false });

    if (!twitterRequest.CheckAPIError(resp.data)) {
      moduleProfile.SetSelectUserFollowerList(resp.data);
    }
  }

  async LoadFollowingList(cursor = '-1') {
    if (moduleProfile.stateProfile.isLoadFollowing) return;
    moduleProfile.SetState({ ...moduleProfile.stateProfile, isLoadFollowing: true });
    const { screen_name } = moduleProfile.selectUser;
    const resp = await moduleApi.friends.List(
      { screen_name: screen_name, count: 200, cursor: cursor },
      '',
      false
    );
    moduleProfile.SetState({ ...moduleProfile.stateProfile, isLoadFollowing: false });

    if (!twitterRequest.CheckAPIError(resp.data)) {
      moduleProfile.SetSelectUserFollowingList(resp.data);
    }
  }

  get listFollower() {
    return moduleProfile.listFollower.users;
  }

  get listFollowing() {
    return moduleProfile.listFollowing.users;
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
    if (moduleProfile.listRequestIds.ids.findIndex(x => x === user.id_str) > -1) {
      return '팔로우 요청 중';
    } else if (moduleProfile.listFollowingIds.ids.findIndex(x => x === user.id_str) > -1) {
      return '언팔로우';
    } else {
      return '팔로잉';
    }
  }

  get editMode() {
    return moduleProfile.stateProfile.isEditMode;
  }

  get editText() {
    return moduleProfile.stateProfile.isEditMode ? '저장' : '프로필 수정';
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
        text = text.replace(url.url, `<span class="url" ref="refUrl">${url.display_url}</span>`);
      });
    }
    if (description) {
      description.urls.forEach(url => {
        text = text.replace(url.url, `<span class="url" ref="refUrl">${url.display_url}</span>`);
      });
    }
    return text;
  }

  OnClickLink(e: MouseEvent) {
    const el = e.target as Element;
    if (el.tagName === 'SPAN' && el.className === 'url') {
      const { entities } = moduleProfile.showUser;
      const { description } = entities;
      const find = description.urls.find(x => x.display_url === el.innerHTML);
      if (find) {
        window.ipc.browser.OpenBrowser(find.expanded_url);
      }
    }
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
    moduleSwitter.SetStateSwitter({
      ...moduleSwitter.stateSwitter,
      switter: { ...moduleSwitter.stateSwitter.switter, selectUser: user }
    });
  }

  ClickTweet() {
    window.ipc.ipcPipe.send(EIPcType.EShowUserTweet, { screen_name: this.showUser.screen_name });
  }
  OnClickProfileURL() {
    if (!this.showUser.url) return;
    const url = this.showUser.entities.url.urls.find(x => x.url === this.showUser.url);
    if (!url) return;
    window.ipc.browser.OpenBrowser(url?.expanded_url);
  }

  OnKeyDown(e: KeyboardEvent) {
    if (e.code === 'ArrowUp') {
      e.preventDefault();
      e.stopPropagation();
      if (moduleProfile.stateProfile.selectMenu === 0) {
        let idx = moduleProfile.stateProfile.indexFollowing - 1;
        if (idx < 0) idx = 0;
        moduleProfile.ChangeShowUser(moduleProfile.listFollowing.users[idx]);
        moduleProfile.SetState({ ...moduleProfile.stateProfile, indexFollowing: idx });
      } else {
        let idx = moduleProfile.stateProfile.indexFollower - 1;
        if (idx < 0) idx = 0;
        moduleProfile.ChangeShowUser(moduleProfile.listFollower.users[idx]);
        moduleProfile.SetState({ ...moduleProfile.stateProfile, indexFollower: idx });
      }
    } else if (e.code === 'ArrowDown') {
      e.preventDefault();
      e.stopPropagation();
      if (moduleProfile.stateProfile.selectMenu === 0) {
        let idx = moduleProfile.stateProfile.indexFollowing + 1;
        if (idx >= moduleProfile.listFollowing.users.length) idx = 0;
        moduleProfile.ChangeShowUser(moduleProfile.listFollowing.users[idx]);
        moduleProfile.SetState({ ...moduleProfile.stateProfile, indexFollowing: idx });
      } else {
        let idx = moduleProfile.stateProfile.indexFollower + 1;
        if (idx >= moduleProfile.listFollower.users.length) idx = 0;
        moduleProfile.ChangeShowUser(moduleProfile.listFollower.users[idx]);
        moduleProfile.SetState({ ...moduleProfile.stateProfile, indexFollower: idx });
      }
    } else if (e.code === 'ArrowLeft') {
      e.preventDefault();
      e.stopPropagation();
      moduleProfile.SetState({ ...moduleProfile.stateProfile, selectMenu: 0 });
    } else if (e.code === 'ArrowRight') {
      e.preventDefault();
      e.stopPropagation();
      moduleProfile.SetState({ ...moduleProfile.stateProfile, selectMenu: 1 });
    }
  }
  OnScrollFollowing(e: Event) {
    const { next_cursor_str } = moduleProfile.listFollowing;
    if (next_cursor_str === '0') return;

    const el = e.target as HTMLElement;
    const list = this.refScrollFollowing.stateData.listData;
    const bottomPos = list[list.length - 1].scrollTop + list[list.length - 1].height;
    const scrollPos = el.scrollTop + this.refScrollFollowing.$el.clientHeight;
    if (scrollPos > bottomPos - 100) {
      this.LoadFollowingList(next_cursor_str);
    }
  }
  OnScrollFollower(e: Event) {
    const { next_cursor_str } = moduleProfile.listFollower;
    if (next_cursor_str === '0') return;

    const el = e.target as HTMLElement;
    const list = this.refScrollFollower.stateData.listData;
    const bottomPos = list[list.length - 1].scrollTop + list[list.length - 1].height;
    const scrollPos = el.scrollTop + this.refScrollFollower.$el.clientHeight;
    if (scrollPos > bottomPos - 100) {
      this.LoadFollowerList(next_cursor_str);
    }
  }
  OnClickEdit(e: MouseEvent) {
    const { isEditMode } = moduleProfile.stateProfile;
    if (isEditMode) {
      const { name, url, place, bio } = this.state;
      moduleApi.account.UpdateProfile(name, url, place, bio);
    } else {
      this.state.bio = this.userBio;
      this.state.name = this.name;
      this.state.place = this.place;
      this.state.url = this.url;
    }
    moduleProfile.SetState({ ...moduleProfile.stateProfile, isEditMode: !isEditMode });
  }
}
