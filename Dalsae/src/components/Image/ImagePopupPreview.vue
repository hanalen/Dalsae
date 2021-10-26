<template>
  <div @click="OnClickMedia" class="img-preview">
    <img :src="media.media_url_https" class="bottom-preview" />
  </div>
</template>

<style lang="scss" scoped>
.img-preview {
  margin: 4px;
  width: auto;
  height: 120px;
  cursor: pointer;
}
img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 12px;
}
</style>

<script lang="ts">
import { Vue, Component, Mixins, Prop } from 'vue-property-decorator';
import * as I from '@/Interfaces';
import * as MIX from '@/mixins/Image';

@Component
export default class ImagePopupPreview extends Vue {
  @Prop()
  media!: I.Media;

  OnClickMedia() {
    this.$emit('on-click-media', this.media);
  }
}
</script>
