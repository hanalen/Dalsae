<template>
  <div
    class="image-preview"
    :style="{ 'max-width': maxWidth }"
    @mouseover="MouseOver"
    @mouseout="MouseOut"
    @click="Click"
    v-if="media"
  >
    <v-icon class="icon-video" color="primary" size="50" v-if="isVideo"
      >mdi-play-circle-outline
    </v-icon>
    <div class="tweet-images-group" v-show="isHover">
      <img class="tweet-image" v-for="(item, i) in media" :key="i" :src="imgPreview(item)" />
    </div>
    <div class="tweet-images img">
      <img
        :id="'img' + i"
        class="tweet-image"
        v-for="(item, i) in media"
        :key="i"
        :src="imgPreview(item)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.image-preview {
  position: relative;
}
.icon-video {
  position: absolute !important;
  left: 25%;
  top: 25%;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
}
.image-preview:hover {
  cursor: pointer;
}
.tweet-images-group {
  position: absolute;
  right: 120px;
  background: white;
  padding: 4px;
  margin-top: -4px;
  border-radius: 12px;

  backdrop-filter: blur(5px);
  :not(:last-child) {
    margin-right: 4px;
  }
}
.tweet-images {
  display: inline-flex;
  cursor: pointer;
  height: 100px;
  border-radius: 12px;
  box-shadow: 0 5px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  :not(:last-child) {
    margin-right: -95px;
  }
}
.tweet-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 12px;
}
</style>

<script lang="ts">
import { ImagePreviewBase } from '@/mixins';
import { Vue, Mixins, Component, Ref, Provide, Inject, Prop } from 'vue-property-decorator';
import * as I from '@/Interfaces';
@Component
export default class ImagePreview extends Mixins(ImagePreviewBase) {}
</script>
