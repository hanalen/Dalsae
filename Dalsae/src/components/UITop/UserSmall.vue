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
  padding: 4px;
  border-bottom: dashed 1px rgba(0, 0, 0, 0.12);
}
.user-small:hover {
  background-color: rgb(218, 218, 218) !important;
}
.user-name {
  font-weight: bold;
}
.user-screen-name {
  font-size: 12px;
}
img {
  border-radius: 6px;
}
</style>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */
import { Vue, Mixins, Component, Ref, Provide, Prop } from 'vue-property-decorator';
import * as I from '@/Interfaces';
import { moduleModal } from '@/store/modules/ModalStore';

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

  // get selected() {
  //   return moduleModal.SetAutoComplete;
  // }

  OnClickUser(e: MouseEvent) {
    console.log(e);
    this.$emit('on-click-small-user', this.user);
  }
}
</script>
