/* eslint-disable @typescript-eslint/camelcase */
<template>
  <div class="image-view">
    <span>이미지 뷰어</span>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Mixins } from 'vue-property-decorator';
import { TweetDataManager } from '@/Managers/TweetDataMng';
import * as I from '@/Interfaces';
import TwitterAPI from '@/API/APICall';
import { DalsaePage } from '@/mixins';

class State {
  tweet!: I.Tweet;
  download: number;
  constructor() {
    this.download = 0;
  }
}

@Component
export default class Image extends Vue {
  state = new State();
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
    // const value = window.preload.GetData(this.$route.query.userid);
    this.$nextTick(() => {
      console.log('img window created');
      const id = this.$route.query.tweetId;
      if (id) {
        const json = window.preload.image.GetTweet(id.toString());
        this.state.tweet = JSON.parse(json);
      }
      this.state.tweet = this.mngTweet.homes[0];
    });
  }
}
</script>
