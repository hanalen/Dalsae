<template>
  <div :class="imgClass">
    <img :src="img" :style="imgSize" />
  </div>
</template>

<style lang="scss" scoped>
.v-avatar {
  // margin-left: 4px;
  object-fit: contain;
  border-radius: 10px !important;
  // margin-bottom: auto;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}
img {
  width: 100%;
  object-fit: contain;
  border-radius: 10px;
}
.empty {
  display: none !important;
}
.big {
  width: 73px;
}
.normal {
  width: 48px;
}
.v-badge__badge:after {
  transform: none !important;
}
</style>

<script lang="ts">
import { DalsaeApp, TweetBase } from '@/mixins';
import { Vue, Mixins, Component, Ref, Provide, Inject, Prop } from 'vue-property-decorator';
import * as I from '@/Interfaces';
import store from '@/store';
import { moduleOption } from '@/store/modules/OptionStore';

@Component
export default class Propic extends Vue {
  @Prop()
  user!: I.User;

  @Prop()
  size!: number;

  get imgSize() {
    return {
      width: this.maxWidth + 'px'
    };
  }

  get uiOption() {
    return moduleOption.uiOption;
  }

  get maxWidth() {
    if (this.size) return this.size;
    else return this.uiOption.isBigPropic ? 73 : 48;
  }

  get img() {
    return this.uiOption.isBigPropic
      ? this.user.profile_image_url_https.replace('_normal', '')
      : this.user.profile_image_url_https.replace('_normal', '_bigger');
  }

  get imgClass() {
    if (!this.uiOption.isShowPropic) return 'empty';
    else if (this.size) return '';
    else if (this.uiOption.isBigPropic) return 'big';
    else return 'normal';
  }
}
</script>
