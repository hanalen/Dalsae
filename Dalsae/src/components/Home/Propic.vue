<template>
  <div class="propic">
    <img :src="img" class="propic" :class="imgClass" />
  </div>
</template>

<style lang="scss" scoped>
.propic {
  margin-left: 4px;
  object-fit: contain;
  border-radius: 12px;
  margin-bottom: auto;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
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
</style>

<script lang="ts">
import { DalsaeApp, DalsaePage, TweetBase } from '@/mixins';
import { Vue, Mixins, Component, Ref, Provide, Inject, Prop } from 'vue-property-decorator';
import * as I from '@/Interfaces';
@Component
export default class Propic extends Mixins(DalsaePage) {
  @Prop()
  user!: I.User;

  get img() {
    if (!this.user) return '';
    else return this.user.profile_image_url_https;
    return this.mngOption.uiOption.isBigPropic
      ? this.user.profile_image_url_https.replace('_normal', '_bigger')
      : this.user.profile_image_url_https;
  }

  get imgClass() {
    if (!this.mngOption.uiOption.isShowPropic) return 'empty';
    else if (this.mngOption.uiOption.isBigPropic) return 'big';
    else return 'normal';
  }
}
</script>
