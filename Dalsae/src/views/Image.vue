<template>
  <div class="image-view">
    <span>이미지 뷰어</span>
    <tweet-image v-if="tweet" :tweet="tweet" :option="option"></tweet-image>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Mixins } from 'vue-property-decorator';
import { TweetDataManager } from '@/Managers/TweetDataMng';
import * as I from '@/Interfaces';
import TwitterAPI from '@/API/APICall';
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
      const json = window.preload.image.GetTweet(id.toString());
      this.tweet = JSON.parse(json);
      console.log(this.tweet)
    }
  }
}
</script>
