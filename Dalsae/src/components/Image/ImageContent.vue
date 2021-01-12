<template>
  <div>
    <div class="image-content" @mousewheel="MouseWheel">
      <div class="arrow" v-if="media.length > 1 && !state.isZoom">
        <div class="left-button">
          <v-icon x-large>mdi-chevron-left</v-icon>
        </div>
        <div class="right-button">
          <v-icon x-large>mdi-chevron-right</v-icon>
        </div>
      </div>
      <div
        ref="imgDiv"
        v-show="i == state.index"
        v-for="(image, i) in media"
        :key="i"
        class="img-div"
      >
        <img
          ref="img"
          :src="image.media_url_https"
          class="img-content"
          :class="{ zoom: state.isZoom }"
          :style="{ imgStyle }"
          @mousedown="MouseDown"
          @mouseleave="MouseLeave"
          @mouseup="MouseUp"
          @mousemove="MouseMove"
        />
      </div>
    </div>
    <div class="bottom">
      <image-popup-preview v-for="(media, i) in media" :media="media" :key="i">
      </image-popup-preview>
      <!-- <div v-for="(image, i) in media" @click="ChangeImage(i)" :key="i" class="img-preview">
        <img :src="image.media_url_https" class="bottom-preview" />
      </div> -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
.image-content {
  overflow-y: scroll;
  overflow-x: scroll;
  overflow: hidden;
  margin: auto;
}
.img-div {
  height: calc(85vh - 140px);
  display: flex;
  justify-content: center;
  align-items: center;
}
.img-content {
  display: block;
  object-fit: scale-down;
  margin: auto;
  max-width: 100%;
  max-height: 100%;
  height: auto;
  cursor: pointer;
}
.left-button {
  position: absolute;
  left: 20px;
  top: 50%;
  color: white;
}
.right-button {
  position: absolute;
  right: 20px;
  top: 50%;
  color: white;
}
.zoom {
  object-fit: cover;
}
.bottom {
  display: flex;
}
</style>

<script lang="ts">
import { Vue, Component, Mixins } from 'vue-property-decorator';
import { TweetDataManager } from '@/Managers/TweetDataMng';
import * as I from '@/Interfaces';
import TwitterAPI from '@/API/APICall';
import * as MIX from '@/mixins';

@Component
export default class ImageContent extends Mixins(MIX.ImageContentBase) {}
</script>
