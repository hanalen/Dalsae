<template>
  <div :class="imgClass">
    <v-badge :value="user.verified" avatar bottom overlap color="white" offset-x="20" offset-y="20">
      <template v-slot:badge>
        <v-icon style="font-size:18px; color:#1da1f2">mdi-check-decagram</v-icon>
      </template>
      <v-avatar rounded :size="maxWidth">
        <img :src="img" :class="imgClass" />
      </v-avatar>
    </v-badge>
  </div>
</template>

<style lang="scss" scoped>
.propic {
  // margin-left: 4px;
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
.v-badge__badge:after {
  transform: none !important;
}
</style>

<script lang="ts">
import { DalsaeApp, DalsaePage, TweetBase, ImagePage } from '@/mixins';
import { Vue, Mixins, Component, Ref, Provide, Inject, Prop } from 'vue-property-decorator';
import * as I from '@/Interfaces';
@Component
export default class PropicImage extends Mixins(Vue) {
  @Prop()
  user!: I.User;

  @Prop()
  option!: I.UIOption;

  get maxWidth() {
    return this.option.isBigPropic ? 73 : 48;
  }

  get img() {
    return this.option.isBigPropic
      ? this.user.profile_image_url_https.replace('_normal', '_bigger')
      : this.user.profile_image_url_https;
  }

  get imgClass() {
    if (!this.option.isShowPropic) return 'empty';
    else if (this.option.isBigPropic) return 'big';
    else return 'normal';
  }
}
</script>
