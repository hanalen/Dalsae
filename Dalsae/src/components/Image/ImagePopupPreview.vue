<template>
  <div @click="PreviewClick(media)" class="img-preview">
    <img :src="media.media_url_https" class="bottom-preview" />
  </div>
</template>

<style lang="scss" scoped>
.img-preview {
  margin: 4px;
  width: auto;
  height: 120px;
}
img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 12px;
}
</style>

<script lang="ts">
import { Vue, Component, Mixins } from 'vue-property-decorator';
import * as I from '@/Interfaces';
import TwitterAPI from '@/API/APICall';
import * as MIX from '@/mixins/Image';

@Component
export default class ImagePopupPreview extends Mixins(MIX.ImagePopupPreviewBase) {}
</script>
