<template>
  <div class="user-small" @click="OnClickUser" :class="{ selected: selected }">
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
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  // height: 57px;
  border-bottom: dashed 1px rgba(0, 0, 0, 0.12);
}
.selected {
  background-color: rgb(201, 201, 201) !important;
}
.user-small:hover {
  background-color: rgb(218, 218, 218) !important;
}
.user-name {
  font-weight: bold;
  font-size: 14px !important;
}
span {
  width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-screen-name {
  width: 100%;
  font-size: 12px !important;
}
img {
  border-radius: 6px;
  object-fit: none;
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

  @Prop()
  index!: number;

  get propic() {
    return this.user.profile_image_url_https;
  }

  get name() {
    return this.user.name;
  }

  get screenName() {
    return this.user.screen_name;
  }

  get selected() {
    return moduleModal.stateAutoComplete.indexAutoComplete === this.index;
  }

  OnClickUser(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.$emit('on-click-small-user', this.user);
  }
}
</script>
