<template>
  <div class="image-content" @mousewheel="MouseWheel">
    <div>
      <div class="arrow" v-if="media.length > 1 && !isZoom">
        <div class="left-button">
          <v-icon>mdi-chevron-left</v-icon>
        </div>
        <div class="right-button">
          <v-icon>mdi-chevron-right</v-icon>
        </div>
      </div>
      <div ref="imgDiv" v-show="i == index" v-for="(image, i) in media" :key="i" class="img-div">
        <img
          ref="img"
          :src="image.media_url_https"
          class="img-content"
          :class="{ zoom: isZoom }"
          :style="{
            transform: 'translate(' + marginLeft + 'px' + ',' + marginTop + 'px)',
            'max-width': maxWidth == 0 ? '100%' : maxWidth + 'px',
            'max-height': maxHeight == 0 ? '100%' : maxHeight + 'px'
          }"
          @mousedown="MouseDown"
          @mouseleave="MouseLeave"
          @mouseup="MouseUp"
          @mousemove="MouseMove"
        />
      </div>
    </div>
    <div class="bottom">
      <div v-for="(image, i) in media" @click="ChangeImage(i)" :key="i" class="img-preview">
        <img :src="image.media_url_https" class="bottom-preview" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Mixins } from 'vue-property-decorator';
import { TweetDataManager } from '@/Managers/TweetDataMng';
import * as I from '@/Interfaces';
import TwitterAPI from '@/API/APICall';
import * as MIX from '@/mixins';

@Component
export default class ImageContent extends Mixins(MIX.ImageContentBase) {}
</script>
