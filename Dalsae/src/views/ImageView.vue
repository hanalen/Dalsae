<template>
  <!-- v-app으로 변경 v-app으로 바꾸면 트윗,이미지,보톰 사이즈 알아서 계산 해줌 -->
  <v-app>
    <v-main app>
      <v-container fluid>
        <tweet-image v-if="option.isShowTweet" :tweet="tweet" :option="option"></tweet-image>
      </v-container>
      <v-container :id="main">
        <image-content :tweet="tweet" :index="index"> </image-content>
      </v-container>
    </v-main>
    <v-footer fixed height="120">
      <div class="bottom">
        <image-popup-preview v-for="(media, i) in media" :media="media" :key="i">
        </image-popup-preview>
      </div>
    </v-footer>
  </v-app>
</template>

<style lang="scss" scoped>
#main {
  height: calc(100% - 120px) !important;
}
.bottom {
  display: flex;
}
.v-toolbar__content {
  align-items: baseline !important;
}
</style>

<script lang="ts">
import { Vue, Component, Mixins } from 'vue-property-decorator';
import * as I from '@/Interfaces';
import * as MIX from '@/mixins';

@Component
export default class Image extends Mixins(MIX.ImagePage) {
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
