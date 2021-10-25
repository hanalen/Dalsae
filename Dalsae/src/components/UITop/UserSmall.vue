<template>
  <div class="user-small" @click="OnClickUser">
    <img :src="propic" />
    <div>
      <span class="user-name"> {{ name }} </span><br />
      <span class="user-screen-name">
        {{ screenName }}
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user-small {
  display: flex;
}
.user-name {
  font-weight: bold;
}
.user-screen-name {
  font-size: 12px;
}
</style>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */
import { Vue, Mixins, Component, Ref, Provide, Prop } from 'vue-property-decorator';
import * as I from '@/Interfaces';
import { moduleProfile } from '@/store/modules/ProfileStore';
import { moduleApi } from '@/store/modules/APIStore';
import { moduleUtil } from '@/store/modules/UtilStore';
import { ContextItem } from '@/mixins';
import { moduleSwitter } from '@/store/modules/SwitterStore';

@Component
export default class ProfileUser extends Vue {
  @Prop()
  user!: I.User;

  get propic() {
    return this.user.profile_image_url_https;
  }

  get name() {
    return this.user.name;
  }

  get screenName() {
    return this.user.screen_name;
  }

  OnClickUser(e: MouseEvent) {
    console.log(e);
    this.$emit('on-click-small-user', this.user);
  }
}
</script>
