<template>
  <!-- v-app으로 변경 v-app으로 바꾸면 트윗,이미지,보톰 사이즈 알아서 계산 해줌 -->
  <v-app>
    <v-main app>
      <v-container fluid :style="styleTop">
        <div :style="styleTweet" ref="refTweet">
          <tweet-image v-if="option.isShowTweet" :tweet="tweet" :option="option"></tweet-image>
        </div>
        <v-btn
          v-if="isBigTweet && !bExpanded"
          icon
          rounded
          width="100vw"
          height="30"
          class="btn-expand"
          @click="OnClickExpand"
        >
          <v-icon :color="'primary'" size="40">
            mdi-chevron-down
          </v-icon>
        </v-btn>
      </v-container>
      <v-container>
        <image-content
          :style="styleContent"
          :tweet="tweet"
          :index="index"
          v-on:on-prev="OnPrev"
          v-on:on-next="OnNext"
        >
        </image-content>
      </v-container>
    </v-main>
    <v-footer fixed height="120">
      <div class="bottom">
        <image-popup-preview
          v-for="(media, i) in media"
          :media="media"
          :key="i"
          v-on:on-click-media="OnClickMedia"
        >
        </image-popup-preview>
      </div>
    </v-footer>
  </v-app>
</template>

<style lang="scss" scoped>
#main {
  height: calc(100% - 120px) !important;
}
.btn-expand {
  background-color: rgba(160, 160, 160, 0.11);
}
.bottom {
  display: flex;
}
.v-toolbar__content {
  align-items: baseline !important;
}
</style>

<script lang="ts">
import { Vue, Component, Mixins, Ref } from 'vue-property-decorator';
import * as I from '@/Interfaces';
import * as MIX from '@/mixins';
@Component
export default class ImageView extends Mixins(MIX.ImagePage) {
  @Ref()
  refTweet!: HTMLElement;
  bExpanded = false;
  bMounted = false;
  get styleTop() {
    if (!this.bExpanded) {
      return {
        'max-height': '180px'
      };
    }
  }
  get styleTweet() {
    if (!this.bExpanded) {
      return {
        'max-height': '150px',
        overflow: 'hidden'
      };
    }
  }
  get styleContent() {
    return {
      height: 'calc(100vh - 300px)'
    };
  }
  get isBigTweet() {
    if (!this.bMounted) return;
    const height = this.refTweet.clientHeight;
    if (height >= 150) {
      return true;
    } else {
      return false;
    }
  }
  OnClickExpand(e: MouseEvent) {
    this.bExpanded = true;
  }
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

  async created() {
    this.tweet = window.preload.LoadTestImageTweet();
    this.$nextTick(() => {
      this.bMounted = true;
    });
    return;
    console.log('img window created');
    const id = this.$route.query.tweetId;
    console.log('id: ' + id);
    if (id) {
      const option = window.preload.image.GetOption(id.toString());
      this.option = JSON.parse(option);
      const json = window.preload.image.GetTweet(id.toString());
      this.tweet = JSON.parse(json);
      console.log(this.tweet);
      console.log(this.option);
    }
  }
}
</script>
