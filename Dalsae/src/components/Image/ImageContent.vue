<template>
  <div class="image-content">
    <div v-if="Video.type == 'photo'" @mousewheel="MouseWheel">
      <div class="arrow" v-if="tweet.orgTweet.extended_entities.media.length > 1 && !isZoom">
        <div class="left-button">
          <i class="fas fa-chevron-left fa-2x" @click="Prev"></i>
        </div>
        <div class="right-button">
          <i class="fas fa-chevron-right fa-2x" @click="Next"></i>
        </div>
      </div>
      <div
        ref="imgDiv"
        v-show="i == index"
        v-for="(image, i) in tweet.orgTweet.extended_entities.media"
        :key="i"
        class="img-div"
      >
        <img
          ref="img"
          :src="ImgPath(image.media_url_https)"
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
    <div class="bottom" v-if="Video.type == 'photo'">
      <div
        v-for="(image, i) in tweet.orgTweet.extended_entities.media"
        @click="ChangeImage(i)"
        :key="i"
        class="img-preview"
      >
        <img :src="image.media_url_https" class="bottom-preview" />
        <ProgressBar ref="progress" :percent="listProgressPercent[i]" />
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
export default class ImageContent extends Mixins(MIX.ImageContentBase) {
  ClickLink(e: Event) {
    // const listTweet: I.Tweet[] = TweetDataManager.listTweet as I.Tweet[];
    // console.log(listTweet[this.index]);
    // window.preload.image.OpenImageWindow(
    //   listTweet[this.index].id_str.toString(),
    //   listTweet[this.index]
    // );
    // this.index++;
  }

  async ClickModal() {
    // await this.ShowMessage('modal test');
  }

  async created() {}
}
</script>
